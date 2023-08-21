import { getCookie } from "react-use-cookie";
import { ADMIN_ID, COOKIE_ID } from "../constants/constants";
import { decrypt } from "../utils/crypto";
import { getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { CRM_DB_REF } from "../constants/crmConstants";
import { print } from "../utils/console";





export const getCount = async (stage: string) => {
    // Create a query against the collection.

    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }

    let id = decrypt(infoFromCookie, COOKIE_ID);
    const q = query(CRM_DB_REF, where("adminId", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        var results: any = [];
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((element) => {
            if (decrypt(element.data().stage, id) === stage) {
                results.push(element.data())
            }
        });

        return {
            data: results,
            count: results.length
        }

    } else {
        return null;

    }



}