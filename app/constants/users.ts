import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";



export const USERS_DB_REF = collection(firestore, "users");