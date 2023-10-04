import axios from 'axios';
import { TWILLIO_URL } from '../constants/twillioConstants';
import { print } from '../utils/console';
import twilio from 'twilio';

export const sendSMS = (phone: string, message: string) => {
	return axios.post(`${TWILLIO_URL}/api/v1/sms`, {
		message: message,
		phone: phone,
	});
};
