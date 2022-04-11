import { EXCHANGE_RATE_API, ExchangeRate } from "./exchange-rate-api";
import { EXCHANGE_TOKEN } from "./config";

export async function getDateString(): Promise<string> {
	return new Date().toLocaleString("ru");
}

export async function fetchExchangeRateApi(): Promise<ExchangeRate> {
	return (await EXCHANGE_RATE_API.get<ExchangeRate>("/latest", { params: { base: "EUR", access_key: EXCHANGE_TOKEN } })).data;
}

export async function getExchangeRates(): Promise<string> {
	const currencyData = await fetchExchangeRateApi();
	return await parceExchangeRatesData(currencyData);
}

export async function parceExchangeRatesData(data: ExchangeRate): Promise<string> {
	return data.rates ? data.rates.CZK.toString() : "Exchange rate API error";
}
