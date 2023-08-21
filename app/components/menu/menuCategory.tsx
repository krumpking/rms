import React, { useEffect, useState } from 'react'


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




const AddMenuCategory = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
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
    const [docId, setDocId] = useState("");





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

                });
                setLoading(false);

            }

        }).catch((e: any) => {
            console.error(e);
            setLoading(false);
            toast.error('There was an error please try again');
        })
    }





    const addInfo = () => {

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
            gallery: []
        }



        if (checkEmptyOrNull(info)) {
            toast.error('Ooops looks like you left out some information')
        } else {
            setLoading(true);
            addResInfo(docId, info).then((v) => {
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
            })
        }

    }



    return (
        <div>

            <div className='bg-white rounded-[30px] p-4  overflow-y-scroll'>
                {loading ?
                    <div className='w-full flex flex-col items-center content-center'>
                        <Loader />

                    </div>
                    :




                    <div className='grid grid-cols-1 lg:grid-cols-2'>

                        <div className='flex flex-col items-center space-y-2 w-full'>
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold'>Update Your Info</p>
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                                Add Organization Info
                            </button>

                        </div>
                        <div className='flex flex-col items-center space-y-2 w-fullre'>
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold'>Your Info</p>
                            <h1 className='mb-6'>{webfrontname}</h1>
                            <h1 className='mb-6'>{title}</h1>
                            <p className='mb-6'>{about}</p>
                            <h1 className='mb-6'>{address}</h1>
                            <h1 className='mb-6'>{phone}</h1>
                            <h1 className='mb-6'>{email}</h1>

                        </div>
                    </div>}
            </div>






            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default AddMenuCategory
