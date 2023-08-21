import React, { Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, URL_LOCK_ID } from '../../app/constants/constants';
import Payment from '../../app/utils/paymentUtil';
import { decrypt } from '../../app/utils/crypto';
import Loader from '../../app/components/loader';
import { getCookie } from 'react-use-cookie';
import { Tab } from '@headlessui/react';
import CRMReportTemplate from './crmReportTemplate';



function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const CRMReport = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([
        "Today",
        "This Week",
        "This Month",
        "This Quarter",
        "This Year",
        "Overview"
    ])



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        checkPayment();


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




    }, [router.isReady]);

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



    return (
        <div>
            <div className='flex flex-col '>






                {loading ?
                    <div className='flex flex-col justify-center items-center w-full col-span-8'>
                        <Loader />
                    </div> :
                    <>
                        <Tab.Group>
                            <Tab.List className="flex space-x-4 rounded-[25px] bg-green-900/20 p-1 overflow-x-auto whitespace-nowrap ">
                                {tabs.map((category) => (
                                    <Tab
                                        key={category}
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full  py-2.5 text-sm font-medium leading-5 text-[#00947a] rounded-[25px]',
                                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#00947a] focus:outline-none focus:ring-2',
                                                selected
                                                    ? 'bg-white shadow p-4'
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
                                    <CRMReportTemplate tab={0} />
                                </Tab.Panel>
                                <Tab.Panel

                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <CRMReportTemplate tab={1} />
                                </Tab.Panel>
                                <Tab.Panel

                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <CRMReportTemplate tab={2} />
                                </Tab.Panel>
                                <Tab.Panel

                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <CRMReportTemplate tab={3} />
                                </Tab.Panel>
                                <Tab.Panel

                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <CRMReportTemplate tab={4} />
                                </Tab.Panel>
                                <Tab.Panel

                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <CRMReportTemplate tab={5} />
                                </Tab.Panel>

                            </Tab.Panels>
                        </Tab.Group>
                    </>

                }




            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default CRMReport


