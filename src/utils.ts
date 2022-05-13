import { EXCHANGE_RATE_API, ExchangeRate } from "./exchange-rate-api";
import { EXCHANGE_TOKEN } from "./config";
import cron from "node-cron";
import { saveExchangeRate } from "./database";

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
	return data.rates ? data.rates.CZK.toFixed(2).toString() : "Exchange rate API error";
}

export async function startExchangeRateToHistoryScheduler(): Promise<void> {
	cron.schedule("0 0 * * *", async () => {
		const currency = await getExchangeRates();
		await saveExchangeRate(currency);
		console.log(`Exchange rate ${currency} saved at ${await getDateString()}`);
	});
}
