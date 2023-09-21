import { getCookie } from "react-use-cookie";
import DateMethods from "./date";
import { decrypt } from "./crypto";
import { print } from "./console";
import { getPayments } from "../api/paymentApi";
import { Timestamp } from "firebase/firestore";
import { useAuthIds } from "../components/authHook";


export const checkPaymentStatus = async () => {

    var result = false;
    const v = await getPayments();
    if (v !== null) {
        v.data.forEach(element => {

            const diff = DateMethods.diffDatesDays(element.data().paymentDateString, new Date().toString());
            print(diff);
            print(diff < element.data().duration);
            if (diff < element.data().duration) {
                result = true;
                return;
            }
        });

    }
    return result;


}