import { Pool } from "pg";

/**
 * @description Database service interface
 */
export interface IDatabaseService {
	/**
	 * @description Database connection pool
	 */
	pool: Pool;
}