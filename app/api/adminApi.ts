import { addDoc, collection, deleteDoc, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { ADMINS_DB_REF } from "../constants/constants";
import { IAdmin } from "../types/types";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import Random from "../utils/random";
import { getCookie, setCookie } from "react-use-cookie";
import { decrypt, encrypt } from "../utils/crypto";
import { print } from "../utils/console";



export const addAdmin = async (admin: IAdmin) => {

    // Create a query against the collection.
    const q = query(ADMINS_DB_REF, where("phoneNumber", "==", admin.phoneNumber));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        return null;

    } else {
        const q = query(collection(firestore, "users"), where("phoneNumber", "==", admin.phoneNumber));
        const snapshot = await getCountFromServer(q);
        if (snapshot.data().count > 0) {
            return null;
        } else {
            return addDoc(ADMINS_DB_REF, admin);
        }

    }


}

export const getUser = async (phone: string) => {

    const q = query(collection(firestore, "admins"), where("phoneNumber", "==", phone));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            userType: 'admin'
        };
    } else {
        const q = query(collection(firestore, "users"), where("contact", "==", phone));
        const snapshot = await getCountFromServer(q);
        if (snapshot.data().count > 0) {
            const querySnapshot = await getDocs(q);
            return {
                data: querySnapshot,
                userType: 'added'
            };

        } else {

            const q = query(collection(firestore, "affiliates"), where("phoneNumber", "==", phone));
            const snapshot = await getCountFromServer(q);
            if (snapshot.data().count > 0) {
                const querySnapshot = await getDocs(q);
                return {
                    data: querySnapshot,
                    userType: 'affiliate'
                };

            } else {
                return null;
            }
        }


    }
}


export const getUserById = async (id: string) => {

    const q = query(collection(firestore, "admins"), where("id", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            userType: 'admin'
        };
    } else {
        const q = query(collection(firestore, "affiliates"), where("id", "==", id));
        const snapshot = await getCountFromServer(q);
        if (snapshot.data().count > 0) {
            const querySnapshot = await getDocs(q);
            return {
                data: querySnapshot,
                userType: 'affiliate'
            };
        } else {
            return null;
        }
    }


}



export const deleteDocument = async (collection: string, id: string) => {
    await deleteDoc(doc(firestore, collection, id));
}




