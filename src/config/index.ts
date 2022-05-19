import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { IConfigService } from "./types";
import { INJECTABLE } from "../types";
import { ILoggerService } from "../logger/types";
import "reflect-metadata";

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(INJECTABLE.logger) private readonly logger: ILoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error("[ConfigService] Error loading .env file");
			throw result.error;
		} else {
			this.logger.info("[ConfigService] Successfully loaded .env file");
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	public get<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}
}
