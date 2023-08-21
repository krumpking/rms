
import { ref, uploadBytes, UploadResult } from "firebase/storage";
import { storage } from "../../firebase/clientApp";



const uploadFile = (path: string, file: File): Promise<UploadResult> => {
    // Add your custom logic here, for example add a Token to the Headers
    // Create a storage reference from our storage service

    const storageRef = ref(storage, path);

    // 'file' comes from the Blob or File API    
    return uploadBytes(storageRef, file);
};



export default uploadFile;