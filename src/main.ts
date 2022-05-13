import { Container, ContainerModule } from "inversify";
import { App } from "./app";
import { INJECTABLE } from "./types";
import { IConfigService } from "./config/types";
import { ConfigService } from "./config";
import { IDatabaseService } from "./database/types";
import { DatabaseService } from "./database";
import { ILoggerService } from "./logger/types";
import { Logger } from "./logger";
import { ISharedController } from "./shared/controller/types";
import { SharedController } from "./shared/controller";
import { ExchangeRateController } from "./exchangeRate/controller";
import { IExchangeRateController } from "./exchangeRate/controller/types";
import { IExchangeRateService } from "./exchangeRate/service/types";
import { ExchangeRateService } from "./exchangeRate/service";
import { IExchangeRatePersistence } from "./exchangeRate/persistence/types";
import { ExchangeRatePersistence } from "./exchangeRate/persistence";

const sharedBindings = new ContainerModule(bind => {
	bind<App>(INJECTABLE.app).to(App).inSingletonScope();
	bind<IConfigService>(INJECTABLE.config).to(ConfigService).inSingletonScope();
	bind<IDatabaseService>(INJECTABLE.databaseService).to(DatabaseService).inSingletonScope();
	bind<ILoggerService>(INJECTABLE.logger).to(Logger).inSingletonScope();
	bind<ISharedController>(INJECTABLE.sharedController).to(SharedController);
});

const exchangeRateBindings = new ContainerModule(bind => {
	bind<IExchangeRateController>(INJECTABLE.exchangeRateController).to(ExchangeRateController);
	bind<IExchangeRateService>(INJECTABLE.exchangeRateService).to(ExchangeRateService);
	bind<IExchangeRatePersistence>(INJECTABLE.exchangeRatePersistence).to(ExchangeRatePersistence);
});

async function main(): Promise<void> {
	const appContainer = new Container();
	appContainer.load(
		exchangeRateBindings,
		sharedBindings,
	);
	const app = appContainer.get<App>(INJECTABLE.app);
	await app.init();
	await app.start();
}

main();