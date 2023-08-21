import { collection } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";



export const CRM_DB_REF = collection(firestore, "clients");

export const CRM_TASK_DB_REF = collection(firestore, "crm_tasks");