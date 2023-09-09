import React, { useCallback, useEffect, useState } from 'react'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { createId } from '../../utils/stringM';
import { Iinfo } from '../../types/infoTypes';
import { addResInfo, getResInfo } from '../../api/infoApi';
import { decrypt } from '../../utils/crypto';
import { setDate } from 'date-fns';
import { checkEmptyOrNull } from '../../utils/objectM';
import AppAccess from '../accessLevel';
import { useDropzone } from 'react-dropzone';
import { updateDocument, uploadFile } from '../../api/mainApi';
import imageCompression from 'browser-image-compression';
import { print } from '../../utils/console';
import { INFO_COLLECTION } from '../../constants/infoConstants';
import ShowImage from '../showImage';




const GeneralInfo = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [webfrontname, setWebfrontname] = useState("webfrontId");
    const [title, setTitle] = useState("");
    const [about, setAbout] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [adminId, setAdminId] = useState("adminId");
    const [date, setDate] = useState<Date>(new Date());
    const [dateString, setDateString] = useState("");
    const [id, setId] = useState("");
    const [docId, setDocId] = useState("");
    const [accessArray, setAccessArray] = useState<any[]>([
        'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
        'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
        'staff-scheduling', 'website', 'payments']);
    const [image, setImage] = useState<any>();
    const [imageAdded, setImageAdded] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [gallery, setGallery] = useState<string[]>([""]);


    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        setAdminId(decrypt(infoFromCookie, COOKIE_ID));


        getInfo();


    }, []);


    const getInfo = () => {
        getResInfo(adminId).then((r) => {

            if (r !== null) {

                r.forEach((el) => {
                    let val = el.data();
                    setWebfrontname(val.webfrontId);
                    setTitle(val.title);
                    setAbout(val.about);
                    setAddress(val.address);
                    setPhone(val.phone);
                    setEmail(val.email);
                    setDate(val.date);
                    setDateString(val.dateString);
                    setId(val.id);
                    setDocId(el.id);
                    setIsUpdate(true);
                    setImage(val.logo);
                    setGallery(val.gallery);

                });
                setLoading(false);

            }

        }).catch((e: any) => {
            console.error(e);
            setLoading(false);
            toast.error('There was an error please try again');
        })
    }


    const addInfo = async () => {




        let ident = "";
        if (id === "") {
            ident = createId();
        } else {
            ident = id;

        }

        let info: Iinfo = {
            adminId: "adminId",
            webfrontId: webfrontname,
            title: title,
            about: about,
            address: address,
            phone: phone,
            email: email,
            date: new Date(),
            dateString: new Date().toDateString(),
            id: ident,
            gallery: gallery,
            logo: {}

        }



        if (checkEmptyOrNull(info)) {
            toast.error('Ooops looks like you left out some information')
        } else {

            if (files.length > 0) {
                setLoading(true);
                try {

                    const name = files[0].name;
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    }



                    await uploadFile(`${webfrontname}/logo/${name}`, files[0]);
                    const info = name.split('_');


                    try {
                        const compressedFile = await imageCompression(files[0], options);

                        // Thumbnail
                        await uploadFile(`${webfrontname}/logo/thumbnail_${name}`, compressedFile);

                        let newInfo = {
                            adminId: "adminId",
                            webfrontId: webfrontname,
                            title: title,
                            about: about,
                            address: address,
                            phone: phone,
                            email: email,
                            date: new Date(),
                            dateString: new Date().toDateString(),
                            id: ident,
                            gallery: gallery,
                            logo: {
                                original: name,
                                thumbnail: `thumbnail_${name}`
                            }
                        }


                        if (isUpdate) {
                            updateDocument(INFO_COLLECTION, docId, newInfo).then((v) => {
                                toast.success("Info updated");
                                setLoading(false);
                            }).catch((e: any) => {
                                setLoading(false);
                                console.error(e);
                                toast.error('There was an error please try again');
                            });
                        } else {


                            addResInfo(newInfo).then((v) => {
                                if (v == null) {
                                    toast.error('Webfront name is already taken please try another one');
                                } else {
                                    toast.success('Wohooo information successfully saved!');
                                }
                                setLoading(false);
                            }).catch((e: any) => {
                                setLoading(false);
                                console.error(e);
                                toast.error('There was an error please try again');
                            });

                        }







                    } catch (error) {
                        console.log(error);
                    }




                } catch (e) {
                    console.error(e);
                }

            } else {
                toast.error('Ooops looks like you left out your logo');
            }




        }

    }


    const onDrop = useCallback((acceptedFiles: any[]) => {

        var reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = function () {
            if (reader.result !== null) {
                setImage(reader.result);
                setImageAdded(true);
            }

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        // Do something with the files
        if (files.length > 0) {
            let currFiles = files;

            currFiles.concat(acceptedFiles);
            setFiles(currFiles);
        } else {
            setFiles(acceptedFiles);
        }




    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    return (
        <AppAccess access={accessArray} component={'website'}>
            <div>

                <div className='bg-white rounded-[30px] p-4  overflow-y-scroll'>
                    {loading ?
                        <div className='w-full flex flex-col items-center content-center'>
                            <Loader />
                        </div>
                        :
                        <div className='grid grid-cols-1 lg:grid-cols-2'>

                            <div className='flex flex-col items-center space-y-2 w-full'>
                                <p className='text-center text-xs text-gray-300 mb-4 font-bold'>Update Organization Info</p>

                                <div {...getRootProps()} className='border-dashed h-48 w-full border-2 p-8 flex content-center items-center text-center' >
                                    <input {...getInputProps()} />
                                    <>
                                        {imageAdded ? <p>Logo added</p>
                                            : <>
                                                {
                                                    isDragActive ?
                                                        <p>Drop the logo here ...</p> :
                                                        <p> Drag &lsquo;n&lsquo; drop some logo here, or click to select logo image</p>
                                                }
                                            </>
                                        }
                                    </>

                                </div>
                                <p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>Update Your Info</p>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={webfrontname}
                                        placeholder={"Webfront Name"}
                                        onChange={(e) => {
                                            setWebfrontname(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={title}
                                        placeholder={"Title"}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <div className="mb-6 w-full">
                                    <textarea

                                        value={about}
                                        placeholder={"Tell us your story"}
                                        onChange={(e) => {
                                            setAbout(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        h-48
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={address}
                                        placeholder={"Address"}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={email}
                                        placeholder={"Main email"}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={phone}
                                        placeholder={"Main Phone"}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        required
                                    />
                                </div>
                                <button
                                    onClick={() => { addInfo() }}
                                    className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        border-primary
                                        py-3
                                        px-10
                                        bg-[#8b0e06]
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    ">
                                    {isUpdate ? 'Update Info' : 'Add Info'}
                                </button>

                            </div>
                            <div className='flex flex-col items-center space-y-2 w-full text-center'>
                                <p className='text-center text-xs text-gray-300 mb-4 font-bold w-full'>Your Basic Info</p>
                                {isUpdate ?
                                    <ShowImage src={`${webfrontname}/logo/${image.thumbnail}`} alt={'logo'} style={'rounded-[25px] shadow-md w-48 h-48'} />
                                    : <img src={imageAdded ? image : `${image}`} className='rounded-[25px] shadow-md w-48 h-48' />}
                                <h1 className='mb-6 w-full'>{webfrontname}</h1>
                                <h1 className='mb-6 w-full'>{title}</h1>
                                <p className='mb-6 w-full'>{about}</p>
                                <h1 className='mb-6 w-full'>{address}</h1>
                                <h1 className='mb-6 w-full'>{phone}</h1>
                                <h1 className='mb-6 w-full'>{email}</h1>

                            </div>
                        </div>}
                </div>






                <ToastContainer
                    position="top-right"
                    autoClose={5000} />
            </div>
        </AppAccess>


    )
};


export default GeneralInfo
