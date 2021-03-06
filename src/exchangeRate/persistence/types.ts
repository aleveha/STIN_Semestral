/**
 * @description Exchange rate persistence interface
 */
export interface IExchangeRatePersistence {
	/**
	 * @description Get all exchange rates
	 */
	getHistory(limit?: number): Promise<ExchangeRateModel[]>;

	/**
	 *
	 * @param exchangeRate exchange rate to be added
	 * @param date date of the exchange rate
	 * @description Add exchange rate to the database
	 */
	save(exchangeRate: number, date?: Date): Promise<void>;
}

export interface ExchangeRateModel {
	id: number;
	exchange_rate: number;
	date: Date;
}