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
		print(currency);
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

	// Send every order to me
};

export const subscriptionPrice = async (amount: number) => {
	let code = getCookie(CURRENNCY);
	if (code !== '') {
		if (code == 'BWP') {
			return amount * 13.59;
		} else if (code === 'ZAR') {
			return amount * 18.85;
		} else {
			return amount;
		}
	} else {
		let currency: any = await locationResult();
		print(currency);
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
		code = currency.data.currency.symbol_native;
		if (code == 'BWP') {
			return amount * 13.59;
		} else if (code === 'ZAR') {
			return amount * 18.85;
		} else {
			return amount;
		}
	}
};
