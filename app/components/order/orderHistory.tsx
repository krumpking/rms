import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMenuItem } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, getDataFromDBTwo, updateDocument, uploadFile } from '../../api/mainApi';
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { IOrder } from '../../types/orderTypes';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { searchStringInArray } from '../../utils/arrayM';
import { ChevronRightIcon } from '@heroicons/react/20/solid'


const OrderHistory = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [adminId, setAdminId] = useState('adminId');
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [ordersSto, setOrdersSto] = useState<IOrder[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        var infoFromCookie = '';
        if (getCookie(ADMIN_ID) == '') {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        // setAdminId(decrypt(infoFromCookie, COOKIE_ID));


        getOrders();
    }, []);




    const getOrders = () => {

        getDataFromDBTwo(ORDER_COLLECTION, AMDIN_FIELD, adminId, "statusCode", "Delivered").then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    setOrders(orders => [...orders, {
                        id: element.id,
                        adminId: d.adminId,
                        clientId: d.clientId,
                        deliveryMethod: d.deliveryMethod,
                        orderNo: d.orderNo,
                        items: d.items,
                        status: d.status,
                        statusCode: d.statusCode,
                        userId: d.userId,
                        customerName: d.customerName,
                        tableNo: d.tableNO,
                        date: d.date,
                        dateString: d.dateString,
                        totalCost: d.totalCost
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }




    const deleteItem = (id: string) => {
        var result = confirm("Are you sure you want to delete?");
        if (result) {
            //Logic to delete the item
            setLoading(true);
            deleteDocument(ORDER_COLLECTION, id).then(() => {
                getOrders();
            }).catch((e: any) => {
                console.error(e);
            });
        }
    }




    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            searchFor();
        }
    };



    const searchFor = () => {
        setOrders([]);

        setLoading(true);
        if (search !== '') {

            let res: IOrder[] = searchStringInArray(ordersSto, search);

            if (res.length > 0) {
                setTimeout(() => {
                    setOrders(res);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setOrders(ordersSto);
                    setLoading(false);
                }, 1500);


            }


        } else {

            setTimeout(() => {
                setOrders(ordersSto);
                setLoading(false);
            }, 1500);

        }
    }






    return (
        <div>
            <div className="bg-white rounded-[30px] p-4 ">
                {loading ? (
                    <div className="w-full flex flex-col items-center content-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex flex-col  overflow-y-scroll  w-full p-4">
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
                        <div className='grid grid-cols-2 lg:grid-cols-5  gap-4 '>
                            {orders.map((v) => {
                                return (
                                    <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                                        <h1 className='font-bold text-xl text-[#8b0e06]'>Order No: {v.orderNo}</h1>
                                        <h1 className='font-bold text-sm'>Due: {v.totalCost}USD</h1>
                                        <h1 className='font-bold text-sm'>{v.customerName}</h1>
                                        <Disclosure>
                                            <Disclosure.Button className={'-ml-16 underline text-xs'}>
                                                See Order Details
                                            </Disclosure.Button>
                                            <Disclosure.Panel>
                                                {v.items.map((r) => (
                                                    <div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
                                                        <h1 className='text-nd'>{r.title}</h1>
                                                        <p className='text-xs'>{r.description}</p>

                                                    </div>
                                                ))}
                                            </Disclosure.Panel>
                                        </Disclosure>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>


            <ToastContainer position="top-right" autoClose={5000} />
        </div >
    );
};

export default OrderHistory;
