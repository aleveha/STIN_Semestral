export interface ILoggerService {
	/**
	 * Logs a message with the error level.
	 * @param message The message to log.
	 */
	error(message: string): void;

	/**
	 * Logs a message with the info level.
	 * @param message The message to log.
	 */
	info(message: string): void;

	/**
	 * Logs a message with the warning level.
	 * @param message The message to log.
	 */
	warn(message: string): void;
}