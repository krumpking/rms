import { addDoc, collection, doc, getCountFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
import { decrypt } from "../utils/crypto";
import { firestore } from "../../firebase/clientApp";
import { PAYMENTS_COLLECTION } from "../constants/paymentConstants";
import { IPayments } from "../types/paymentTypes";
import { useAuthIds } from "../components/authHook";

const { adminId, userId, access } = useAuthIds();



export const getPayments = async () => {




    // Create a query against the collection.
    const q = query(collection(firestore, "payments"), where("adminId", "==", adminId));
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

