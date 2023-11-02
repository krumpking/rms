import axios from 'axios';
import { IOrder } from '../types/orderTypes';
import { RMS_SERVER } from '../constants/emailConstants';

export const sendOrderEmail = (email: string, order: IOrder) => {
	// Send every order to me
	axios.post(`${RMS_SERVER}/api/v1/orderemail`, {
		order: order,
		email: 'unashe@visionisprimary.com',
	});

	axios.post(`${RMS_SERVER}/api/v1/customeremail`, {
		order: order,
		email: email,
	});

	return axios.post(`${RMS_SERVER}/api/v1/orderemail`, {
		order: order,
		email: email,
	});
};

export const sendEmail = (email: string, message: string) => {
	// Send every order to me
	axios.post(`${RMS_SERVER}/api/v1/email`, {
		message: `Here is an update on a dine order made ${message} `,
		email: 'unashe@visionisprimary.com',
	});

	axios.post(`${RMS_SERVER}/api/v1/email`, {
		message: message,
		email: email,
	});

	return axios.post(`${RMS_SERVER}/api/v1/email`, {
		message: message,
		email: email,
	});
};
