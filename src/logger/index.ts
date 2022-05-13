import { injectable } from "inversify";
import { ILoggerService } from "./types";
import { Logger as TSLogger } from "tslog";

@injectable()
export class Logger implements ILoggerService {
	private readonly logger: TSLogger;

	constructor() {
		this.logger = new TSLogger();
	}

	/**
	 * Logs a message with the info level.
	 * @param message The message to log.
	 */
	public info(message: string) {
		this.logger.info(message);
	}

	/**
	 * Logs a message with the warning level.
	 * @param message The message to log.
	 */
	public warn(message: string) {
		this.logger.warn(message);
	}

	/**
	 * Logs a message with the error level.
	 * @param message The message to log.
	 */
	public error(message: string) {
		this.logger.error(message);
	}
}