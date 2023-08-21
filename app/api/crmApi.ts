import { CRM_DB_REF, CRM_TASK_DB_REF } from "../constants/crmConstants";
import { addDoc, doc, getCountFromServer, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { IClient } from "../types/userTypes";
import { getCookie } from "react-use-cookie";
import { ADMIN_ID, COOKIE_ID } from "../constants/constants";
import { print } from "../utils/console";
import { decrypt } from "../utils/crypto";
import { firestore } from "../../firebase/clientApp";
import { ITask } from "../types/taskTypes";





export const addAClientToDB = async (client: IClient) => {
    // Create a query against the collection.

    return addDoc(CRM_DB_REF, client);



}


export const getAllClientsToDB = async () => {
    // Create a query against the collection.

    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }


    const q = query(CRM_DB_REF, where("adminId", "==", decrypt(infoFromCookie, COOKIE_ID)), orderBy("date", "asc"));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {

        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            count: snapshot.data().count
        }

    } else {
        return null;

    }



}


export const getAllClientsByDate = async (first: Date, last: Date) => {
    // Create a query against the collection.

    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }


    const q = query(CRM_DB_REF, where("adminId", "==", decrypt(infoFromCookie, COOKIE_ID)), where("date", ">=", first), where("date", "<=", last), orderBy("date", "asc"));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {

        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            count: snapshot.data().count
        }

    } else {
        return null;

    }



}


export const updateClientToDB = async (id: string, form: IClient) => {
    return await updateDoc(doc(firestore, "clients", id), form);

}


export const addTasksToDB = (task: ITask) => {
    // Create a query against the collection.
    return addDoc(CRM_TASK_DB_REF, task);

}

export const getAllTasksToDB = async () => {
    // Create a query against the collection.

    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }


    const q = query(CRM_TASK_DB_REF, where("adminId", "==", decrypt(infoFromCookie, COOKIE_ID)), orderBy("date", "desc"));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {

        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            count: snapshot.data().count
        }

    } else {
        return null;

    }



}


export const getAllTasksToday = async () => {
    // Create a query against the collection.

    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }


    const q = query(CRM_TASK_DB_REF, where("adminId", "==", decrypt(infoFromCookie, COOKIE_ID)), where("active", "==", true), where("taskDate", "==", new Date().toDateString()));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {

        const querySnapshot = await getDocs(q);
        return {
            data: querySnapshot,
            count: snapshot.data().count
        }

    } else {
        return null;

    }

}


export const updateTask = async (id: string, date: string) => {
    return await updateDoc(doc(firestore, "crm_tasks", id), { taskDate: date });

}



