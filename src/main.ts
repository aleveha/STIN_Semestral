import { BOT, DB_CLIENT, STAGE, TELEGRAM_TOKEN } from "./config";
import { currencyHandler, currencyHistoryHandler, helpHandler, infoHandler, nameHandler, startHandler, timeHandler } from "./handlers";

async function registerHandlers(): Promise<void> {
	BOT.start(async ctx => await startHandler(ctx));
	BOT.help(async ctx => await helpHandler(ctx));
	BOT.command("info", async ctx => await infoHandler(ctx));
	BOT.command("name", async ctx => await nameHandler(ctx));
	BOT.command("currency", async ctx => await currencyHandler(ctx));
	BOT.command("currencyHistory", async ctx => await currencyHistoryHandler(ctx));
	BOT.command("time", async ctx => await timeHandler(ctx));
}

async function startWebhook(): Promise<void> {
	await BOT.launch({
		webhook: {
			domain: "https://stin-bot.herokuapp.com",
			hookPath: `/${TELEGRAM_TOKEN}`,
			host: "0.0.0.0",
			port: parseInt(process.env.PORT ?? "8443"),
		},
	});
}

async function main(): Promise<void> {
	DB_CLIENT.connect().then(() => console.log("Connected to DB"));
	await registerHandlers();
	STAGE === "production" ? await startWebhook() : await BOT.launch();
	console.log(`Bot has been started on stage: ${STAGE}`);
}

main();
