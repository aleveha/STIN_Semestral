import { ExchangeRateModel, IExchangeRatePersistence } from "./types";
import { inject, injectable } from "inversify";
import { INJECTABLE } from "../../types";
import { IDatabaseService } from "../../database/types";

@injectable()
export class ExchangeRatePersistence implements IExchangeRatePersistence {
	constructor(@inject(INJECTABLE.databaseService) private readonly databaseService: IDatabaseService) {
	}

	public async getHistory(limit?: number): Promise<ExchangeRateModel[]> {
		const data = !limit ?
			(await this.databaseService.pool.query<ExchangeRateModel>("select * from exchange_rate order by date")) :
			(await this.databaseService.pool.query<ExchangeRateModel>(`select *
                                                                       from exchange_rate
                                                                       order by date desc
                                                                       limit ${limit}`));
		return data.rows as ExchangeRateModel[];
	}

	public async save(exchangeRate: number, date?: Date): Promise<void> {
		await this.databaseService.pool.query<ExchangeRateModel>(
			"insert into exchange_rate(exchange_rate, date) values ($1, $2) on conflict (date) do nothing",
			[exchangeRate, date ?? new Date()],
		);
	}
}