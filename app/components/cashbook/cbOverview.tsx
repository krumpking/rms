import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { ITransaction } from '../../types/cashbookTypes';
import { getDataFromDBOne } from '../../api/mainApi';
import { CASHBOOOK_COLLECTION } from '../../constants/cashBookConstants';
import { ADMIN_ID, AMDIN_FIELD } from '../../constants/constants';
import { Menu, Transition } from '@headlessui/react';

const CBOverview = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [labels, setLabels] = useState<string[]>(['TRANSACTION', 'TITLE', 'PAYEE/FROM', 'PAYMENT MODE', 'AMOUNT', 'CURRENCY']);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [adminId, setAdminId] = useState("adminId");
    const [total, setTotal] = useState(0);



    useEffect(() => {


        getTransactions();

    }, []);

    const getTransactions = () => {
        getDataFromDBOne(CASHBOOOK_COLLECTION, AMDIN_FIELD, adminId).then((v) => {
            if (v != null) {
                v.data.forEach((element) => {
                    let d = element.data();
                    let t = 0;
                    t += d.amount;
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
                    setTotal(t);
                })
            }
        }).catch((e: any) => {
            console.error(e);
            toast.error('There was an error getting transactions');
        })
    }




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 flex flex-col">
                    <div className='grid grid-cols-4 shadow-lg p-8 rounded-[25px]'>
                        <div className='flex flex-col'>
                            <h1 className='text-2xl'>{transactions.length}</h1>
                            <h1>Transactions</h1>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className='text-2xl'>{total}</h1>
                            <h1>Transactions</h1>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className='text-2xl'>{transactions.length}</h1>
                            <h1>Received</h1>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className='text-2xl'>{transactions.length}</h1>
                            <h1>Spent</h1>
                        </div>
                    </div>
                    <div>
                        <div className="overflow-auto lg:overflow-visible h-screen shadow-lg p-8 rounded-[25px]">
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
                                                    className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer '}
                                                    onClick={() => { }}>
                                                    <td className='text-left' >{value.dateString}</td>
                                                    <td className='text-left' >{value.title}</td>
                                                    <td className='text-left' >{value.customer}</td>
                                                    <td className='text-left col-span-3' >{value.paymentMode}</td>
                                                    <td className='text-left' >{value.amount}</td>
                                                    <td className='text-left' >{value.currency}</td>
                                                    <td className=" whitespace-nowrap text-right">
                                                        <Menu>
                                                            {({ open }) => (
                                                                <>
                                                                    <span className="rounded-md shadow-sm">
                                                                        <Menu.Button className="inline-flex justify-center text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 ">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                                            </svg>

                                                                        </Menu.Button>
                                                                    </span>

                                                                    <Transition
                                                                        show={open}
                                                                        enter="transition ease-out duration-100"
                                                                        enterFrom="transform opacity-0 scale-95"
                                                                        enterTo="transform opacity-100 scale-100"
                                                                        leave="transition ease-in duration-75"
                                                                        leaveFrom="transform opacity-100 scale-100"
                                                                        leaveTo="transform opacity-0 scale-95"
                                                                    >
                                                                        <Menu.Items
                                                                            static
                                                                            className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                                                                        >
                                                                            {/* <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') { setEdit(true); setEditMember(value); } }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div> */}
                                                                            <div className="py-1">

                                                                                <Menu.Item>
                                                                                    {({ active }) => (
                                                                                        <button
                                                                                            onClick={() => { }}
                                                                                            className={`${active
                                                                                                ? "bg-gray-100 text-gray-900"
                                                                                                : "text-gray-700"
                                                                                                } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                        >
                                                                                            Delete
                                                                                        </button>
                                                                                    )}
                                                                                </Menu.Item>
                                                                            </div>




                                                                        </Menu.Items>
                                                                    </Transition>
                                                                </>
                                                            )}
                                                        </Menu>




                                                    </td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default CBOverview;
