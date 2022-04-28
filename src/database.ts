import { DB_CLIENT } from "./config";

interface ExchangeRate {
	id: number;
	exchange_rate: string;
	date: Date;
}

export async function saveExchangeRate(exchangeRate: string, date?: Date): Promise<void> {
	await DB_CLIENT.query<ExchangeRate>(
		"insert into exchange_rate(exchange_rate, date) values ($1, $2) on conflict (date) do nothing",
		[exchangeRate, date ?? new Date()]
	);
}

export async function getExchangeRateHistory(): Promise<ExchangeRate[]> {
	return (await DB_CLIENT.query<ExchangeRate>("select * from exchange_rate order by date")).rows;
}