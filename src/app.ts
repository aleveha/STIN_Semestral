import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";
import { CONFIG_KEYS, IConfigService } from "./config/types";
import { inject, injectable } from "inversify";
import { INJECTABLE } from "./types";
import { ILoggerService } from "./logger/types";
import { IExchangeRateService } from "./exchangeRate/service/types";
import { IExchangeRateController } from "./exchangeRate/controller/types";
import { ISharedController } from "./shared/controller/types";
import "reflect-metadata";

@injectable()
export class App {
	private readonly bot: Telegraf<Context<Update>>;
	private readonly stage: string;

	constructor(
		@inject(INJECTABLE.config) private readonly config: IConfigService,
		@inject(INJECTABLE.logger) private readonly logger: ILoggerService,
		@inject(INJECTABLE.exchangeRateController) private readonly exchangeRateController: IExchangeRateController,
		@inject(INJECTABLE.exchangeRateService) private readonly exchangeRateService: IExchangeRateService,
		@inject(INJECTABLE.sharedController) private readonly sharedController: ISharedController,
	) {
		this.bot = new Telegraf(config.get<string>(CONFIG_KEYS.telegramToken));
		this.stage = this.config.get<string>(CONFIG_KEYS.stage);
	}

	private async registerHandlers(): Promise<void> {
		this.bot.start(async ctx => await this.sharedController.start(ctx));
		this.bot.help(async ctx => await this.sharedController.help(ctx));
		this.bot.command("info", async ctx => await this.sharedController.info(ctx));
		this.bot.command("name", async ctx => await this.sharedController.name(ctx));
		this.bot.command("currency", async ctx => await this.exchangeRateController.get(ctx));
		this.bot.command("currencyHistory", async ctx => await this.exchangeRateController.history(ctx));
		this.bot.command("suggestion", async ctx => await this.exchangeRateController.suggest(ctx));
		this.bot.command("time", async ctx => await this.sharedController.time(ctx));
		this.bot.on("message", async ctx => await this.sharedController.badRequest(ctx));
	}

	private async startWebhook(): Promise<void> {
		await this.bot.launch({
			webhook: {
				domain: "https://stin-bot.herokuapp.com",
				hookPath: `/${this.config.get<string>(CONFIG_KEYS.telegramToken)}`,
				host: "0.0.0.0",
				port: 8443,
			},
		});
	}

	public async init(): Promise<void> {
		await this.registerHandlers();
		await this.exchangeRateService.startScheduler();
	}

	public async start(): Promise<void> {
		this.stage === "production" ? await this.startWebhook() : await this.bot.launch();
		this.logger.info(`[App] Bot has been started on stage: ${this.stage}`);
	}
}