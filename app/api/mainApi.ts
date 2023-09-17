import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { firestore, storage } from "../../firebase/clientApp";
import { UploadResult, deleteObject, ref, uploadBytes } from "firebase/storage";


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
  const q = query(collection(firestore, collectionName), orderBy("date", "desc"));
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count > 0) {
    const querySnapshot = await getDocs(q);
    return { data: querySnapshot, count: snapshot.data().count };

  } else {
    return null;
  }
}



// Read Many Documents

export const getDataFromDBOne = async (collectionName: any, fieldOne: any, checkOne: any) => {
  const q = query(collection(firestore, collectionName), where(fieldOne, "==", checkOne), orderBy("date", "desc"));
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count > 0) {
    const querySnapshot = await getDocs(q);
    return { data: querySnapshot, count: snapshot.data().count };

  } else {
    return null;
  }
}



export const getDataFromDBTwo = async (collectionName: any, fieldOne: any, checkOne: any, fieldTwo: string, checkTwo: any) => {
  const q = query(collection(firestore, collectionName), where(fieldOne, "==", checkOne), where(fieldTwo, "==", checkTwo), orderBy("date", "desc"));
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count > 0) {
    const querySnapshot = await getDocs(q);
    return { data: querySnapshot, count: snapshot.data().count };

  } else {
    return null;
  }
}

export const getDataFromDBThree = async (collectionName: any, fieldOne: any, checkOne: any, fieldTwo: any, checkTwo: any, fieldThree: any, checkThree: any) => {
  const q = query(collection(firestore, collectionName), where(fieldOne, "==", checkOne), where(fieldTwo, "==", checkTwo), where(fieldThree, "==", checkThree), orderBy("population", "desc"));
  const snapshot = await getCountFromServer(q);
  if (snapshot.data().count > 0) {
    const querySnapshot = await getDocs(q);
    return { data: querySnapshot, count: snapshot.data().count };

  } else {
    return null;
  }
}



// Read One Document
export const getOneDocument = async (collectionName: any, id: any) => {
  // Create a query against the collection.
  const docRef = doc(firestore, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return {
      count: 1,
      data:
        snapshot
    };
  } else {
    return null;
  }
}

// Update
export const updateDocument = async (collection: string, id: string, data: any) => {
  return await updateDoc(doc(firestore, collection, id), data);
}

// Delete File
export const deleteFile = async (url: string) => {
  await deleteObject(ref(storage, url));
}


// Delete Document
export const deleteDocument = async (collection: string, id: string) => {
  await deleteDoc(doc(firestore, collection, id));
}


