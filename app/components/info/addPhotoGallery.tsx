import React, { Fragment, useCallback, useEffect, useState } from 'react'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import ImageGallery from "react-image-gallery";
import { decrypt } from '../../utils/crypto';
import { useDropzone } from 'react-dropzone';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { addResInfo, getResInfo } from '../../api/infoApi';
import imageCompression from 'browser-image-compression';
import { getDownloadURL } from 'firebase/storage';
import { Dialog, Transition } from '@headlessui/react';
import "react-image-gallery/styles/css/image-gallery.css";
import { getUrl } from '../../utils/getImageUrl';
import { Iinfo } from '../../types/infoTypes';
import { print } from '../../utils/console';
import ShowImageGalleries from '../showImageGallery';
import { uploadFile } from '../../api/mainApi';
import AppAccess from '../accessLevel';


const PhotoGallery = () => {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<any[]>([{
        original: "/images/ex1.png",
        thumbnail: "/images/ex1.png",
    },
    {
        original: "/images/ex1.png",
        thumbnail: "/images/ex1.png",
    },
    {
        original: "/images/ex1.png",
        thumbnail: "/images/ex1.png",
    },]);
    const [files, setFiles] = useState<any[]>([]);
    const [imageLoader, setImageLoader] = useState(false);
    const [percentageDone, setPercentageDone] = useState(0);
    const [webfrontname, setWebfrontname] = useState("");
    const [title, setTitle] = useState("");
    const [about, setAbout] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [adminId, setAdminId] = useState("adminId");
    const [date, setDate] = useState<Date>(new Date());
    const [dateString, setDateString] = useState("");
    const [id, setId] = useState("");
    const [open, setOpen] = useState(false);
    const [gallery, setGallery] = useState<string[]>([]);
    const [docId, setDocId] = useState("");
    const [accessArray, setAccessArray] = useState<any[]>([
        'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
        'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
        'staff-scheduling', 'website', 'payments']);

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
                    if (val.gallery.length > 0) {
                        let imgs: any[] = [];
                        val.gallery.forEach(async (element: any) => {

                            let og = await getUrl(`/${val.webfrontId}/gallery/${element.original}`);
                            let thumbnail = await getUrl(`/${val.webfrontId}/gallery/${element.thumbnail}`);

                            imgs.push({
                                original: og,
                                thumbnail: thumbnail,
                            });

                        });

                        setImages(imgs);
                    }

                    setTimeout(() => {
                        setLoading(false);
                        setImageLoader(false);
                    }, 1500);


                });

            }

        }).catch((e: any) => {
            console.error(e);
            toast.error('There was an error please try again');
        })
    }



    const addImagesToGallery = () => {
        setOpen(false);
        setImageLoader(true);
        setLoading(true);



        // loop over existing files
        let index = 0;
        let currFiles: any[] = [];
        if (gallery.length > 0) {
            currFiles = gallery;
        }

        files.forEach(async (file: File) => {


            const name = file.name;


            try {


                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }



                await uploadFile(`${webfrontname}/gallery/${name}`, file);
                const info = name.split('_');


                try {
                    const compressedFile = await imageCompression(file, options);

                    // Thumbnail
                    await uploadFile(`${webfrontname}/gallery/thumbnail_${name}`, compressedFile);
                    index++;
                    setPercentageDone(Math.floor((index / files.length) * 100));
                    currFiles.push({
                        original: name,
                        thumbnail: `thumbnail_${name}`
                    })
                    if (index === files.length - 1) {

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
                            id: id,
                            gallery: currFiles
                        }


                        addResInfo(docId, info).then((v) => {
                            setPercentageDone(0);
                            getInfo();
                            setImageLoader(false);
                            setLoading(false);
                        }).catch((e: any) => {
                            setImageLoader(false);
                            setLoading(false);
                            console.error(e);
                            toast.error('There was an error please try again');
                        })



                    }
                } catch (error) {
                    console.log(error);
                }




            } catch (e) {
                console.error(e);
            }
        });








    }

    const onDrop = useCallback((acceptedFiles: File[]) => {


        if (files.length > 0) {
            let currFiles = files;

            currFiles.concat(acceptedFiles);
            setFiles(currFiles);
        } else {
            setFiles(acceptedFiles);
        }




    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop })








    return (
        <AppAccess access={accessArray} component={'website'}>
            <div>

                <div className='bg-white rounded-[30px] p-4  overflow-y-scroll flex flex-col items-center w-full'>


                    {loading ?
                        <div>
                            {imageLoader ?
                                <CircularProgressbar
                                    value={percentageDone}
                                    maxValue={100}
                                    text={`${percentageDone}%`}
                                    styles={buildStyles({

                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'butt',

                                        // Text size
                                        textSize: '8px',

                                        // How long animation takes to go from one percentage to another, in seconds
                                        pathTransitionDuration: 0.5,


                                    })} /> : <Loader />}
                        </div>
                        : <div className='flex flex-col'>

                            <ShowImageGalleries images={images} />
                            <button
                                onClick={() => { setOpen(true) }}
                                className="
                                        font-bold
                                        w-ful
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
                                Upload Images
                            </button>
                        </div>}

                </div>

                <Transition appear show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={() => setOpen(false)}
                    >
                        <div className="min-h-screen px-4 text-center backdrop-blur-sm ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0" />
                            </Transition.Child>

                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="bg-slate-100 my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                                    <Dialog.Title
                                        as="h3"
                                        className="text-sm font-medium leading-6 text-gray-900 m-4"
                                    >

                                        {files.length > 0 ?
                                            <div className="grid grid-cols-2 gap-4">
                                                <p>Adding Gallery</p>
                                                <p>{files.length} Picture{files.length > 1 ? 's' : ''} Added</p>
                                            </div> : 'Adding Gallery'}
                                    </Dialog.Title>

                                    <div className="grid grid-rows-auto bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 space-y-4">



                                        <div className='grid grid-rows-4 border-dashed border-2 border-indigo-600 place-items-center' {...getRootProps()}>
                                            <input className="hidden"

                                                {...getInputProps()} />
                                            <div className='mt-8'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                                </svg>
                                            </div>
                                            <p>Select multiple files</p>
                                            <p>OR</p>
                                            <p>Drop pictures here</p>
                                        </div>
                                        <p>{files.length} Images{files.length > 1 ? 's' : ''} Added</p>
                                        <button
                                            onClick={() => { addImagesToGallery() }}
                                            className="
                                        font-bold
                                        w-ful
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
                                            Upload Images
                                        </button>




                                    </div>

                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>




                <ToastContainer
                    position="top-right"
                    autoClose={5000} />
            </div >
        </AppAccess>


    )
};


export default PhotoGallery


