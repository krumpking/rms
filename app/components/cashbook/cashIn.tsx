import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { AMDIN_FIELD, CURRENCIES } from '../../constants/constants';
import { addDocument, getDataFromDBOne, getDataFromDBTwo } from '../../api/mainApi';
import { CASHBOOOK_COLLECTION } from '../../constants/cashBookConstants';
import { ITransaction } from '../../types/cashbookTypes';
import { Disclosure } from '@headlessui/react';
import { print } from '../../utils/console';
import AppAccess from '../accessLevel';

const Sales = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [amount, setAmount] = useState(0);
    const [details, setDetails] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [source, setSource] = useState("");
    const [categories, setCategories] = useState<string[]>(['cash', 'online', 'debit card', 'credit card', 'cheque']);
    const [category, setCategory] = useState("");
    const [adminId, setAdminId] = useState("adminId");
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [accessArray, setAccessArray] = useState<any[]>([
        'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
        'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
        'staff-scheduling', 'website', 'payments']);


    useEffect(() => {


        getIncome();

    }, [])


    const getIncome = () => {
        getDataFromDBTwo(CASHBOOOK_COLLECTION, AMDIN_FIELD, adminId, 'transactionType', 'Cash In').then((v) => {
            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    print(d);

                    setTransactions(transactions => [...transactions, {
                        id: d.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        transactionType: d.transactionType,
                        paymentMode: d.paymentMode,
                        title: d.title,
                        details: d.details,
                        amount: d.amount,
                        customer: d.customer,
                        date: d.date,
                        dateString: d.dateString,
                        file: d.file,
                        currency: d.currency
                    }]);

                });


                setLoading(false);
            }


        }).catch((e) => {
            console.error(e);
            toast.error('There was an error, kindly try again');
            setLoading(false);
        });
    }

    const addCash = () => {
        setLoading(true);
        let transaction: ITransaction = {
            id: "id",
            adminId: adminId,
            userId: "userId",
            transactionType: "Cash In",
            currency: currency,
            paymentMode: category,
            title: source,
            details: details,
            amount: amount,
            customer: source,
            date: new Date(),
            dateString: new Date().toDateString(),
            file: null
        }


        setTransactions([]);
        addDocument(CASHBOOOK_COLLECTION, transaction).then((r) => {
            toast.success('Transaction Added');
            getIncome();
        }).catch((e) => {

            toast.error('There was an error adding transaction, please try again');
            console.error(e);
        });
    }


    return (
        <AppAccess access={accessArray} component={'cash-in'}>
            <div>
                {loading ? (
                    <div className="flex flex-col items-center content-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="bg-white rounded-[30px] p-4  grid grid-cols-2 gap-4">
                        <div className='flex flex-col'>
                            <div className='mb-6'>
                                <p>Amount</p>
                                <input
                                    type="text"
                                    value={amount}
                                    placeholder={"amount"}
                                    onChange={(e) => {
                                        setAmount(parseInt(e.target.value));
                                    }}
                                    className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                />
                            </div>
                            <div className='mb-6'>
                                <p>Source</p>
                                <input
                                    type="text"
                                    value={source}
                                    placeholder={"Source"}
                                    onChange={(e) => {
                                        setSource(e.target.value);
                                    }}
                                    className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                />
                            </div>
                            <div className='mb-6'>
                                <p>Details</p>
                                <textarea
                                    // type="text"
                                    value={details}
                                    placeholder={"Details"}
                                    onChange={(e) => {
                                        setDetails(e.target.value);
                                    }}
                                    className="
                                 w-full
                                 rounded-[25px]
                                 border-2
                                 border-[#8b0e06]
                                 py-3
                                 px-5
                                 h-32
                                 bg-white
                                 text-base text-body-color
                                 placeholder-[#ACB6BE]
                                 outline-none
                                 focus-visible:shadow-none
                                 focus:border-primary
                                 "
                                />
                            </div>
                            <button className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full mb-6'
                                onClick={(e) => e.preventDefault()}>
                                <select value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                    }}
                                    className='bg-white w-full'
                                    data-required="1"
                                    required>
                                    <option value="Chapter" hidden>
                                        Payment Method
                                    </option>
                                    {categories.map(v => (
                                        <option value={v} >
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </button>
                            <button className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full mb-6'
                                onClick={(e) => e.preventDefault()}>
                                <select value={currency}
                                    onChange={(e) => {
                                        setCurrency(e.target.value);
                                    }}
                                    className='bg-white w-full'
                                    data-required="1"
                                    required>
                                    <option value="Chapter" hidden>
                                        Payment Method
                                    </option>
                                    {CURRENCIES.map(v => (
                                        <option value={v} >
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </button>
                            <div className='col-span-2'>
                                <button
                                    onClick={() => {
                                        addCash()
                                    }}
                                    className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        border-primary
                                        py-3
                                        px-10
                                        bg-[#8b0e06]
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    "
                                >
                                    Add Cash
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col max-h-[400px] overflow-y-scroll'>

                            {transactions.map((v) => {
                                return (
                                    <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-full '>
                                        <h1 className='font-bold text-xl text-[#8b0e06]'>Title: {v.title}</h1>
                                        <h1 className='font-bold text-sm'>Amount: {v.amount}{v.currency}</h1>
                                        <h1 className='font-bold text-xs text-gray-400'>{v.dateString}</h1>
                                        <Disclosure>
                                            <Disclosure.Button className={'-ml-16 underline text-xs'}>
                                                See Details
                                            </Disclosure.Button>
                                            <Disclosure.Panel>

                                                <div className='flex flex-col shadow-xl p-4 rounded-[25px]'>

                                                    <p className='text-xs'>{v.details}</p>
                                                    <p className='text-xs'>{v.paymentMode}</p>

                                                </div>

                                            </Disclosure.Panel>
                                        </Disclosure>

                                    </div>
                                )
                            })}

                        </div>



                    </div>
                )}
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </AppAccess>

    );
};

export default Sales;
