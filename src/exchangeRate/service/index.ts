import { ExchangeRate, IExchangeRateService } from "./types";
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

	private static async parceExchangeRatesData(data: ExchangeRate): Promise<string | null> {
		return data.rates ? data.rates.CZK.toFixed(2).toString() : null;
	}
}