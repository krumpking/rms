import React, { useEffect, useState } from 'react'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import { Tab } from '@headlessui/react';
import GenerateQuotation from '../app/components/generateQuotation';
import GenerateInvoice from '../app/components/generateInvoice.';
import GenerateReceipt from '../app/components/generateReceipt';
import { getCookie } from 'react-use-cookie';
import { decrypt } from '../app/utils/crypto';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Accounting = () => {
    const router = useRouter();
    const [tabs, setTabs] = useState([
        "Add Quotation",
        "Add Invoice",
        "Receipt",
        // "Add Expenses",
        // "Client Journey",
        // "Reports",
        // "Custom Data Collection"
    ]);




    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

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
                if (roleTitle == "Viewer") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }

    }, []);






    return (
        <div>
            <div className='flex flex-col lg:grid lg:grid-cols-12 '>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'accounting'} />
                </div>

                <div className="w-full m-2 px-2 py-8 sm:px-0 col-span-9 ">
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
                                <GenerateQuotation />

                            </Tab.Panel>
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <GenerateInvoice />
                            </Tab.Panel>
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <GenerateReceipt />
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


export default Accounting
