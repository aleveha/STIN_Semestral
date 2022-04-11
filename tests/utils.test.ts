import { getExchangeRates, getDateString, parceExchangeRatesData, fetchExchangeRateApi } from "../src/utils";
import { ExchangeRate } from "../src/exchange-rate-api";

test("Get date string", async () => {
	const data = await getDateString();
	expect(data).toBe(new Date().toLocaleString("ru"));
});

describe("Get exchange rates", () => {
	test("Fetch exchange rate API", async () => {
		const data = await fetchExchangeRateApi();
		expect(data).toHaveProperty("rates");
	});

	describe("Parce exchange rates data", () => {
		test("API success true", async () => {
			const inputData: ExchangeRate = {
				success: true,
				timestamp: 1648920783,
				base: "EUR",
				date: "2022-04-02",
				rates: {
					CLF: 0.031515,
					CVE: 110.277505,
					CZK: 24.369617,
					DJF: 197.052344,
				},
			};
			const data = await parceExchangeRatesData(inputData);
			expect(data).toBe("24.37");
		});

		test("API success false", async () => {
			const inputData: ExchangeRate = {
				success: false,
				error: {
					code: 105,
					type: "invalid_api_key",
					info: "Invalid API key",
				},
			};
			const data = await parceExchangeRatesData(inputData);
			expect(data).toBe<typeof data>("Exchange rate API error");
		});
	});

	test("Test getExchangeRates function", async () => {
		const data = await getExchangeRates();
		expect(data).toMatch(/[1-9][0-9]\.[0-9]*/);
	});
});
