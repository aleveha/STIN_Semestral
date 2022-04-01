import "dotenv/config";
import { exit } from "process";
import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";

type IStage = "prod" | "local";

export const STAGE: IStage = (process.env.STAGE as IStage) ?? "local";
const TOKEN: string | undefined = STAGE === "prod" ? (process.env.TOKEN as string) : (process.env.TOKEN_DEV as string);
if (TOKEN === undefined) {
	console.log("Telegram token is required!");
	exit();
}

export const BOT: Telegraf<Context<Update>> = new Telegraf(TOKEN);
