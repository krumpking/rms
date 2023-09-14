import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";



export const INFO_COLLECTION = "service-providers";

export const INFO_REF = collection(firestore, INFO_COLLECTION);

