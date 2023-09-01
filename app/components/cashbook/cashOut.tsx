import React, { useCallback, useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { AMDIN_FIELD, CURRENCIES } from '../../constants/constants';
import { addDocument, getDataFromDBOne, getDataFromDBTwo, uploadFile } from '../../api/mainApi';
import { CASHBOOOK_COLLECTION, CASHBOOOK_STORAGE_REF } from '../../constants/cashBookConstants';
import { ITransaction } from '../../types/cashbookTypes';
import { Disclosure } from '@headlessui/react';
import { print } from '../../utils/console';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import ShowImage from '../showImage';

const Expenses = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [amount, setAmount] = useState(0);
    const [details, setDetails] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [source, setSource] = useState("");
    const [categories, setCategories] = useState<string[]>(['cash', 'online', 'debit card', 'credit card', 'cheque']);
    const [category, setCategory] = useState("");
    const [adminId, setAdminId] = useState("adminId");
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [webfrontId, setWebfrontId] = useState("webfrontId");

    useEffect(() => {
        getExpenses();
    }, [])


    const getExpenses = () => {
        getDataFromDBTwo(CASHBOOOK_COLLECTION, AMDIN_FIELD, adminId, 'transactionType', 'Cash Out').then((v) => {
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

    const addCash = async () => {


        if (files.length > 0) {
            setLoading(true);
            const name = files[0].name;
            try {


                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }



                await uploadFile(`${webfrontId}/${CASHBOOOK_STORAGE_REF}/${name}`, files[0]);
                const info = name.split('_');



                const compressedFile = await imageCompression(files[0], options);

                // Thumbnail
                await uploadFile(`${webfrontId}/${CASHBOOOK_STORAGE_REF}/thumbnail_${name}`, compressedFile);
                let transaction: ITransaction = {
                    id: "id",
                    adminId: adminId,
                    userId: "userId",
                    transactionType: "Cash Out",
                    currency: currency,
                    paymentMode: category,
                    title: source,
                    details: details,
                    amount: amount,
                    customer: source,
                    date: new Date(),
                    dateString: new Date().toDateString(),
                    file: {
                        thumbnail: `thumbnail_${name}`,
                        original: name
                    }
                }


                setTransactions([]);
                addDocument(CASHBOOOK_COLLECTION, transaction).then((r) => {
                    toast.success('Transaction Added');
                    getExpenses();
                }).catch((e) => {

                    toast.error('There was an error adding transaction, please try again');
                    console.error(e);
                });
            } catch (e) {
                console.error(e);
            }
        } else {
            toast.error('Hmmm looks like you did not add the cash out receipt/invoice/signature picture.');
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {


        if (files.length > 0) {
            let currFiles = files;

            currFiles.concat(acceptedFiles);
            setFiles(currFiles);
        } else {
            setFiles(acceptedFiles);
        }




    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    return (
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
                            <p>Reason</p>
                            <input
                                type="text"
                                value={source}
                                placeholder={"Reason"}
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
                        <div className="flex flex-col border-dashed border-2 border-[#8b0e06] place-items-center p-4 mb-6" {...getRootProps()}>
                            <input className="hidden"

                                {...getInputProps()} />

                            <div className="mt-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                                    />
                                </svg>
                            </div>
                            <p>Drop Image here</p>
                            <p>or</p>
                            <p>Click here to select image</p>
                        </div>
                        {files.length > 0 ? <p className='bg-green-600 text-white w-full rounded-[25px] p-4'>{files.length} Image{files.length > 1 ? 's' : ''} Added</p> : <p></p>}
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
                                Cash Out
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
                                                <ShowImage src={`/${webfrontId}/${CASHBOOOK_STORAGE_REF}/${v.file.thumbnail}`} alt={'Payment File'} style={'w-full h-64'} />

                                            </div>

                                        </Disclosure.Panel>
                                    </Disclosure>

                                </div>
                            )
                        })}

                    </div>



                </div>
            )
            }
            <ToastContainer position="top-right" autoClose={5000} />
        </div >
    );
};

export default Expenses;
