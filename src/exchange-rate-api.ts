import axios from "axios";

interface Rates {
	[key: string]: number;
}

interface Error {
	code: number;
	type: string;
	info: string;
}

export interface ExchangeRate {
	success: boolean;
	timestamp?: number;
	base?: string;
	date?: string;
	rates?: Rates;
	error?: Error;
}

export const EXCHANGE_RATE_API = axios.create({
	baseURL: "http://api.exchangeratesapi.io/",
});
