import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { getDataFromDBOne, getDataFromDBTwo, updateDocument } from '../../api/mainApi';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { IOrder } from '../../types/orderTypes';
import { AMDIN_FIELD, PRIMARY_COLOR } from '../../constants/constants';
import { searchStringInArray } from '../../utils/arrayM';
import ReactPaginate from 'react-paginate';
import { Dialog, Transition } from '@headlessui/react';
import MapPicker from 'react-google-map-picker';
import { DEFAULT_LOCATION, DEFAULT_ZOOM, MAP_API } from '../../constants/websiteConstants';
import SignatureCanvas from 'react-signature-canvas'
import { print } from '../../utils/console';





const DeliveryComponent = (props: { changeIndex: (index: number) => void }) => {
    const { changeIndex } = props;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [ordersSto, setOrdersSto] = useState<IOrder[]>([]);
    const [search, setSearch] = useState("");
    const [adminId, setAdminId] = useState("adminId");
    const [labels, setLabels] = useState<string[]>(['ORDER NO', 'DELIVERY DATE', 'DELIVERY TIME', 'CUSTOMER NAME', 'CUSTOMER ADDRESS', 'TOTAL DUE', 'STATUS']);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [pages, setPages] = useState(0);
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState<IOrder>({
        id: "",
        adminId: "d.adminId",
        clientId: "d.clientId",
        deliveryMethod: "d.deliveryMethod",
        orderNo: 0,
        items: [],
        status: 0,
        statusCode: "d.statusCode",
        userId: "d.userId",
        customerName: "d.customerName",
        tableNo: "d.tableNO",
        date: new Date(),
        dateString: new Date().toDateString(),
        totalCost: 23,
        customerEmail: "d.email",
        customerPhone: " d.phone",
        customerAddress: "d.customerAddress",
        deliveryLocation: null,
        deliveryDate: new Date(),
        deliveryTime: "d.deliveryTime",
        deliveryDateString: new Date().toDateString(),
        deliverer: "d.deliverer",
        deliveredSignature: null
    });
    const [signatureDone, setSignatureDone] = useState(false);
    const sigCanvas = useRef<any>({});
    const [imageURL, setImageURL] = useState(null);




    useEffect(() => {


        getOrders();

    }, [])

    const getOrders = () => {

        getDataFromDBOne(ORDER_COLLECTION, "deliveryMethod", "Delivery").then((v) => {

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




    const clear = () => sigCanvas.current.clear();

    const save = () => {
        let signNature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        setOrder({
            ...order,
            deliveredSignature: signNature
        })
    }

    const updateOrder = () => {
        let newOrder = {
            ...order,
            status: 100,
            statusCode: 'Delivered',
            deliverer: adminId
        }
        print(newOrder);
        updateDocument(ORDER_COLLECTION, order.id, newOrder).then((v) => {
            if (v !== null) {
                toast.success('Order Updated');
                setOpen(false);
            }
        }).catch((e) => {
            console.error(e);
            toast.error('There was ');
            setOpen(false);
        })
    }


    return (
        <div className=' w-full h-screen p-4 md:p-8 2xl:p-16 ' style={{ backgroundColor: PRIMARY_COLOR }}>
            {loading ?
                <div className="flex flex-col items-center content-center">
                    <Loader color={''} />
                </div>
                :
                <div className="bg-white rounded-[30px] p-4 ">
                    <div className="flex flex-col  overflow-y-scroll  w-full p-4">
                        <div className='h-16'>
                            <button
                                onClick={() => {
                                    changeIndex(0);
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                </svg>

                            </button>
                        </div>

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
                        <div className='w-full'>
                            <table className='w-full'>
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
                                                    onClick={() => { setOrder(value); setOpen(true); }}
                                                    className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                    <td className='text-left' >{value.orderNo}</td>
                                                    <td className='text-left' >{value.deliveryDateString}</td>
                                                    <td className='text-left' >{value.deliveryTime}</td>
                                                    <td className='text-left' >{value.customerName}</td>
                                                    <td className='text-left col-span-3' >{value.customerAddress}</td>
                                                    <td className='text-left' >{value.totalCost}</td>
                                                    <td className='text-left' >{value.statusCode}</td>


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
                                    <div className="bg-white my-8 inline-block w-full   transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl leading-6 text-gray-900 my-4"
                                        >

                                            Order Details: Order No {order.orderNo}
                                        </Dialog.Title>
                                        <div className="flex flex-col items-center space-y-2 w-full">
                                            <div className="w-full">
                                                <h1 className='text-2xl'>Total Amount Due: {order.totalCost}USD</h1>
                                                <h1>Customer Name: {order.customerName}</h1>
                                                <h1>Customer Phone: {order.customerPhone}</h1>
                                                <h1>Customer Address: {order.customerAddress}</h1>
                                                <h1>Customer Email: {order.customerEmail}</h1>
                                                <h1>Ordered Items</h1>
                                                <div className='rounded-[25px] grid grid-cols-5 m-4' style={{ border: PRIMARY_COLOR }}>
                                                    {order.items.map((r) => (
                                                        <div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
                                                            <h1 className='text-nd'>{r.title}</h1>
                                                            <p className='text-xs'>{r.description}</p>
                                                            <p className='text-xs'>{r.price}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <MapPicker
                                                    defaultLocation={order.deliveryLocation}
                                                    zoom={15}
                                                    // mapTypeId={createId()}
                                                    style={{ height: '400px', width: "100%" }}
                                                    apiKey={MAP_API} />
                                                <div className='flex flex-col border rounded-[25px] h-full w-full p-4'>
                                                    <SignatureCanvas
                                                        penColor="black"
                                                        ref={sigCanvas}
                                                        canvasProps={{

                                                            className: "h-72 w-full m-4"
                                                        }}
                                                    />
                                                    <div className='flex justify-between space-x-4'>
                                                        <button
                                                            onClick={() => {
                                                                clear();
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
                                                            Clear
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSignatureDone(true);
                                                                save();
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
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            <button
                                                onClick={() => {
                                                    updateOrder();
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
                                                Mark as Done
                                            </button>
                                        </div>

                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>

                </div>
            }
        </div>
    )
};

export default DeliveryComponent;
