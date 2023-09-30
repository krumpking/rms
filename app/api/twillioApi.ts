import axios from 'axios';
import { TWILLIO_URL } from '../constants/twillioConstants';
import { print } from '../utils/console';

export const sendSMS = (phone: string, message: string) => {
	print(`phone:${phone} messge ${message}`);
	return axios.post(`${TWILLIO_URL}/api/v1/sms`, {
		message: message,
		phone: phone,
	});
};
