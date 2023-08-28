import React, { useCallback, useEffect, useState } from 'react'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import { useDropzone } from 'react-dropzone'
import { getBase64 } from '../app/utils/fileMethods';
import { getCookie } from 'react-use-cookie';
import { addOrgToDB, getOrgInfoFromDB } from '../app/api/orgApi';
import { decrypt, encrypt } from '../app/utils/crypto';
import { print } from '../app/utils/console';
import { Tab } from '@headlessui/react';
import GeneralInfo from '../app/components/info/addGeneralInfo';
import PhotoGallery from '../app/components/info/addPhotoGallery';



function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}


const Support = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [call, setCall] = useState("");
    const [landline, setLandline] = useState("");
    const [vat, setVat] = useState(0);
    const [image, setImage] = useState<any>()
    const [imageAdded, setImageAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quotation, setQuotation] = useState("");
    const router = useRouter();
    const [tabs, setTabs] = useState([
        'General Info',
        'Photo Gallery',
        // 'Video Gallery',
        // 'My Restaurent'
    ]);



    useEffect(() => {


        let role = getCookie(PERSON_ROLE);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        if (typeof role !== 'undefined') {
            if (role !== "") {
                var id = decrypt(infoFromCookie, COOKIE_ID);
                var roleTitle = decrypt(role, id);
                if (roleTitle == "Editor") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }



    }, [])


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





    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        getOrgInfo();



    }, [])


    const getOrgInfo = () => {
        setLoading(true);
        getOrgInfoFromDB().then((r) => {

            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }
            var id = decrypt(infoFromCookie, COOKIE_ID);


            if (r !== null) {

                r.data.forEach(element => {

                    setOrganizationName(decrypt(element.data().organizationName, id));
                    setAddress(decrypt(element.data().address, id));
                    setEmail(decrypt(element.data().email, id));
                    setCall(decrypt(element.data().call, id));
                    setLandline(decrypt(element.data().landline, id));
                    setVat(parseInt(decrypt(element.data().vat, id)));
                    setImage(element.data().image);
                    setQuotation(decrypt(element.data().quotation, id))
                });

            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });
    }




    const addOrg = () => {
        setLoading(true);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        var id = decrypt(infoFromCookie, COOKIE_ID);
        var org = {
            image: image,
            adminId: id,
            organizationName: encrypt(organizationName, id),
            address: encrypt(address, id),
            email: encrypt(email, id),
            call: encrypt(call, id),
            landline: encrypt(landline, id),
            vat: encrypt(vat.toString(), id),
            encryption: 2,
            quotation: encrypt(quotation, id)
        }

        addOrgToDB(org).then((e) => {
            setLoading(false);
            toast.success("Added Successfully");
        }).catch((e: any) => {
            console.error(e);
            setLoading(false);
            toast.error("There was an error adding information please try again");
        })
    }


    return (
        <div>
            <div className='flex flex-col'>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'info'} />
                </div>


                <div className='bg-white col-span-9 m-8 rounded-[30px]  p-8'>

                    <Tab.Group>
                        <Tab.List className="flex space-x-4 rounded-[25px] bg-[#f3f3f3] p-1 overflow-x-auto whitespace-nowrap">
                            {tabs.map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-full  py-2.5 text-sm font-medium leading-5 text-black rounded-[25px]',
                                            'ring-white  m-1',
                                            selected
                                                ? 'bg-white shadow-md focus:outline-none'
                                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="mt-2 ">

                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <GeneralInfo />
                            </Tab.Panel>
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <PhotoGallery />
                            </Tab.Panel>


                        </Tab.Panels>
                    </Tab.Group>




                </div>




            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default Support
