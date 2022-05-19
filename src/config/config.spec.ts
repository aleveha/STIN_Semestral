import { Container } from "inversify";
import { CONFIG_KEYS, IConfigService } from "./types";
import { ConfigService } from "./index";
import { INJECTABLE } from "../types";
import { ILoggerService } from "../logger/types";

const ConfigMock: IConfigService = {
	get: jest.fn(),
};

const LoggerMock: ILoggerService = {
	error: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
};

const container = new Container();
let config: IConfigService;

describe("Config service", () => {
	beforeAll(() => {
		container.bind<ILoggerService>(INJECTABLE.logger).toConstantValue(LoggerMock);
	});

	afterEach(() => {
		container.unbind(INJECTABLE.config);
	});


	it("should return test", () => {
		container.bind<IConfigService>(INJECTABLE.config).toConstantValue(ConfigMock);
		config = container.get<IConfigService>(INJECTABLE.config);
		config.get = jest.fn().mockReturnValue("test");

		const token = config.get<string>("test");
		expect(token).toEqual("test");
	});

	it("should read config file", () => {
		container.bind<IConfigService>(INJECTABLE.config).to(ConfigService);
		config = container.get<IConfigService>(INJECTABLE.config);

		const token = config.get<string>(CONFIG_KEYS.telegramToken);
		expect(token).toMatch(/\d{10,}:[a-zA-Z\d-]+/g);
	});
});