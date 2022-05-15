import { Container } from "inversify";
import { IConfigService } from "../config/types";
import { ILoggerService } from "../logger/types";
import { IExchangeRatePersistence } from "./persistence/types";
import { IExchangeRateService } from "./service/types";
import { INJECTABLE } from "../types";
import { ExchangeRateService } from "./service";
import cron from "node-cron";


const ConfigMock: IConfigService = {
	get: jest.fn(),
};

const LoggerMock: ILoggerService = {
	error: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
};

const ExchangeRatePersistenceMock: IExchangeRatePersistence = {
	getHistory: jest.fn(),
	save: jest.fn(),
};

const container = new Container();
let exchangeRateService: IExchangeRateService;
let config: IConfigService;
let logger: ILoggerService;
let exchangeRatePersistence: IExchangeRatePersistence;

describe("Exchange rate service", () => {
	beforeAll(() => {
		container.bind<IExchangeRateService>(INJECTABLE.exchangeRateService).to(ExchangeRateService);
		container.bind<IConfigService>(INJECTABLE.config).toConstantValue(ConfigMock);
		container.bind<ILoggerService>(INJECTABLE.logger).toConstantValue(LoggerMock);
		container.bind<IExchangeRatePersistence>(INJECTABLE.exchangeRatePersistence).toConstantValue(ExchangeRatePersistenceMock);

		exchangeRateService = container.get<IExchangeRateService>(INJECTABLE.exchangeRateService);
		config = container.get<IConfigService>(INJECTABLE.config);
		logger = container.get<ILoggerService>(INJECTABLE.logger);
		exchangeRatePersistence = container.get<IExchangeRatePersistence>(INJECTABLE.exchangeRatePersistence);
	});

	describe("Get exchange rate", () => {
		it("Should be failure (bad token)", async () => {
			config.get = jest.fn().mockReturnValue("123");
			const exchangeRate = await exchangeRateService.get();
			expect(exchangeRate).toBeNull();
		});

		it("Should be successful", async () => {
			config.get = jest.fn().mockReturnValue("7434040b47b07cf1018f63ee910b5b0a");
			const exchangeRate = await exchangeRateService.get();
			expect(exchangeRate).toBeDefined();
			expect(exchangeRate?.toString()).toMatch(/\d\d.\d\d/g);
		});
	});

	describe("Get exchange rate history", () => {
		it("Should be successful (empty array)", async () => {
			exchangeRatePersistence.getHistory = jest.fn().mockReturnValue([]);
			const exchangeRateHistory = await exchangeRateService.history();
			expect(exchangeRateHistory).toBeDefined();
			expect(exchangeRateHistory).toHaveLength(0);
		});

		it("Should be successful (not empty array)", async () => {
			const mockHistory = [
				{ id: 1, exchange_rate: 24.56, date: "2022-04-28" },
				{ id: 2, exchange_rate: 24.76, date: "2022-04-29" },
			];
			exchangeRatePersistence.getHistory = jest.fn().mockReturnValue(mockHistory);
			const exchangeRateHistory = await exchangeRateService.history();
			expect(exchangeRateHistory).toBeDefined();
			expect(exchangeRateHistory).toHaveLength(2);
			expect(exchangeRateHistory).toMatchObject(mockHistory);
		});
	});

	describe("Exchange rate scheduler", () => {
		it("Should be successful (run scheduler)", async () => {
			const loggerSpy = jest.spyOn(logger, "info");
			await exchangeRateService.startScheduler();
			expect(loggerSpy).toHaveBeenCalledWith("[ExchangeRateService] Exchange rate scheduler has been started");
			cron.getTasks().forEach((task) => task.stop());
		});

		it("Should be successful (inside function)", async () => {
			config.get = jest.fn().mockReturnValue("7434040b47b07cf1018f63ee910b5b0a");
			exchangeRatePersistence.save = jest.fn();
			const result = await exchangeRateService.getDailyExchangeRate();
			expect(result).toEqual(true);
		});

		it("Should be failure (inside function)", async () => {
			config.get = jest.fn().mockReturnValue("123");
			exchangeRatePersistence.save = jest.fn();
			const result = await exchangeRateService.getDailyExchangeRate();
			expect(result).toEqual(false);
		});
	});
});