import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/clientApp";
import axios from "axios";
import { print } from "./console";





export const getUrl = async (src: string) => {

    const pathReference = ref(storage, src);
    var url = ""
    try {

        url = await getDownloadURL(pathReference);
        return url;
    } catch (error: any) {
        console.error(error);
        print(error.message);
        return null;
    }


}