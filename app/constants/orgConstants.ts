import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";




export const ORG_DB_REF = collection(firestore, "org");