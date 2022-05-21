import { Container } from "inversify";
import { CONFIG_KEYS, IConfigService } from "./types";
import { ConfigService } from "./index";
import { INJECTABLE } from "../types";
import { ILoggerService } from "../logger/types";

const LoggerMock: ILoggerService = {
	error: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
};

const container = new Container();
let config: IConfigService;

describe("Config service", () => {
	const envs = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...envs };
	});

	beforeAll(() => {
		container.bind<IConfigService>(INJECTABLE.config).to(ConfigService);
		container.bind<ILoggerService>(INJECTABLE.logger).toConstantValue(LoggerMock);
		config = container.get<IConfigService>(INJECTABLE.config);
	});

	it("should read config file", () => {
		const token = config.get<string>(CONFIG_KEYS.telegramToken);
		expect(token).toMatch(/\d{10,}:[a-zA-Z\d-]+/g);
	});

	it("should use process.env", () => {
		container.unbind(INJECTABLE.config);
		process.env = {
			...envs,
			NODE_ENV: "production",
			TELEGRAM_TOKEN: "1234567890:qwerty-ytrewq-qwerty",
		};
		container.bind<IConfigService>(INJECTABLE.config).to(ConfigService);
		config = container.get<IConfigService>(INJECTABLE.config);

		const token = config.get<string>(CONFIG_KEYS.telegramToken);
		expect(token).toMatch(/\d{10,}:[a-zA-Z\d-]+/g);
	});
});