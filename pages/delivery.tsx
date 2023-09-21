import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../app/components/loader';
import { PRIMARY_COLOR } from '../app/constants/constants';
import DeliveryComponent from '../app/components/delivery/delivery';
import Login from './login';


const Delivery = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [index, setIndex] = useState(1);


    useEffect(() => {




    }, [])


    const getView = () => {
        switch (index) {
            case 0:

                return (
                    <Login
                        changeIndex={(index: number) => {
                            setIndex(index);

                        }}
                        isDeliveryService={true}
                    />
                );

            case 1:
                return (
                    <DeliveryComponent changeIndex={(index: number) => {
                        setIndex(index);

                    }} />
                );

            default:
                break;
        }

    }

    return (
        <div>


            {getView()}


        </div>
    );
};

export default Delivery;
