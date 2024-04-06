import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, ACCESS, USER_ID } from '../constants/constants';
import { decrypt } from '../utils/crypto';
import { PHONE_COOKIE, USER_TYPE } from '../constants/userConstants';

export const useAuthIds = () => {
	let adminId = decrypt(getCookie(ADMIN_ID), ADMIN_ID);
	let userId = decrypt(getCookie(USER_ID), ADMIN_ID);
	let phone = decrypt(PHONE_COOKIE, ADMIN_ID);
	let accessString = getCookie(ACCESS);
	let userType = getCookie(USER_TYPE);
	let accessFromCookies: string[] = accessString.split(',');
	let access: string[] = [];
	accessFromCookies.forEach((element: any) => {
		access.push(decrypt(element, ADMIN_ID));
	});
	return { adminId, userId, access, userType, phone };
};
