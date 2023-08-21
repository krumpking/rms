
import { Iinfo } from "../types/infoTypes";
import { addDoc, doc, getCountFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
import { INFO_REF } from "../constants/infoConstants";
import { firestore } from "../../firebase/clientApp";



export const getResInfo = async (adminId: string) => {

    const q = query(INFO_REF, where("adminId", "==", adminId));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    } else {
        return null;
    }


}


export const addResInfo = async (docId: string, info: Iinfo) => {

    const qry = query(INFO_REF, where("webfrontId", "==", info.webfrontId));
    const snapshot = await getCountFromServer(qry);
    if (snapshot.data().count > 0) {
        const q = query(INFO_REF, where("webfrontId", "==", info.webfrontId), where("id", "==", info.id));
        const snapsht = await getCountFromServer(q);
        if (snapshot.data().count > 0) {
            return updateDoc(doc(firestore, "service-providers", docId), info);;
        } else {
            return null;
        }
    } else {
        return addDoc(INFO_REF, info);
    }




}