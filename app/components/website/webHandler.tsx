import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { getDataFromDBTwo } from '../../api/mainApi';
import { WEBSITE_COLLECTION } from '../../constants/websiteConstants';
import { AMDIN_FIELD } from '../../constants/constants';

interface MyProps {
    business: string,
}


const WebsiteHandler: FC<MyProps> = ({ business }) => {
    const [surname, setSurname] = useState('');
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [bank, setBank] = useState('');
    const router = useRouter();
    const [adminId, setAdminId] = useState("adminId");


    useEffect(() => {





    }, []);

    const getWebsiteInfo = () => {
        getDataFromDBTwo(WEBSITE_COLLECTION, AMDIN_FIELD, adminId, "websiteName", business).then((v) => {

        }).catch((e) => {
            console.error(e);
        });
    }




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 ">
                    <p>Hello Website Handler for {business}</p>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default WebsiteHandler;
