import { addDoc, collection, doc, getCountFromServer, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { IForm } from "../types/formTypes";





export const getForms = async (id: string) => {

    // Create a query against the collection.
    const q = query(collection(firestore, "forms"), where("adminId", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return {
            count: snapshot.data().count,
            data:
                querySnapshot
        };
    } else {
        return null;
    }


}

export const getOneForm = async (id: string) => {
    // Create a query against the collection.
    const docRef = doc(firestore, "forms", id);
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


export const addForm = async (form: IForm) => {


    // Create a query against the collection.
    const ADMINS_FORM_REF = collection(firestore, `forms`);


    return await addDoc(ADMINS_FORM_REF, form);



}

export const updateForm = async (id: string, form: IForm) => {




    return await updateDoc(doc(firestore, "forms", id), form);



}


export const getAllData = async (id: string) => {
    // Create a query against the collection.
    const q = query(collection(firestore, "data"), where("editorId", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return {
            count: snapshot.data().count,
            data:
                querySnapshot
        };
    } else {
        return null;
    }
}


export const getSpecificData = async (id: string) => {

    // Create a query against the collection.

    const docRef = doc(firestore, "data", id);
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