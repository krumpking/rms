import { firestore } from '../../firebase/clientApp';
import {
	ADMIN_COLLECTION,
	CUSTOMERS_COLLECTION,
} from '../constants/userConstants';
import { ICustomer } from '../types/customerTypes';
import { IUser } from '../types/userTypes';
import {
	addDoc,
	collection,
	getCountFromServer,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { updateDocument } from './mainApi';

export const addUser = async (user: IUser) => {
	// Create a query against the collection.
	const q = query(
		collection(firestore, ADMIN_COLLECTION),
		where('contact', '==', user.contact)
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			updateDocument(ADMIN_COLLECTION, doc.id, user);
		});
	} else {
		return addDoc(collection(firestore, ADMIN_COLLECTION), user);
	}
};

export const addCustomer = async (user: ICustomer) => {
	// Create a query against the collection.
	const q = query(
		collection(firestore, CUSTOMERS_COLLECTION),
		where('customerPhone', '==', user.customerPhone)
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			updateDocument(CUSTOMERS_COLLECTION, doc.id, user);
		});
	} else {
		return addDoc(collection(firestore, CUSTOMERS_COLLECTION), user);
	}
};
