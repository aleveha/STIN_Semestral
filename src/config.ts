import "dotenv/config";
import { exit } from "process";
import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";

type IStage = "prod" | "local";

export const STAGE: IStage = (process.env.STAGE as IStage) ?? "local";
export const TELEGRAM_TOKEN: string = (STAGE === "prod" ? (process.env.TELEGRAM_TOKEN as string) : (process.env.TELEGRAM_TOKEN_DEV as string)) ?? "";
if (TELEGRAM_TOKEN === "") {
	console.log("Telegram token is required!");
	exit();
}
export const BOT: Telegraf<Context<Update>> = new Telegraf(TELEGRAM_TOKEN);

export const EXCHANGE_TOKEN: string = process.env.EXCHANGE_TOKEN ?? "";
if (EXCHANGE_TOKEN === "") {
	console.log("Exchange token is required!");
	exit();
}
