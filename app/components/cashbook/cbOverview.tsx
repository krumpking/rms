import React, { Fragment, useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { ITransaction } from '../../types/cashbookTypes';
import { getDataFromDBOne } from '../../api/mainApi';
import { CASHBOOOK_COLLECTION, CASHBOOOK_STORAGE_REF } from '../../constants/cashBookConstants';
import { ADMIN_ID, AMDIN_FIELD } from '../../constants/constants';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { searchStringInArray } from '../../utils/arrayM';
import DateMethods from '../../utils/date';
import { print } from '../../utils/console';
import ShowImage from '../showImage';
import OrderedItems from './orderedItems';

const CBOverview = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [labels, setLabels] = useState<string[]>(['TRANSACTION DATE', 'TITLE', 'PAYEE/FROM', 'PAYMENT MODE', 'AMOUNT', 'CURRENCY']);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [transactionsSto, setTransactionsSto] = useState<ITransaction[]>([]);
    const [transactionsStoOther, setTransactionsStoOther] = useState<ITransaction[]>([]);
    const [adminId, setAdminId] = useState("adminId");
    const [totalUSD, setTotalUSD] = useState(0);
    const [totalZWL, setTotalZWL] = useState(0);
    const [totalRecUSD, setTotalRecUSD] = useState(0);
    const [totalRecZWL, setTotalRecZWL] = useState(0);
    const [totalSpentUSD, setTotalSpentUSD] = useState(0);
    const [totalSpentZWL, setTotalSpentZWL] = useState(0);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTrans, setSelectedTrans] = useState<any>();
    const [cat, setCat] = useState(['All time', 'Today', 'This Week', 'This Month', 'This Quarter', 'This Year'])
    const [webfrontId, setWebfrontId] = useState("webfrontId");

    useEffect(() => {


        getTransactions();

    }, []);

    const getTransactions = () => {
        getDataFromDBOne(CASHBOOOK_COLLECTION, AMDIN_FIELD, adminId).then((v) => {
            if (v != null) {
                let tUSD = 0;
                let tZWL = 0;
                let tRUSD = 0;
                let tRZWL = 0;
                let tSUSD = 0;
                let tSZWL = 0;
                v.data.forEach((element) => {
                    let d = element.data();
                    if (d.currency === "USD") {
                        tUSD += d.amount;
                        if (d.transactionType === "Sale") {
                            tRUSD += d.amount;
                        } else {
                            tSUSD += d.amount;
                        }

                    } else {
                        tZWL = d.amount;
                        if (d.transactionType === "Sale") {
                            tRZWL += d.amount;
                        } else {
                            tSZWL += d.amount;
                        }
                    }

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
                    setTransactionsSto(transactions => [...transactions, {
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
                    setTransactionsStoOther(transactions => [...transactions, {
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
                    setTotalUSD(tUSD);
                    setTotalZWL(tZWL);
                    setTotalRecUSD(tRUSD);
                    setTotalRecZWL(tRZWL);
                    setTotalSpentUSD(tSUSD);
                    setTotalSpentZWL(tSZWL);

                })
            }
        }).catch((e: any) => {
            console.error(e);
            toast.error('There was an error getting transactions');
        })
    }

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            searchFor();
        }
    };



    const searchFor = () => {
        setTransactions([]);

        setLoading(true);
        if (search !== '') {
            let res: ITransaction[] = searchStringInArray(transactionsSto, search);
            if (res.length > 0) {
                setTimeout(() => {
                    setTransactions(res);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setTransactions(transactionsSto);
                    setLoading(false);
                }, 1500);
            }
        } else {
            setTimeout(() => {
                setTransactions(transactionsSto);
                setLoading(false);
            }, 1500);
        }
    }


    const getView = (v: ITransaction) => {

        return <p>Hi</p>

    }

    const filterResults = (v: string) => {

        setLoading(true);
        setTransactions([]);
        setTransactionsSto([]);
        switch (v) {
            case "All time":
                filterResultsByDate(100000000);
                break;
            case "Today":
                filterResultsByDate(2);
                break;
            case "This Week":
                filterResultsByDate(18);
                break;
            case "This Month":
                filterResultsByDate(31);
                break;
            case "This Quarter":
                filterResultsByDate(91);
                break;
            default:
                filterResultsByDate(100000000);
                break;
        }



    }

    const filterResultsByDate = (days: number) => {
        let tUSD = 0;
        let tZWL = 0;
        let tRUSD = 0;
        let tRZWL = 0;
        let tSUSD = 0;
        let tSZWL = 0;
        transactionsStoOther.forEach((element) => {

            if (DateMethods.diffDatesDays(element.dateString, new Date().toDateString()) < days) {
                setTransactions(transactions => [...transactions, element]);
                setTransactionsSto(transactions => [...transactions, element]);
                let d = element;
                if (d.currency === "USD") {
                    tUSD += d.amount;
                    if (d.transactionType === "Sale") {
                        tRUSD += d.amount;
                    } else {
                        tSUSD += d.amount;
                    }

                } else {
                    tZWL = d.amount;
                    if (d.transactionType === "Sale") {
                        tRZWL += d.amount;
                    } else {
                        tSZWL += d.amount;
                    }
                }
                setTotalUSD(tUSD);
                setTotalZWL(tZWL);
                setTotalRecUSD(tRUSD);
                setTotalRecZWL(tRZWL);
                setTotalSpentUSD(tSUSD);
                setTotalSpentZWL(tSZWL);

            }
        });

        setLoading(false);


    }




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 flex flex-col">
                    <div className='flex flex-row space-x-4 mb-6'>
                        {cat.map((v) => (
                            <button
                                onClick={() => {
                                    filterResults(v);
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
                                {v}
                            </button>
                        ))}
                    </div>
                    <div className='grid grid-cols-4 shadow-lg p-8 rounded-[25px]'>
                        <div className='flex flex-col items-center border-r-2'>
                            <h1 className='text-2xl'>{transactions.length}</h1>
                            <h1>Transactions</h1>
                        </div>
                        <div className='grid grid-cols-2 border-r-2'>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalUSD}</h1>
                                <h1>USD Transactions</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalZWL}</h1>
                                <h1>ZWL Transactions</h1>
                            </div>

                        </div>
                        <div className='grid grid-cols-2 border-r-2'>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalRecUSD}</h1>
                                <h1>USD Received</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalRecZWL}</h1>
                                <h1>ZWL Received</h1>
                            </div>


                        </div>
                        <div className='grid grid-cols-2'>

                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalSpentUSD}</h1>
                                <h1>USD Spent</h1>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-md'>{totalSpentZWL}</h1>
                                <h1>ZWL Spent</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        {open ?

                            <div className='flex flex-col items-center m-4 shadow-2xl rounded-md border-4 border-[#8b0e06] font-bold max-h-[700px] overflow-y-scroll'>
                                <button className='bg-[#8b0e06] text-center p-4 w-full'
                                    onClick={() => {
                                        setOpen(false);
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                    </svg>

                                </button>

                                {selectedTrans.file === null ? <p></p> : <ShowImage src={`/${webfrontId}/${CASHBOOOK_STORAGE_REF}/${selectedTrans.file.thumbnail}`} alt={'Payment File'} style={'w-full h-64'} />}
                                {selectedTrans.transactionType === "Sale" ? <OrderedItems id={selectedTrans.details} /> : <p>{selectedTrans.details}</p>}
                            </div>
                            : <div className="overflow-auto lg:overflow-visible h-screen shadow-lg p-8 rounded-[25px]">
                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        value={search}
                                        placeholder={"Search"}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
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

                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <table className="table  border-separate space-y-6 text-sm w-full">
                                    <thead className="bg-[#8b0e06] text-white font-bold0">
                                        <tr>
                                            {labels.map((v: any, index) => (
                                                <th key={v.label} className={`text-left`}>{v}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            transactions.map((value, index) => {
                                                return (
                                                    <tr key={index}
                                                        onClick={() => { setSelectedTrans(value); setOpen(true); }}
                                                        className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                        <td className='text-left' >{value.dateString}</td>
                                                        <td className='text-left' >{value.title}</td>
                                                        <td className='text-left' >{value.customer}</td>
                                                        <td className='text-left col-span-3' >{value.paymentMode}</td>
                                                        <td className='text-left' >{value.amount}</td>
                                                        <td className='text-left' >{value.currency}</td>


                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>}

                    </div>




                </div>
            )
            }
            <ToastContainer position="top-right" autoClose={5000} />
        </div >
    );
};

export default CBOverview;

