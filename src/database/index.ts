import { Pool } from "pg";
import { inject, injectable } from "inversify";
import { INJECTABLE } from "../types";
import { CONFIG_KEYS, IConfigService } from "../config/types";
import { IDatabaseService } from "./types";
import { ILoggerService } from "../logger/types";

@injectable()
export class DatabaseService implements IDatabaseService {
	public readonly pool: Pool;

	constructor(@inject(INJECTABLE.config) private readonly config: IConfigService, @inject(INJECTABLE.logger) private readonly logger: ILoggerService) {
		this.pool = new Pool({
			host: this.config.get<string>(CONFIG_KEYS.database_host),
			port: 5432,
			user: this.config.get<string>(CONFIG_KEYS.database_user),
			password: this.config.get<string>(CONFIG_KEYS.database_password),
			database: this.config.get<string>(CONFIG_KEYS.database_name),
			ssl: {
				rejectUnauthorized: false,
			},
		});

		this.pool.connect()
			.then(() => this.logger.info("[DatabaseService] Connected to database"))
			.catch((err) => this.logger.error("[DatabaseService] Could not connect to database\n" + err));
	}
}