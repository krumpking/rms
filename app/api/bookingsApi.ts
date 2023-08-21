import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { IAttendee, IBookingEvent } from "../types/bookingsTypes";
import { getCookie } from "react-use-cookie";
import { ADMIN_ID, API_ROUTE, COOKIE_ID } from "../constants/constants";
import { decrypt } from "../utils/crypto";
import axios from "axios";
import { EMAIL_AT_BOOKING, EMAIL_REMINDER } from "../constants/bookingConstants";




export const addBookingEvent = async (bookingEvent: IBookingEvent) => {


    // Create a query against the collection.
    const BOOKINS_DB_REF = collection(firestore, `booking_event`);


    return await addDoc(BOOKINS_DB_REF, bookingEvent);



}


export const getMyEvents = async () => {


    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
        infoFromCookie = getCookie(COOKIE_ID);
    } else {
        infoFromCookie = getCookie(ADMIN_ID);
    }
    const BOOKINS_DB_REF = collection(firestore, `booking_event`);
    let id = decrypt(infoFromCookie, COOKIE_ID);
    const q = query(BOOKINS_DB_REF, where("adminId", "==", id));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count > 0) {
        var results: any = [];
        const querySnapshot = await getDocs(q);

        return {
            data: querySnapshot,
            count: results.length
        }

    } else {
        return null;

    }



}


export const getOneBookingEvent = async (id: string) => {
    // Create a query against the collection.
    const docRef = doc(firestore, "booking_event", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {

        return {
            count: 1,
            data:
                snapshot
        };
    } else {
        return null;
    }
}




export const addBookingToEvent = async (id: string, attendes: IAttendee[]) => {

    return await updateDoc(doc(firestore, "booking_event", id), {
        bookings: attendes
    });

}


export const updateBookingEvent = async (id: string, event: IBookingEvent) => {

    return await updateDoc(doc(firestore, "booking_event", id), event);

}

export const updateOrganizationInfo = async (id: string, data: any) => {

    return await updateDoc(doc(firestore, "org", id), data);
}


export const sendEmailAtBooking = async (
    email: string,
    name: string,
    title: string,
    description: string,
    venue: string,
    directions: string,
    date: string,
    endDate: string,
    time: string,
    orgEmail: string,
    call: string,
    orgName: string,
    logo: string,
    parking: string,
    refreshments: string,
    dressCode: string,
    otherInfo: string) => {
    try {


        // 👇️ const data: GetUsersResponse
        const { data, status } = await axios.post<boolean>(
            `${API_ROUTE}${EMAIL_AT_BOOKING}`,
            {
                email: email,
                name: name,
                title: title,
                description: description,
                venue: venue,
                directions: directions,
                date: date,
                endDate: endDate,
                time: time,
                orgEmail: orgEmail,
                call: call,
                logo: logo,
                orgName: orgName,
                parking: parking,
                refreshments: refreshments,
                dressCode: dressCode,
                otherInfo: otherInfo

            },
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('unexpected error: ', error);
            return null;
        }
    }
}

export const sendEmailReminder = async (
    email: string,
    name: string,
    title: string,
    description: string,
    venue: string,
    directions: string,
    date: string,
    endDate: string,
    time: string,
    orgEmail: string,
    orgName: string,
    call: string,
    logo: string,
    before: boolean) => {
    try {
        // 👇️ const data: GetUsersResponse
        const { data, status } = await axios.post<boolean>(
            `${API_ROUTE}${EMAIL_REMINDER}`,
            {
                email: email,
                name: name,
                title: title,
                description: description,
                venue: venue,
                directions: directions,
                date: date,
                endDate: endDate,
                time: time,
                orgEmail: orgEmail,
                call: call,
                logo: logo,
                orgName: orgName,
                before: before
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return null;
        } else {
            console.log('unexpected error: ', error);
            return null;
        }
    }
}


export const updateBooking = async (id: string, data: any) => {
    return await updateDoc(doc(firestore, "booking_event", id), data);
}



