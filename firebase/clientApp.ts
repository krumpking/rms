import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import * as geofirestore from 'geofirestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAqAf10gxM7jyHDFwHj8IDnT66d4qOgWuk',
	authDomain: 'foodiesbooth.firebaseapp.com',
	projectId: 'foodiesbooth',
	storageBucket: 'foodiesbooth.appspot.com',
	messagingSenderId: '57057289406',
	appId: '1:57057289406:web:02d00375d7787c35222aef',
	measurementId: 'G-L7F9P6VRYY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: any;
// Initialize Analytics and get a reference to the service
if (typeof window !== 'undefined') {
	analytics = getAnalytics(app);
}

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { storage, firestore, auth, analytics };
