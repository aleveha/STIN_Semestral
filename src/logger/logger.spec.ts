import { Container } from "inversify";
import { ILoggerService } from "./types";
import { INJECTABLE } from "../types";
import { Logger } from "./index";

const container = new Container();
let logger: ILoggerService;


describe("Logger service", () => {
	const text = "test logger";

	beforeAll(() => {
		container.bind<ILoggerService>(INJECTABLE.logger).to(Logger);
		logger = container.get<ILoggerService>(INJECTABLE.logger);
	});

	it("info", () => {
		const spy = jest.spyOn(logger, "info");
		logger.info(text);
		expect(spy).toHaveBeenCalledWith(text);
	});

	it("warn", () => {
		const spy = jest.spyOn(logger, "warn");
		logger.warn(text);
		expect(spy).toHaveBeenCalledWith(text);
	});

	it("error", () => {
		const spy = jest.spyOn(logger, "error");
		logger.error(text);
		expect(spy).toHaveBeenCalledWith(text);
	});
});