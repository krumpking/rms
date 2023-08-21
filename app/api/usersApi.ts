
import { firestore } from "../../firebase/clientApp";
import { USERS_DB_REF } from "../constants/users";
import { IUser } from "../types/userTypes";
import { addDoc, collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { deleteDocument } from "./adminApi";




export const addUser = async (user: IUser) => {

    // Create a query against the collection.
    const q = query(USERS_DB_REF, where("contact", "==", user.contact));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        return null;
    } else {
        return addDoc(USERS_DB_REF, user);
    }


}


export const getUsers = async (id: string) => {


    // Create a query against the collection.
    const q = query(collection(firestore, "users"), where("adminId", "==", id));
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


export const deleteById = async (id: string) => {
    const q = query(collection(firestore, "users"), where("id", "==", id));
    const snapshot = await getCountFromServer(q);

    if (snapshot.data().count > 0) {

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((el) => {
            deleteDocument("users", el.id);
        });


    }
}