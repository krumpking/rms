import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD } from '../constants/constants';
import { decrypt } from '../utils/crypto';
import { getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { CRM_DB_REF } from '../constants/crmConstants';
import { print } from '../utils/console';
import { useAuthIds } from '../components/authHook';

export const getCount = async (stage: string) => {
	// Create a query against the collection.
	const { adminId, userId, access } = useAuthIds();

	const q = query(CRM_DB_REF, where(AMDIN_FIELD, '==', adminId));
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		var results: any = [];
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((element) => {
			if (decrypt(element.data().stage, adminId) === stage) {
				results.push(element.data());
			}
		});

		return {
			data: results,
			count: results.length,
		};
	} else {
		return null;
	}
};
