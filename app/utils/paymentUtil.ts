import { getCookie } from 'react-use-cookie';
import DateMethods from './date';
import { decrypt } from './crypto';
import { print } from './console';
import { getPayments } from '../api/paymentApi';
import { Timestamp } from 'firebase/firestore';
import { useAuthIds } from '../components/authHook';

export const checkPaymentStatus = async () => {
	var result: any = null;
	const v = await getPayments();
	if (v !== null) {
		v.data.forEach((element) => {
			const diff = DateMethods.diffDatesDays(
				element.data().paymentDateString,
				new Date().toString()
			);
			if (diff < element.data().duration) {
				result = { status: true, data: element.data() };
				return;
			}
		});
	}
	return result;
};
