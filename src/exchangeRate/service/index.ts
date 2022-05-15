import { ExchangeRate, ExchangeRateDifference, IExchangeRateService, Suggestion } from "./types";
import axios, { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { INJECTABLE } from "../../types";
import { ILoggerService } from "../../logger/types";
import { CONFIG_KEYS, IConfigService } from "../../config/types";
import cron from "node-cron";
import { ExchangeRateModel, IExchangeRatePersistence } from "../persistence/types";
import "reflect-metadata";

@injectable()
export class ExchangeRateService implements IExchangeRateService {
	private readonly exchangeRateApi: AxiosInstance;
	private readonly suggestionLimit: number = 3;

	constructor(
		@inject(INJECTABLE.config) private readonly config: IConfigService,
		@inject(INJECTABLE.logger) private readonly logger: ILoggerService,
		@inject(INJECTABLE.exchangeRatePersistence) private readonly exchangeRatePersistence: IExchangeRatePersistence,
	) {
		this.exchangeRateApi = axios.create({
			baseURL: "http://api.exchangeratesapi.io/",
		});
	}

	public async get(): Promise<number | null> {
		return await this.exchangeRateApi.get<ExchangeRate>("/latest", {
			params: {
				base: "EUR",
				access_key: this.config.get<string>(CONFIG_KEYS.exchangeToken),
			},
		})
			.then(async res => {
				const currency = await ExchangeRateService.parceExchangeRatesData(res.data);
				if (!currency) {
					this.logger.error("[ExchangeRateService] Failed to get currency");
					return null;
				}
				await this.exchangeRatePersistence.save(currency);
				return currency;
			})
			.catch(err => {
				this.logger.error("[ExchangeRateService] Get exchange rates error:\n" + err);
				return null;
			});
	}

	public async history(): Promise<ExchangeRateModel[]> {
		return await this.exchangeRatePersistence.getHistory();
	}

	public async getDailyExchangeRate(): Promise<boolean> {
		const currency = await this.get();

		if (!currency) {
			this.logger.error("[ExchangeRateService] Daily exchange rate was not saved");
			return false;
		}

		this.logger.info(`[ExchangeRateService] Daily exchange rate ${currency} saved at ${new Date().toLocaleString("cs")}`);
		return true;
	}

	public async startScheduler(): Promise<void> {
		cron.schedule("0 0 * * *", this.getDailyExchangeRate);
		this.logger.info("[ExchangeRateService] Exchange rate scheduler has been started");
	}

	private static async parceExchangeRatesData(data: ExchangeRate): Promise<number | null> {
		return data.rates ? parseFloat(data.rates.CZK.toFixed(2)) : null;
	}

	public async suggest(): Promise<Suggestion | null> {
		await this.get();
		const rates = await this.exchangeRatePersistence.getHistory(this.suggestionLimit + 1);
		if (rates.length < this.suggestionLimit + 1) {
			return null;
		}
		const current = rates[0].exchange_rate;
		const history = rates.slice(1);
		const avg = parseFloat((history.map(elem => elem.exchange_rate).reduce((prev, curr) => prev + curr, 0) / history.length).toFixed(2));
		const diff = rates.map((elem, index): ExchangeRateDifference | null => {
			if (index === 0) {
				return null;
			}
			return {
				dateFrom: rates[index - 1].date,
				dateTo: elem.date,
				value: parseFloat((rates[index - 1].exchange_rate - elem.exchange_rate).toFixed(2)),
			};
		}).filter((elem): elem is ExchangeRateDifference => elem !== null).reverse();
		const isDown = history.reverse().every((elem, index) => {
			if (index === 0) {
				return true;
			}
			return elem.exchange_rate < history[index - 1].exchange_rate;
		});
		const avgPercentage = parseFloat((((current - avg) / avg) * 100).toFixed(2));
		return {
			avg,
			avgPercentage,
			current,
			diff,
			diffAvg: parseFloat((current - avg).toFixed(2)),
			diffAllPercentage: parseFloat((((current - rates[rates.length - 1].exchange_rate) / rates[rates.length - 1].exchange_rate) * 100).toFixed(2)),
			result: isDown ? isDown : avgPercentage <= 0.1,
		};
	}
}