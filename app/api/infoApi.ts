
import { Iinfo } from "../types/infoTypes";
import { addDoc, doc, getCountFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
import { INFO_REF } from "../constants/infoConstants";
import { firestore } from "../../firebase/clientApp";
import { print } from "../utils/console";



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


export const checkForWebsiteName = async (name: string) => {

    const qry = query(INFO_REF, where("websiteName", "==", name));
    const snapshot = await getCountFromServer(qry);
    if (snapshot.data().count > 0) {
        return null;

    } else {
        return true;
    }


}