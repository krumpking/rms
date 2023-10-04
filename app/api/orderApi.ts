import { collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";




export const getOrdersStatus = async (collectionName: string, fieldOne: string, checkOne: string) => {
    const q = query(collection(firestore, collectionName), where(fieldOne, "==", checkOne), where('status', '<', 100));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return { data: querySnapshot, count: snapshot.data().count };

    } else {
        return null;
    }
}

