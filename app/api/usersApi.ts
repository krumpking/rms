
import { firestore } from "../../firebase/clientApp";
import { ADMIN_COLLECTION } from "../constants/userConstants";
import { IUser } from "../types/userTypes";
import { addDoc, collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";





export const addUser = async (user: IUser) => {

    // Create a query against the collection.
    const q = query(collection(firestore, ADMIN_COLLECTION), where("contact", "==", user.contact));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        return null;
    } else {
        return addDoc(collection(firestore, ADMIN_COLLECTION), user);
    }


}




