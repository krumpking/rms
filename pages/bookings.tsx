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
import AddBookingEvent from '../app/components/addBookingEvent';
import BasicCalendar from '../app/components/calendar';
import AddGeneralBookingInfo from '../app/components/addGeneralBookingInfo';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Bookings = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [previousForms, setPreviousForms] = useState<IForm[]>([]);
    const [formsSearch, setFormsSearch] = useState("");
    const [temp, setTemp] = useState<IForm[]>([]);
    const [tabs, setTabs] = useState([
        'Save General Booking Info',
        'Add Event',
        'My Events'
    ]);



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        setPreviousForms([]);

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
                    <ClientNav organisationName={'Vision Is Primary'} url={'bookings'} />
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
                                    <AddGeneralBookingInfo />
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <AddBookingEvent />
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >

                                    <BasicCalendar />
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


export default Bookings
