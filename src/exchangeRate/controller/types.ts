import { TextContext } from "../../types";

/**
 * @description Exchange rate controller interface
 */
export interface IExchangeRateController {
	/**
	 *
	 * @param ctx telegram context
	 * @description get exchange rate
	 */
	get(ctx: TextContext): Promise<void>;

	/**
	 *
	 * @param ctx telegram context
	 * @description get exchange rate history
	 */
	history(ctx: TextContext): Promise<void>;

	/**
	 *
	 * @param ctx telegram context
	 * @description suggest currency to buy depending on the current exchange rate
	 */
	suggest(ctx: TextContext): Promise<void>;
}