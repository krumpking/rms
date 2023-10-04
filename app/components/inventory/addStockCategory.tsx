import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { addDocument, deleteDocument, getDataFromDBOne } from '../../api/mainApi';
import { Dialog, Transition } from '@headlessui/react';

import { STOCK_CATEGORY_REF } from '../../constants/stockConstants';
import { IStockCategory, IStockItem } from '../../types/stockTypes';
import AppAccess from '../accessLevel';
import { useAuthIds } from '../authHook';

const AddStockCategory = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
    const [categories, setCategories] = useState<IStockCategory[]>([]);;
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;



        getCategories();
    }, []);


    const getCategories = () => {
        getDataFromDBOne(STOCK_CATEGORY_REF, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();
                    setCategories(categories => [...categories, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString
                    }]);
                });


            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }


    const addCategory = async () => {

        setLoading(true);

        let category: IStockCategory = {
            id: 'id',
            adminId: adminId,
            category: title,
            date: new Date(),
            dateString: new Date().toDateString(),
            userId: userId
        }
        setCategories([]);

        addDocument(STOCK_CATEGORY_REF, category).then((v) => {
            setLoading(false);

            getCategories();
        }).catch((e: any) => {

            getCategories();
            setLoading(false);
            console.error(e);
            toast.error('There was an error please try again');
        });




    }



    const deleteItem = (id: string) => {
        var result = confirm("Are you sure you want to delete?");
        if (result) {
            setCategories([]);
            setLoading(true);

            deleteDocument(STOCK_CATEGORY_REF, id).then(() => {
                getCategories();
            }).catch((e: any) => {
                console.error(e);
                setLoading(false);
            });
        }

    }




    return (
        <AppAccess access={access} component={'add-stock'}>
            <div>
                <div className="bg-white rounded-[30px] p-4">
                    {loading ? (
                        <div className="w-full flex flex-col items-center content-center">
                            <Loader color={''} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-5 overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
                            <div className='flex shadow-xl rounded-[25px] p-8 w-[250px]  items-center justify-center' onClick={() => { setOpen(true) }}>
                                <div className='flex flex-col items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="w-16 h-16">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Category
                                </div>
                            </div>
                            {categories.map((v) => {
                                return (
                                    <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                                        <div className='flex flex-row-reverse'>
                                            <button onClick={() => { deleteItem(v.id) }}>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>


                                            </button>
                                        </div>

                                        <h1 className='font-bold text-2xl'>{v.category}</h1>
                                    </div>
                                )
                            })}


                        </div>
                    )}
                </div>

                <Transition appear show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={() => setOpen(false)}
                    >
                        <div className="min-h-screen px-4 text-center backdrop-blur-sm ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0" />
                            </Transition.Child>

                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="bg-white my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                                    <Dialog.Title
                                        as="h3"
                                        className="text-sm font-medium leading-6 text-gray-900 m-4">
                                        Adding Category Item
                                    </Dialog.Title>
                                    <div className="flex flex-col items-center space-y-2 w-full">

                                        <div className="mb-6 w-full">
                                            <input
                                                type="text"
                                                value={title}
                                                placeholder={'Title'}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
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
                                                required
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                addCategory();
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
                                            Add Category
                                        </button>
                                    </div>


                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </AppAccess>

    );
};

export default AddStockCategory;

