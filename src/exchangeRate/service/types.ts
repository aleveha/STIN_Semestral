import { ExchangeRateModel } from "../persistence/types";

interface Rates {
	[key: string]: number;
}

interface Error {
	code: number;
	type: string;
	info: string;
}

export interface ExchangeRate {
	success: boolean;
	timestamp?: number;
	base?: string;
	date?: string;
	rates?: Rates;
	error?: Error;
}

/**
 * @description Exchange rate API interface
 */
export interface IExchangeRateService {
	/**
	 * @description Get latest exchange rate
	 */
	get(): Promise<number | null>;

	/**
	 * @description Get exchange rate history
	 */
	history(): Promise<ExchangeRateModel[]>;

	/**
	 * @description Save exchange rate history
	 */
	getDailyExchangeRate(): Promise<boolean>;

	/**
	 * @description start scheduler to get exchange rate every day
	 */
	startScheduler(): Promise<void>;
}