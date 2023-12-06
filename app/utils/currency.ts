import { getCookie, setCookie } from 'react-use-cookie';
import { locationResult } from './location';
import { CURRENNCY, CURRENT_COUNTRY } from '../constants/locationConstants';
import { print } from './console';

export const getCurrency = async () => {
	let currency: any = getCookie(CURRENNCY);
	if (currency !== '') {
		return currency;
	} else {
		currency = await locationResult();

		setCookie(CURRENNCY, currency.data.currency.symbol_native, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		setCookie(CURRENT_COUNTRY, currency.data.location.country, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		return currency.data.currency.symbol_native;
	}
};

export const subscriptionPrice = async (amount: number) => {
	let code = getCookie(CURRENNCY);
	if (code !== '') {
		if (code == 'P') {
			return Math.round(amount * 13.59);
		} else if (code === 'R') {
			return Math.round(amount * 18.85);
		} else {
			return amount;
		}
	} else {
		let currency: any = await locationResult();
		setCookie(CURRENNCY, currency.data.currency.symbol_native, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		setCookie(CURRENT_COUNTRY, currency.data.location.country.name, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		code = currency.data.currency.symbol_native;
		if (code == 'P') {
			return Math.round(amount * 13.59);
		} else if (code == 'R') {
			return Math.round(amount * 18.85);
		} else {
			return amount;
		}
	}
};

export const getCountry = async () => {
	let country: any = getCookie(CURRENT_COUNTRY);
	if (country !== '') {
		return country;
	} else {
		country = await locationResult();

		setCookie(CURRENNCY, country.data.currency.symbol_native, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		setCookie(CURRENT_COUNTRY, country.data.location.country.name, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		return country.data.location.country.name;
	}

	// Send every order to me
};
