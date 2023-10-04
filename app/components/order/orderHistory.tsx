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
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF, ORDER_DELIVERED } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { IOrder } from '../../types/orderTypes';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { searchStringInArray } from '../../utils/arrayM';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useAuthIds } from '../authHook';
import ReactPaginate from 'react-paginate';


const OrderHistory = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [ordersSto, setOrdersSto] = useState<IOrder[]>([]);
    const [search, setSearch] = useState("");
    const [labels, setLabels] = useState<string[]>(['ADDED DATE', 'ORDER NO', 'CUSTOMER NAME', 'DELIVERY METHOD', 'TOTAL PAID']);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;




        getOrders();
    }, []);




    const getOrders = () => {

        getDataFromDBTwo(ORDER_COLLECTION, AMDIN_FIELD, adminId, "statusCode", ORDER_DELIVERED).then((v) => {

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
                        customerEmail: d.email,
                        customerPhone: d.phone,
                        customerAddress: d.customerAddress,
                        deliveryLocation: d.deliveryLocation,
                        deliveryDate: d.deliveryDate,
                        deliveryTime: d.deliveryTime,
                        deliveryDateString: d.deliveryDateString,
                        deliverer: d.deliverer,
                        deliveredSignature: d.deliveredSignature
                    }]);
                    setOrdersSto(orders => [...orders, {
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
                        customerEmail: d.email,
                        customerPhone: d.phone,
                        customerAddress: d.customerAddress,
                        deliveryLocation: d.deliveryLocation,
                        deliveryDate: d.deliveryDate,
                        deliveryTime: d.deliveryTime,
                        deliveryDateString: d.deliveryDateString,
                        deliverer: d.deliverer,
                        deliveredSignature: d.deliveredSignature
                    }]);

                });

                var numOfPages = Math.floor(v.count / 10);
                if (v.count % 10 > 0) {
                    numOfPages++;
                }
                setPages(numOfPages);
                setCount(v.count);



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }


    const handlePageClick = (event: { selected: number; }) => {
        let val = event.selected + 1;
        if (count / 10 + 1 === val) {
            setStart(count - (count % 10));
            setEnd(count);
        } else {
            setStart(Math.ceil((val * 10) - 10));
            setEnd(val * 10);
        }
    };

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
                                    orders.slice(start, end).map((value, index) => {
                                        return (
                                            <tr key={index}

                                                className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                <td className='text-left' >{value.dateString}</td>
                                                <td className='text-left' >{value.orderNo}</td>
                                                <td className='text-left' >{value.customerName}</td>
                                                <td className='text-left col-span-3' >{value.deliveryMethod}</td>
                                                <td className='text-left' >{value.totalCost}</td>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div>
                            {orders.length > 0 ? <div className='flex w-full'>
                                <ReactPaginate
                                    pageClassName="border-2 border-[#8b0e06] px-2 py-1 rounded-full"
                                    previousLinkClassName="border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold"
                                    nextLinkClassName="border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold"
                                    breakLabel="..."
                                    breakClassName=""
                                    containerClassName="flex flex-row space-x-4 content-center items-center "
                                    activeClassName="bg-[#8b0e06] text-white"
                                    nextLabel="next"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={1}
                                    pageCount={pages}
                                    previousLabel="previous"
                                    renderOnZeroPageCount={() => null}
                                />
                            </div> : <p></p>}
                        </div>
                    </div>
                )}
            </div>


            <ToastContainer position="top-right" autoClose={5000} />
        </div >
    );
};

export default OrderHistory;
