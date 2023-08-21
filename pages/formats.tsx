import React, { useEffect, useState } from 'react'
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import Payment from '../app/utils/paymentUtil';
import { searchStringInMembers } from '../app/utils/stringM';



const Formats = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formsSearch, setFormsSearch] = useState("");
    const [temp, setTemp] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);




    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        // checkPayment();

        return () => {

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


                let res: any[] = searchStringInMembers(temp, formsSearch);
                setTemp([]);

                if (res.length > 0) {

                    setTimeout(() => {
                        setTemp(res);
                        setLoading(false);
                    }, 1500);
                } else {
                    toast.info(`${formsSearch} not found`);
                    setTimeout(() => {
                        setTemp(templates);
                        setLoading(false);
                    }, 1500);
                }



            } else {
                setTemp([]);
                setTimeout(() => {
                    setTemp(templates);
                    setLoading(false);
                }, 1500);

            }



        }
    };







    return (
        <div>

            <div className='flex flex-col lg:grid lg:grid-cols-12'>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'formats'} />
                </div>
                <div className='bg-white col-span-8 m-8 rounded-[30px] p-4 lg:p-16 overflow-y-scroll'>
                    <div className='p-4'>
                        <input
                            type="text"
                            value={formsSearch}
                            placeholder={"Search for formats"}
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
                    <h1>Coming Soon</h1>
                </div>

            </div>





            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default Formats
