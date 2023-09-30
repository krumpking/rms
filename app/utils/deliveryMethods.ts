import { getDataFromAll } from '../api/mainApi';
import { sendSMS } from '../api/twillioApi';
import { FOODIES_BOOTH_URL } from '../constants/constants';
import { DELIVERERS_COLLECTION } from '../constants/deliveryConstants';

export const sendSMSToDrivers = () => {
	getDataFromAll(DELIVERERS_COLLECTION)
		.then((v) => {
			if (v !== null) {
				v.data.forEach((element) => {
					let d = element.data();
					sendSMS(
						d.contact,
						`There is order that is ready for delivery, check it out now ${FOODIES_BOOTH_URL}/delivery`
					);
				});
			}
		})
		.catch(console.error);
};
