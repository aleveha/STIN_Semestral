import { ExchangeRateModel, IExchangeRatePersistence } from "./types";
import { inject, injectable } from "inversify";
import { INJECTABLE } from "../../types";
import { IDatabaseService } from "../../database/types";

@injectable()
export class ExchangeRatePersistence implements IExchangeRatePersistence {
	constructor(@inject(INJECTABLE.databaseService) private readonly databaseService: IDatabaseService) {
	}

	public async getHistory(): Promise<ExchangeRateModel[]> {
		return (await this.databaseService.pool.query<ExchangeRateModel>("select * from exchange_rate order by date")).rows as ExchangeRateModel[];
	}

	public async save(exchangeRate: string, date?: Date): Promise<void> {
		await this.databaseService.pool.query<ExchangeRateModel>(
			"insert into exchange_rate(exchange_rate, date) values ($1, $2) on conflict (date) do nothing",
			[exchangeRate, date ?? new Date()],
		);
	}
}