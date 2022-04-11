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

async function launchBot(): Promise<void> {
	STAGE === "local" ? await BOT.launch() : await BOT.launch();
}

async function main(): Promise<void> {
	await registerHandlers();
	await launchBot();
}

main();
