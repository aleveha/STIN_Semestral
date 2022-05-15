import { IExchangeRateController } from "./types";
import { INJECTABLE, TextContext } from "../../types";
import { inject, injectable } from "inversify";
import { IExchangeRateService } from "../service/types";

@injectable()
export class ExchangeRateController implements IExchangeRateController {
	constructor(@inject(INJECTABLE.exchangeRateService) private readonly exchangeRateService: IExchangeRateService) {
	}

	public async get(ctx: TextContext): Promise<void> {
		const currency = await this.exchangeRateService.get();

		if (!currency) {
			await ctx.reply("Nepodařilo se získat data o kurzu ☹️");
			return;
		}

		await ctx.reply(`*${new Date().toLocaleString("ru")}*\nAktuální kurz eura je: *${currency.toString()}*`, { parse_mode: "Markdown" });
	}

	public async history(ctx: TextContext): Promise<void> {
		const history = await this.exchangeRateService.history();
		await ctx.reply(history.map(value => `${value.date.toLocaleDateString("ru")} — ${value.exchange_rate.toFixed(2)}`).join("\n"));
	}

	public async suggest(ctx: TextContext): Promise<void> {
		const suggestion = await this.exchangeRateService.suggest();
		if (!suggestion) {
			await ctx.reply("Příliš málo dat o kurzu, zkuste to znovu za pár dní");
			return;
		}
		const suggestionText = `*${new Date().toLocaleString("ru")}*\n` +
			`Kurz eura je *${suggestion.current.toString()}*\n` +
			`Dneska *${!suggestion.result ? "ne" : ""}doporučuju* nakupovat euro!\n\n` +
			`Průměr za poslední 3 dny: *${suggestion.avg.toString()}*\n` +
			`Rozdíl s průměrem: *${suggestion.diffAvg.toString()} (${suggestion.avgPercentage > 0 ? "+" : ""}${suggestion.avgPercentage}%)*\n\n` +
			`Rozdíl ceny za poslední 3 dny: *(${suggestion.diffAllPercentage}%)*:\n` +
			suggestion.diff.map(elem => `(${elem.dateTo.toLocaleDateString("ru")} –> ${elem.dateFrom.toLocaleDateString("ru")}): *${elem.value.toString()}*\n`).join("");
		await ctx.reply(suggestionText, { parse_mode: "Markdown" });
	}
}