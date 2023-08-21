import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

export const ADMINS_PAYMENTS_REF = collection(firestore, `payments`);