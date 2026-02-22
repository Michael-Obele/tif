import getSymbolFromCurrency from 'currency-symbol-map';
import { code as getCurrencyData } from 'currency-codes-ts';

// Curated list of common currency codes including NGN
export const CURRENCY_CODES = [
	'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL',
	'MXN', 'SEK', 'SGD', 'NZD', 'NGN', 'AED', 'ZAR', 'HKD', 'ILS', 'NOK',
	'DKK', 'PLN', 'TRY', 'RUB', 'IDR', 'THB', 'SAR', 'MYR', 'KRW', 'TWD'
] as const;

export type CurrencyCode = typeof CURRENCY_CODES[number];

export interface Currency {
	code: string;
	name: string;
	symbol: string;
}

export const CURRENCIES: Currency[] = CURRENCY_CODES.map((code) => {
	const data = getCurrencyData(code);
	return {
		code,
		name: data?.currency || code,
		symbol: getSymbolFromCurrency(code) || code
	};
});

