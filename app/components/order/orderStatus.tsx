import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMenuItem } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, getDataFromDBTwo, updateDocument, uploadFile } from '../../api/mainApi';
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF, ORDER_DELIVERED, ORDER_IN_PREP, ORDER_READY, ORDER_SHIPPED } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { IOrder } from '../../types/orderTypes';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getOrdersStatus } from '../../api/orderApi';
import { searchStringInArray } from '../../utils/arrayM';
import { useAuthIds } from '../authHook';



const OrderStatus = (props: { level: number }) => {
    const { level } = props;
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [ordersSto, setOrdersSto] = useState<IOrder[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        getOrders();
    }, []);




    const getOrders = () => {

        let fieldTwo = "Sent"
        if (level == 1) {
            fieldTwo = "In Prep"
        } else if (level == 2) {
            fieldTwo = "Ready"
        }


        getDataFromDBTwo(ORDER_COLLECTION, AMDIN_FIELD, adminId, "statusCode", fieldTwo).then((v) => {

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
                        totalCost: d.totalCost,
                        deliveryLocation: d.deliveryLocation,
                        customerAddress: d.customerAddress,
                        customerEmail: d.customerEmail,
                        customerPhone: d.customerPhone,
                        deliveredSignature: d.deliveredSignature,
                        deliverer: d.deliverer,
                        deliveryDate: d.deliveryDate,
                        deliveryDateString: d.deliveryDateString,
                        deliveryTime: d.deliveryTime
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





    const updateOrder = (v: any) => {
        setLoading(true);

        let updateStatus = ORDER_IN_PREP;
        let status = 50;
        if (level == 1) {
            updateStatus = ORDER_READY;
            status = 96;
        } else if (level == 2) {
            if (v.deliveryMethod == 'Delivery') {
                updateStatus = ORDER_SHIPPED;
                status = 99;
            } else {
                updateStatus = ORDER_DELIVERED;
                status = 100;
            }
        }

        let order = {
            status: status,
            statusCode: updateStatus
        }
        setOrders([]);
        updateDocument(ORDER_COLLECTION, v.id, order).then((v) => {
            toast.success('Order Successfully updated');
            getOrders();
        }).catch((e: any) => {
            getOrders();
            console.error(e);
            toast.error('There was an error please try again');
        });
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

    const getButtonText = (v: IOrder) => {
        switch (level) {
            case 0:

                return 'Move Order In Prep';
            case 1:
                return 'Order Ready';
            case 2:
                if (v.deliveryMethod == 'Delivery') {
                    return 'Order Shipped'
                } else {
                    return 'Order Served'
                }

            default:
                return 'Move Order In Prep';
        }
    }


    return (
        <div>
            <div className="bg-white rounded-[30px] p-4 ">
                {loading ? (
                    <div className="w-full flex flex-col items-center content-center">
                        <Loader color={''} />
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
                                        <div className='flex flex-row-reverse'>
                                            <button onClick={() => { deleteItem(v.id) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h1 className='font-bold text-xl text-[#8b0e06]'>Order No: {v.orderNo}</h1>
                                        <h1 className='font-bold text-sm'>Due: {v.totalCost.toFixed(2)}USD</h1>
                                        <h1 className='font-bold text-sm'>{v.customerName}</h1>

                                        <div className='w-25 h-25 my-2'>
                                            <CircularProgressbar value={v.status} text={`${v.status}%`}
                                                styles={buildStyles({
                                                    // Rotation of path and trail, in number of turns (0-1)
                                                    rotation: 0,
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: 'round',
                                                    // Text size
                                                    textSize: '11px',
                                                    // How long animation takes to go from one percentage to another, in seconds
                                                    pathTransitionDuration: 0.5,
                                                    // Can specify path transition in more detail, or remove it entirely
                                                    // pathTransition: 'none',
                                                    // Colors
                                                    pathColor: `#8b0e06`,
                                                    textColor: '#f88',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#8b0e06',
                                                })} />
                                        </div>
                                        <button
                                            onClick={() => {
                                                updateOrder(v)
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
                                                text-xs 
                                                text-white
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition
                                            "
                                        >

                                            {getButtonText(v)}
                                        </button>
                                        <Disclosure>
                                            <Disclosure.Button className={' underline text-xs'}>
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

export default OrderStatus;
