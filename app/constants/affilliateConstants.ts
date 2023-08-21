import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

export const AFF_DB_REF = collection(firestore, "affiliates");
export const AFF_SALES_DB_REF = collection(firestore, "affiliates-sales");

export const COOKIE_AFFILIATE_NUMBER = '7894236150jklasdfghjkl';