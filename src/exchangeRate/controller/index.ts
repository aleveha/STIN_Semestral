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

		await ctx.reply(`*${new Date().toLocaleString("cs").replaceAll(".", "\\.")}*\nAktuální kurz eura podle ČNB je: *${currency.replaceAll(".", "\\.")}*`, {
			parse_mode: "MarkdownV2",
		});
	}

	public async history(ctx: TextContext): Promise<void> {
		const history = await this.exchangeRateService.history();
		await ctx.reply(history.map(value => `${value.date.toLocaleDateString("ru")} — ${value.exchange_rate}`).join("\n"));
	}
}