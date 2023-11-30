import axios from 'axios';
import { IP_REGISTRATION } from '../constants/locationConstants';

export const locationResult = () => {
	// Send every order to me

	return axios.get(`${IP_REGISTRATION}`);
};
