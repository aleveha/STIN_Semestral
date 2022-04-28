import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";
import { Pool } from "pg";

type IStage = "production" | "local";

export const STAGE: IStage | undefined = process.env.NODE_ENV as IStage;
if (!STAGE) {
	throw new Error("NODE_ENV is not defined");
}

export const TELEGRAM_TOKEN: string =
	(STAGE === "production" ? (process.env.TELEGRAM_TOKEN as string) : (process.env.TELEGRAM_TOKEN_DEV as string)) ?? "";
if (TELEGRAM_TOKEN === "") {
	throw new Error("Telegram token is required!");
}
export const BOT: Telegraf<Context<Update>> = new Telegraf(TELEGRAM_TOKEN);

export const EXCHANGE_TOKEN: string = process.env.EXCHANGE_TOKEN ?? "";
if (EXCHANGE_TOKEN === "") {
	throw new Error("Exchange token is required!");
}

export const DB_CLIENT = new Pool({
	host: process.env.DB_HOST ?? "localhost",
	port: 5432,
	user: process.env.DB_USER ?? "postgres",
	password: process.env.DB_PASSWORD ?? "",
	database: process.env.DB_NAME ?? "postgres",
	ssl: {
		rejectUnauthorized: false
	}
});
