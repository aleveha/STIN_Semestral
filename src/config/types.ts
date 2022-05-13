/**
 * @description Config service interface
 */
export interface IConfigService {
	get: <T extends string | number>(key: string) => T;
}

export type STAGE_TYPE = "production" | "local";

/**
 * @description Config keys
 */
export const CONFIG_KEYS = {
	stage: "NODE_ENV",
	telegramToken: "TELEGRAM_TOKEN",
	exchangeToken: "EXCHANGE_TOKEN",
	database_host: "DB_HOST",
	database_name: "DB_NAME",
	database_user: "DB_USER",
	database_password: "DB_PASSWORD",
} as const;