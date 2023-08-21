import { IOrg } from "../types/orgTypes";
import { ORG_DB_REF } from "../constants/orgConstants";
import { addDoc, doc, getCountFromServer, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { getCookie } from "react-use-cookie";
import { ADMIN_ID, COOKIE_ID } from "../constants/constants";
import { decrypt } from "../utils/crypto";





export const addOrgToDB = async (org: IOrg) => {

    // Create a query against the collection.
    const q = query(ORG_DB_REF, where("adminId", "==", org.adminId));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (el) => {
            return await updateDoc(doc(firestore, "org", el.id), org);
        });
    } else {
        return addDoc(ORG_DB_REF, org);
    }


}

export const getOrgInfoFromDB = async () => {
    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }
    var id = decrypt(infoFromCookie, COOKIE_ID);

    const q = query(ORG_DB_REF, where("adminId", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
        };
    } else {
        return null;
    }
}