import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getCountFromServer,
	getDoc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
	startAt,
	endAt,
} from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { UploadResult, deleteObject, ref, uploadBytes } from 'firebase/storage';
import geofire from 'geofire-common';

// Add Only 1 kind
export const addOnlyOneDoc = async (collectionName: string, document: any) => {
	// Create a query against the collection.
	const q = query(
		collection(firestore, collectionName),
		where('phone', '==', document.phone)
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		return null;
	} else {
		return addDoc(collection(firestore, collectionName), document);
	}
};

//Add Document

export const addDocument = async (collectionName: string, document: any) => {
	// Create a query against the collection.

	return addDoc(collection(firestore, collectionName), document);
};

// Upload File
export const uploadFile = (path: string, file: File): Promise<UploadResult> => {
	// Add your custom logic here, for example add a Token to the Headers
	// Create a storage reference from our storage service

	const storageRef = ref(storage, path);

	// 'file' comes from the Blob or File API
	return uploadBytes(storageRef, file);
};

// Read All Documents

export const getDataFromAll = async (collectionName: any) => {
	const q = query(
		collection(firestore, collectionName),
		orderBy('date', 'desc')
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		return { data: querySnapshot, count: snapshot.data().count };
	} else {
		return null;
	}
};

// Read Many Documents

export const getDataFromDBOne = async (
	collectionName: any,
	fieldOne: any,
	checkOne: any
) => {
	const q = query(
		collection(firestore, collectionName),
		where(fieldOne, '==', checkOne),
		orderBy('date', 'desc')
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		return { data: querySnapshot, count: snapshot.data().count };
	} else {
		return null;
	}
};

export const getDataFromDBTwo = async (
	collectionName: any,
	fieldOne: any,
	checkOne: any,
	fieldTwo: string,
	checkTwo: any
) => {
	const q = query(
		collection(firestore, collectionName),
		where(fieldOne, '==', checkOne),
		where(fieldTwo, '==', checkTwo),
		orderBy('date', 'desc')
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		return { data: querySnapshot, count: snapshot.data().count };
	} else {
		return null;
	}
};

export const getDataFromDBThree = async (
	collectionName: any,
	fieldOne: any,
	checkOne: any,
	fieldTwo: any,
	checkTwo: any,
	fieldThree: any,
	checkThree: any
) => {
	const q = query(
		collection(firestore, collectionName),
		where(fieldOne, '==', checkOne),
		where(fieldTwo, '==', checkTwo),
		where(fieldThree, '==', checkThree),
		orderBy('date', 'desc')
	);
	const snapshot = await getCountFromServer(q);
	if (snapshot.data().count > 0) {
		const querySnapshot = await getDocs(q);
		return { data: querySnapshot, count: snapshot.data().count };
	} else {
		return null;
	}
};

// Read One Document
export const getOneDocument = async (collectionName: any, id: any) => {
	// Create a query against the collection.
	const docRef = doc(firestore, collectionName, id);
	const snapshot = await getDoc(docRef);

	if (snapshot.exists()) {
		return {
			count: 1,
			data: snapshot,
		};
	} else {
		return null;
	}
};

export const getNearest = async (
	collectionName: any,
	radiusInM: number,
	center: any
) => {
	const bounds = geofire.geohashQueryBounds(center, radiusInM);
	const promises = [];
	for (const b of bounds) {
		const q = query(
			collection(firestore, collectionName),
			orderBy('geohash'),
			startAt(b[0]),
			endAt(b[1])
		);

		promises.push(getDocs(q));
	}

	// Collect all the query results together into a single list
	const snapshots = await Promise.all(promises);

	const matchingDocs = [];
	for (const snap of snapshots) {
		for (const doc of snap.docs) {
			const lat = doc.get('lat');
			const lng = doc.get('lng');

			// We have to filter out a few false positives due to GeoHash
			// accuracy, but most will match
			const distanceInKm = geofire.distanceBetween([lat, lng], center);
			const distanceInM = distanceInKm * 1000;
			if (distanceInM <= radiusInM) {
				matchingDocs.push(doc);
			}
		}
	}

	return matchingDocs;
};

// Update
export const updateDocument = async (
	collection: string,
	id: string,
	data: any
) => {
	return await updateDoc(doc(firestore, collection, id), data);
};

// Delete File
export const deleteFile = async (url: string) => {
	await deleteObject(ref(storage, url));
};

// Delete Document
export const deleteDocument = async (collection: string, id: string) => {
	await deleteDoc(doc(firestore, collection, id));
};
