import axios from 'axios';
import { IOrder } from '../types/orderTypes';
import { RMS_SERVER } from '../constants/emailConstants';

export const sendOrderEmail = (email: string, order: IOrder) => {
	axios.post(`${RMS_SERVER}/api/v1/customeremail`, {
		order: order,
		email: email,
	});

	return axios.post(`${RMS_SERVER}/api/v1/orderemail`, {
		order: order,
		email: email,
	});
};
