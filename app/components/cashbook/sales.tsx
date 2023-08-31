import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';

const Sales = () => {
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
    const router = useRouter()


    useEffect(() => {




    }, [])




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 ">


                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default Sales;
