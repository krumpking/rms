import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";



export const INFO_REF = collection(firestore, "service-providers");