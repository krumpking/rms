import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, USER_ID } from '../constants/constants';
import { USER_TYPE } from '../constants/userConstants';
import { decrypt } from './crypto';
import { print } from './console';

export const getUser = () => {
	let id = decrypt(getCookie(USER_ID), ADMIN_ID);
	let userType = getCookie(USER_TYPE);
	if (id !== '' && userType !== '') {
		return {
			id: id,
			userType: userType,
		};
	} else {
		return null;
	}
};
