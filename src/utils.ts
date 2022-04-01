import axios from "axios";

export async function getDateString(): Promise<string> {
	return new Date().toLocaleString("ru");
}

export async function getCurrency(): Promise<string> {
	const url = "https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt";
	const currencyData = await axios.get(url);
	return await parceCurrencyData(currencyData.data);
}

async function parceCurrencyData(data: string): Promise<string> {
	return data
		.split("\n")
		.filter(line => line.includes("EUR"))[0]
		.split("|")[4];
}
