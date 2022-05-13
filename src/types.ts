import { Context, NarrowedContext } from "telegraf";
import { Update } from "typegram";
import { MountMap } from "telegraf/typings/telegram-types";

export type MessageContext = NarrowedContext<Context<Update>, MountMap["message"]>;
export type TextContext = NarrowedContext<Context<Update>, MountMap["text"]>;

export const INJECTABLE = {
	app: Symbol("App"),
	config: Symbol.for("Config"),
	logger: Symbol.for("Logger"),
	databaseService: Symbol.for("DatabaseService"),
	exchangeRateController: Symbol.for("ExchangeRateController"),
	exchangeRateService: Symbol.for("ExchangeRateService"),
	exchangeRatePersistence: Symbol.for("ExchangeRatePersistence"),
	sharedController: Symbol.for("SharedController"),
};
