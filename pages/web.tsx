import React, { useEffect, useState } from 'react'
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';



const WebFront = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();




    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


    }, []);






    return (
        <div>


            <div>

                <div className='flex flex-col lg:grid lg:grid-cols-12 '>

                    <div className='lg:col-span-3' id="nav">
                        <ClientNav organisationName={'FoodiesBooth'} url={'web'} />
                    </div>


                    {loading ?
                        <div className='flex flex-col justify-center items-center w-full col-span-9'>
                            <Loader />
                        </div>

                        :
                        <div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8'>


                        </div>}




                </div>



                <ToastContainer
                    position="top-right"
                    autoClose={5000} />
            </div>


            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default WebFront
