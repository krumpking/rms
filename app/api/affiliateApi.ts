import { addDoc, collection, getCountFromServer, query, where } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { IAffiliate } from "../types/affiliateTypes";
import { setCookie } from "react-use-cookie";
import { encrypt } from "../utils/crypto";
import { AFF_DB_REF, AFF_SALES_DB_REF, COOKIE_AFFILIATE_NUMBER } from "../constants/affilliateConstants";

export const addAffiliate = async (affiliate: IAffiliate) => {



    // Create a query against the collection.
    const coll = collection(firestore, "affiliates");
    const snapshot = await getCountFromServer(coll);
    var affNo = snapshot.data().count + 4;


    const aff = {
        id: affiliate.id,
        name: affiliate.name,
        phoneNumber: affiliate.phoneNumber,
        createdDate: affiliate.createdDate,
        email: affiliate.email,
        affiliateNo: affNo
    }

    const key = affiliate.id.substring(-13);
    setCookie(COOKIE_AFFILIATE_NUMBER, encrypt(affNo.toString(), key), {
        days: 1,
        SameSite: 'Strict',
        Secure: true,
    });

    const q = query(AFF_DB_REF, where("phoneNumber", "==", aff.phoneNumber));
    const snapshotF = await getCountFromServer(q);
    if (snapshotF.data().count > 0) {
        return null;
    } else {
        await addDoc(AFF_DB_REF, aff);


        return affNo;
    }





}

export const checkAffiliate = async (affNo: number) => {
    // Create a query against the collection.
    const q = query(collection(firestore, "affiliates"), where("affilateNo", "==", affNo));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {

        return true;
    } else {
        return false;
    }
}

export const addAffiliateSale = async (affiliate: IAffiliate) => {

    await addDoc(AFF_SALES_DB_REF, affiliate);


}