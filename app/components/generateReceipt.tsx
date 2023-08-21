import React, { useState } from 'react'
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import ReceiptForm from './quotation/receiptForm';




const GenerateReceipt = () => {
    const [loading, setLoading] = useState(false);





    return (
        <div>
            {loading ?
                <div className='flex flex-col items-center content-center'>
                    <Loader />
                </div>
                : <>
                    <ReceiptForm />
                </>}
            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default GenerateReceipt
