import React, { useEffect, useState } from 'react'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, PRIMARY_COLOR, URL_LOCK_ID } from '../constants/constants';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from './clientNav';
import Payment from '../utils/paymentUtil';
import { decrypt, encrypt } from '../utils/crypto';
import { getCookie } from 'react-use-cookie';
import { IData } from '../types/types';
import FormSummary from './formSummary';
import { searchStringInMembers } from '../utils/stringM';
import { getAllData } from '../api/formApi';


const Data = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [data, setData] = useState<IData[]>([]);
    const [formsSearch, setFormsSearch] = useState("");
    const [temp, setTemp] = useState<IData[]>([]);



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        checkPayment();

        var infoFormCookie = getCookie(COOKIE_ID);
        if (typeof infoFormCookie !== 'undefined') {


            if (infoFormCookie.length > 0) {
                const id = decrypt(infoFormCookie, COOKIE_ID);

                setData([]);
                getAllData(id).then((v) => {

                    if (v !== null) {

                        v.data.forEach(element => {
                            setData((data) => [...data, {
                                id: element.id,
                                title: element.data().title,
                                descr: element.data().descr,
                                date: element.data().date,
                                editorId: element.data().editorId,
                                encryption: element.data().encryption,
                                info: element.data().info,
                                infoId: element.data().infoId
                            }]);
                        });

                        v.data.forEach(element => {
                            setTemp((data) => [...data, {
                                id: element.id,
                                title: element.data().title,
                                descr: element.data().descr,
                                date: element.data().date,
                                editorId: element.data().editorId,
                                encryption: element.data().encryption,
                                info: element.data().info,
                                infoId: element.data().infoId
                            }]);
                        });

                        setLoading(false);

                    }

                }).catch(console.error);

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


                let res: IData[] = searchStringInMembers(temp, formsSearch);
                setTemp([]);

                if (res.length > 0) {

                    setTimeout(() => {
                        setTemp(res);
                        setLoading(false);
                    }, 1500);
                } else {
                    toast.info(`${formsSearch} not found`);
                    setTimeout(() => {
                        setTemp(data);
                        setLoading(false);
                    }, 1500);
                }



            } else {
                setTemp([]);
                setTimeout(() => {
                    setTemp(data);
                    setLoading(false);
                }, 1500);

            }



        }
    };






    return (
        <div>




            <div className='bg-white rounded-[30px] p-4  overflow-y-scroll'>
                <div className='p-4'>
                    <input
                        type="text"
                        value={formsSearch}
                        placeholder={"Search for data"}
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

                {loading ?
                    <div className='flex flex-col justify-center items-center w-full col-span-8'>
                        <Loader />
                    </div> : <div className=' grid grid-cols-1  md:grid-cols-3  2xl:grid-cols-5 gap-4 p-4 '>
                        {temp.map((v) => (
                            <FormSummary key={v.id} title={v.title} description={v.descr} url={typeof v.id !== 'undefined' ? `/display/${encrypt(v.id, URL_LOCK_ID)}` : null} />
                        ))}
                    </div>}
            </div>






            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default Data
