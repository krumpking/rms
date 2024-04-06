import { getCookie, setCookie } from 'react-use-cookie';
import { CURRENNCY, CURRENT_COUNTRY } from '../constants/locationConstants';
import { locationResult } from '../utils/location';

export const getCurrency = async () => {
	let code: any = getCookie(CURRENNCY);
	if (code !== '') {
		return code;
	} else {
		let currency = await locationResult();
		let code = currency.data.currency.symbol_native;
		if (code !== 'P' && code !== 'R') {
			code = 'US$';
		}
		setCookie(CURRENNCY, code, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		setCookie(CURRENT_COUNTRY, currency.data.location.country, {
			days: 90,
			SameSite: 'Strict',
			Secure: true,
		});
		return code;
	}
};

export const subscriptionPrice = async (amount: number) => {
	let code = getCookie(CURRENNCY);
	if (code !== '') {
		if (code === 'P') {
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
		if (code === 'P') {
			return Math.round(amount * 13.59);
		} else if (code === 'R') {
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
