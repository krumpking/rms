import React, { useState } from 'react'
import { FC } from 'react';
import { createId } from '../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { addAClientToDB } from '../api/crmApi';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import QuotationForm from './quotation/quotationForm';




const GenerateQuotation = () => {
    const [loading, setLoading] = useState(false);





    return (
        <div>
            {loading ?
                <div className='flex flex-col items-center content-center'>
                    <Loader />
                </div>
                : <>
                    <QuotationForm />
                </>}
            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default GenerateQuotation
