import { ISharedController } from "./types";
import { MessageContext, TextContext } from "../../types";
import { injectable } from "inversify";

@injectable()
export class SharedController implements ISharedController {
	public async badRequest(ctx: MessageContext): Promise<void> {
		await ctx.reply("Moc nerozumím...");
	}

	public async help(ctx: TextContext): Promise<void> {
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

	public async info(ctx: TextContext): Promise<void> {
		const infoText =
			"*O botě:* Tento bot je součástí semestrálního projektu v rámci předmětu STIN \\(softwarové inženýrství\\) Technické univerzity v Liberci\\.\n\n" +
			"*Datum vytvoření:* 01\\.04\\.2022\n\n" +
			"*Autor:* Nikita Tashchilin\n\n";
		await ctx.reply(infoText, { parse_mode: "MarkdownV2" });
	}

	public async name(ctx: TextContext): Promise<void> {
		await ctx.reply("Moje jméno je: *Nikita Tashchilin*\\!\n\\.\n\\.\n\\.\n\\.\nDělám si srandu, to je můj táta, jmenuju se *Bot*\\!", {
			parse_mode: "MarkdownV2",
		});
	}

	public async start(ctx: TextContext): Promise<void> {
		await ctx.reply("Zdravím! Jsem bot, který něco umí 🙃");
		await ctx.reply("Dejte /help pro nápovědu");
	}

	public async time(ctx: TextContext): Promise<void> {
		const date = new Date().toLocaleString("cs");
		await ctx.reply(`Aktuální čas serveru je: *${date.replaceAll(".", "\\.")}*`, {
			parse_mode: "MarkdownV2",
		});
	}
}