import { BOT, STAGE } from "./config";
import { startHandler, helpHandler, infoHandler, nameHandler, currencyHandler, timeHandler } from "./handlers";

async function registerHandlers(): Promise<void> {
	BOT.start(async ctx => await startHandler(ctx));
	BOT.help(async ctx => await helpHandler(ctx));
	BOT.command("info", async ctx => await infoHandler(ctx));
	BOT.command("name", async ctx => await nameHandler(ctx));
	BOT.command("currency", async ctx => await currencyHandler(ctx));
	BOT.command("time", async ctx => await timeHandler(ctx));
}

async function main(): Promise<void> {
	await registerHandlers();
	STAGE === "production" ? await BOT.launch({
		webhook: {
			domain: "https://stin-bot.herokuapp.com",
			host: "127.0.0.1",
			port: 8443,
		},
	}) : await BOT.launch();
}

main();
