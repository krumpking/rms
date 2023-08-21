import { addDoc, collection, doc, getCountFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
import { decrypt } from "../utils/crypto";
import { firestore } from "../../firebase/clientApp";
import { ADMINS_PAYMENTS_REF } from "../constants/paymentConstants";
import { COOKIE_ID } from "../constants/constants";
import { IPayments } from "../types/paymentTypes";



export const addPayment = async (payment: IPayments) => {

    // Create a query against the collection.


    return await addDoc(ADMINS_PAYMENTS_REF, payment);


}

export const getPayments = async (userIdEncry: string) => {


    var deId = decrypt(userIdEncry, COOKIE_ID);

    // Create a query against the collection.
    const q = query(collection(firestore, "payments"), where("userId", "==", deId));
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






export const getPromo = async (code: string) => {

    // Create a query against the collection.
    const q = query(collection(firestore, "promo"), where("code", "==", code), where("used", "==", false));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async element => {
            await updateDoc(doc(firestore, "promo", element.id), {
                used: true
            });
        });



        return true;
    } else {
        return false;
    }


}

