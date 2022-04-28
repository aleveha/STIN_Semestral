import { TextContext } from "./types";
import { getDateString, getExchangeRates } from "./utils";
import { getExchangeRateHistory, saveExchangeRate } from "./database";

export async function startHandler(ctx: TextContext): Promise<void> {
	await ctx.reply("Zdravím! Jsem bot, který něco umí 🙃");
	await ctx.reply("Dejte /help pro nápovědu");
}

export async function helpHandler(ctx: TextContext): Promise<void> {
	const helpText =
		"Příkazy:\n" +
		"/start — začít komunikovat s botem\n" +
		"/help — zobrazí tuto nápovědu\n" +
		"/info — zobrazí informace o botovi\n" +
		"/name — zobrazí moje jméno\n" +
		"/currency — zobrazuje aktuální kurz eura\n" +
		"/currencyHistory — zobrazuje historii kurzu eura\n" +
		"/time — zobrazí aktuální čas\n";
	await ctx.reply(helpText);
}

export async function infoHandler(ctx: TextContext): Promise<void> {
	const infoText =
		"*O botě:* Tento bot je součástí semestrálního projektu v rámci předmětu STIN \\(softwarové inženýrství\\) Technické univerzity v Liberci\\.\n\n" +
		"*Datum vytvoření:* 01\\.04\\.2022\n\n" +
		"*Autor:* Nikita Tashchilin\n\n";
	await ctx.reply(infoText, { parse_mode: "MarkdownV2" });
}

export async function nameHandler(ctx: TextContext): Promise<void> {
	await ctx.reply("Moje jméno je: *Nikita Tashchilin*\\!\n\\.\n\\.\n\\.\n\\.\nDělám si srandu, to je můj táta, jmenuju se *Bot*\\!", {
		parse_mode: "MarkdownV2",
	});
}

export async function currencyHandler(ctx: TextContext): Promise<void> {
	const currency = await getExchangeRates();
	const date = await getDateString();
	await ctx.reply(`*${date.replaceAll(".", "\\.")}*\nAktuální kurz eura podle ČNB je: *${currency.replaceAll(".", "\\.")}*`, {
		parse_mode: "MarkdownV2",
	});
	await saveExchangeRate(currency);
}

export async function timeHandler(ctx: TextContext): Promise<void> {
	const date = await getDateString();
	await ctx.reply(`Aktuální čas serveru je: *${date.replaceAll(".", "\\.")}*`, {
		parse_mode: "MarkdownV2",
	});
}

export async function currencyHistoryHandler(ctx: TextContext): Promise<void> {
	const history = await getExchangeRateHistory();
	await ctx.reply(history.map(value => `${value.date.toLocaleDateString("ru")} — ${value.exchange_rate}`).join("\n"));
}
