import React, { useEffect, useState } from 'react'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import Payment from '../app/utils/paymentUtil';
import { decrypt, encrypt } from '../app/utils/crypto';
import { getCookie } from 'react-use-cookie';

import FormSummary from '../app/components/formSummary';
import { searchStringInMembers } from '../app/utils/stringM';
import { print } from '../app/utils/console';
import { IForm } from '../app/types/formTypes';
import { getForms } from '../app/api/formApi';
import { Tab } from '@headlessui/react';
import Data from '../app/components/data';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Forms = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [previousForms, setPreviousForms] = useState<IForm[]>([]);
    const [formsSearch, setFormsSearch] = useState("");
    const [temp, setTemp] = useState<IForm[]>([]);
    const [tabs, setTabs] = useState([
        'Form',
        'My Data'
    ]);



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        setPreviousForms([]);

        checkPayment();


        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        if (typeof infoFromCookie !== 'undefined') {


            if (infoFromCookie.length > 0) {
                const adminId = decrypt(infoFromCookie, COOKIE_ID);
                const id = decrypt(getCookie(COOKIE_ID), COOKIE_ID);

                getForms(adminId).then((v) => {
                    if (v !== null) {
                        v.data.forEach(element => {
                            setPreviousForms((prevForms) => [...prevForms, {
                                id: element.id,
                                title: element.data().title,
                                description: element.data().description,
                                elements: element.data().elements,
                                dateCreated: element.data().dateCreated,
                                adminId: element.data().adminId,
                                creatorId: id,
                                editorNumbers: element.data().editorNumbers
                            }]);

                            setTemp((prevForms) => [...prevForms, {
                                id: element.id,
                                title: element.data().title,
                                description: element.data().description,
                                elements: element.data().elements,
                                dateCreated: element.data().dateCreated,
                                creatorId: id,
                                adminId: element.data().adminId,
                                editorNumbers: element.data().editorNumbers
                            }]);







                        });
                        setLoading(false);


                    }
                }).catch((e) => {
                    toast.error('There was an error getting the')
                })

            } else {
                router.push({
                    pathname: '/login',
                });
            }


        } else {
            router.push({
                pathname: '/login',
            });
        }


        let role = getCookie(PERSON_ROLE);


        if (typeof role !== 'undefined') {
            if (role !== "") {
                var id = decrypt(infoFromCookie, COOKIE_ID);
                var roleTitle = decrypt(role, id);
                if (roleTitle == "Viewer") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }






    }, []);

    const checkPayment = async () => {
        const paymentStatus = await Payment.checkPaymentStatus();
        if (!paymentStatus) {
            toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

            setTimeout(() => {
                router.push({
                    pathname: '/payments',
                });
            }, 5000);

        }
    }

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            setLoading(true);
            if (formsSearch !== '') {


                let res: IForm[] = searchStringInMembers(temp, formsSearch);
                setTemp([]);
                print(res);
                if (res.length > 0) {

                    setTimeout(() => {
                        setTemp(res);
                        setLoading(false);
                    }, 1500);
                } else {
                    toast.info(`${formsSearch} not found`);
                    setTimeout(() => {
                        setTemp(previousForms);
                        setLoading(false);
                    }, 1500);
                }



            } else {
                setTemp([]);
                setTimeout(() => {
                    setTemp(previousForms);
                    setLoading(false);
                }, 1500);

            }



        }
    };






    return (
        <div>

            <div className='flex flex-col lg:grid lg:grid-cols-12'>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'forms'} />
                </div>



                {loading ?
                    <div className='flex flex-col justify-center items-center w-full col-span-8'>
                        <Loader />
                    </div>

                    :
                    <div className='bg-white col-span-9 m-8 rounded-[30px] p-4 lg:p-16 overflow-y-scroll'>

                        <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-[25px] bg-green-900/20 p-1">
                                {tabs.map((category) => (
                                    <Tab
                                        key={category}
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full  py-2.5 text-sm font-medium leading-5 text-[#00947a] rounded-[25px]',
                                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#00947a] focus:outline-none focus:ring-2',
                                                selected
                                                    ? 'bg-white shadow'
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
                                    <div className='p-4'>
                                        <input
                                            type="text"
                                            value={formsSearch}
                                            placeholder={"Search for form"}
                                            onChange={(e) => {
                                                setFormsSearch(e.target.value);

                                            }}
                                            className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>

                                    <div className=' grid grid-cols-1 md:grid-cols-3  2xl:grid-cols-5 gap-4 p-4 justify-items-center'>
                                        {/* Previous Forms  */}
                                        <a href={'/createForm'}>
                                            <div className='flex flex-col items-center shadow-2xl rounded-[30px] h-32 w-48 border p-4 text-[#00947a]'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-32 h-32 m-auto ">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                <h1 className='font-bold'>Add Form</h1>
                                            </div>

                                        </a>
                                        {temp.map((v) => (
                                            <FormSummary key={v.id} title={v.title} description={v.description} url={typeof v.id !== 'undefined' ? `/myForm/${encrypt(v.id, COOKIE_ID)}` : null} />
                                        ))}

                                    </div>
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >

                                    <Data />
                                </Tab.Panel>


                            </Tab.Panels>
                        </Tab.Group>


                    </div>}




            </div>





            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default Forms
