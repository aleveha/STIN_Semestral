import { getExchangeRateHistory, saveExchangeRate } from "../src/database";
import { DB_CLIENT } from "../src/config";

describe("Exchange rate history", () => {
	test("Get exchange rate gistory", async () => {
		const result = await getExchangeRateHistory();
		expect(result.length).toBeGreaterThanOrEqual(0);

		if (result.length > 0) {
			const first = result[0];
			expect(new Date(first.date)).toBeInstanceOf(Date);
			expect(first.exchange_rate).toMatch(/[1-9][0-9]\.[0-9]*/);
		}
	});

	test("Save new exchange rate", async () => {
		const rate = "999";
		await saveExchangeRate(rate, new Date("01.01.1970"));
		const result = await getExchangeRateHistory();
		const find = result.find(r => r.exchange_rate === rate);
		expect(find?.exchange_rate).toBe(rate);
		await DB_CLIENT.query("DELETE FROM exchange_rate WHERE exchange_rate = $1", [rate]);
		const resultDelete = await getExchangeRateHistory();
		const findDelete = resultDelete.find(r => r.exchange_rate === rate);
		expect(findDelete).toBe(undefined);
	}, 10000);
});
