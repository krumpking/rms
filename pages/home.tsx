import React, { useEffect, useState } from 'react'
import { AMDIN_FIELD, LIGHT_GRAY } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import { getCookie } from 'react-use-cookie';
import { checkPaymentStatus } from '../app/utils/paymentUtil';
import { decrypt, encrypt } from '../app/utils/crypto';
import Link from 'next/link';
import { getForms } from '../app/api/formApi';
import { IForm } from '../app/types/formTypes';
import { getAllTasksToDB, getAllTasksToday, updateTask } from '../app/api/crmApi';
import { ITask } from '../app/types/taskTypes';
import TaskSummary from '../app/components/taskSummary';
import { addDays } from 'date-fns';
import { print } from '../app/utils/console';
import Joyride from 'react-joyride';
import Script from 'next/script';
import { useAuthIds } from '../app/components/authHook';
import { getDataFromDBOne, getOneDocument } from '../app/api/mainApi';
import { ORDER_COLLECTION } from '../app/constants/orderConstants';
import { IMeal } from '../app/types/menuTypes';
import { getOrdersStatus } from '../app/api/orderApi';
import { IOrder } from '../app/types/orderTypes';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Disclosure } from '@headlessui/react';
import { STOCK_ITEM_COLLECTION } from '../app/constants/stockConstants';
import { IStockItem } from '../app/types/stockTypes';
import { ITransaction } from '../app/types/cashbookTypes';
import { CASHBOOOK_COLLECTION } from '../app/constants/cashBookConstants';
import { RESERVATION_COLLECTION } from '../app/constants/reservationConstants';
import { IReservation } from '../app/types/reservationTypes';


const Home = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [previousForms, setPreviousForms] = useState<IForm[]>([]);
    const [numberOfForms, setNumberOfForms] = useState(0);
    const [numberOfDevices, setNumberOfDevices] = useState<any>([]);
    const [diskSpaceUsed, setDiskSpaceUsed] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [paymentD, setpaymentD] = useState<Date>(new Date());
    const [steps, setSteps] = useState<any[]>(
        [
            {
                target: '#tutorials',
                content: 'Click on any of these to see a video tutorial on the various possibilities of Digital Data Tree',
            },
            {
                target: '#tasks_highlights',
                content: 'When you created Tasks, they show up here, to remind you to of an any action as it pertains to your CRM(Customer Relationship Management)',
            },
            {
                target: '#custom_reports',
                content: 'This shows all the custom reports you would have created to capture any information through our mobile application',
            },
            {
                target: "#form_templates",
                content: 'This shows an example of the different kind of custom reports you can create for your team to capture',
            },

            {
                target: '#nav',
                content: 'This is the navigation panel, to be able to use other features on the app, click on them to go through to them'
            },
            {
                target: "#payments",
                content: 'This shows you,when your next payment is due',
            },
        ]);
    const [tutorialVids, settutorialVids] = useState([
        {
            title: 'Add organization information on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'hYjzHBrUmxk',
        },
        {
            title: 'How to generate a Quotation on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'uNjtbj12MBI',
        },
        {
            title: 'How to generate an Invoice on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'BycELuE3GJs',
        },
        {
            title: 'How to Create a form',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'GCJqe8Rdymk',
        },
        {
            title: 'How to add a client on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'BUd57WkUQ1c',
        },
        {
            title: 'How to see Client information, update stage, add notes on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'F3C4fIPxOfE',
        },
        {
            title: 'How to search for clients on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: '7FIUetzu9T0',
        },
        {
            title: 'How to sort Clients by Date on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'aezxv_OE6aY',
        },
        {
            title: 'How to add a task on Digital Data Tree',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'LnathUtkUYI',
        },
        {
            title: 'How to see automated reports on client engagement and growth',
            description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
            id: 'AVTPs8nGUeg',
        },


    ]);
    // const { adminId, userId, access } = useAuthIds();
    const [adminId, setAdminId] = useState("adminId");
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [stockItems, setStockItems] = useState<IStockItem[]>([]);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [totalUSD, setTotalUSD] = useState(0);
    const [totalZWL, setTotalZWL] = useState(0);
    const [totalRecUSD, setTotalRecUSD] = useState(0);
    const [totalRecZWL, setTotalRecZWL] = useState(0);
    const [totalSpentUSD, setTotalSpentUSD] = useState(0);
    const [totalSpentZWL, setTotalSpentZWL] = useState(0);
    const [reservations, setReservations] = useState<IReservation[]>([]);

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        // checkPayment();





        getStockItems();
        getOrders();
        getTransactions();
        getReservations();

    }, []);


    const getOrders = () => {
        let adminId = "adminId";
        getOrdersStatus(ORDER_COLLECTION, AMDIN_FIELD, adminId).then((v) => {
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
                        deliveryLocation: null,
                        customerAddress: "",
                        customerEmail: "",
                        customerPhone: ""
                    }]);

                });

            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }



    const getStockItems = () => {




        getDataFromDBOne(STOCK_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();
                    setStockItems(stockItems => [...stockItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        transactionType: d.transactionType,
                        category: d.category,
                        title: d.title,
                        details: d.details,
                        itemNumber: d.itemNumber,
                        date: d.date,
                        dateString: d.dateString,
                        dateOfUpdate: d.dateOdUpdate,
                        status: d.status,
                        confirmed: d.confirmed
                    }]);

                });



            }

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }

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
                    setTotalUSD(tUSD);
                    setTotalZWL(tZWL);
                    setTotalRecUSD(tRUSD);
                    setTotalRecZWL(tRZWL);
                    setTotalSpentUSD(tSUSD);
                    setTotalSpentZWL(tSZWL);

                });


            }
        }).catch((e: any) => {
            console.error(e);
            toast.error('There was an error getting transactions');
        })
    }

    const getReservations = () => {
        print('Hello');
        getDataFromDBOne(RESERVATION_COLLECTION, AMDIN_FIELD, '')
            .then((v) => {
                print(v);
                if (v !== null) {
                    v.data.forEach((element) => {
                        let d = element.data();
                        setReservations(prevRes => [...prevRes, {
                            id: element.id,
                            adminId: d.adminId,
                            userId: d.userId,
                            name: d.name,
                            phoneNumber: d.phoneNumber,
                            email: d.email,
                            date: new Date(),
                            time: d.time,
                            peopleNumber: d.peopleNumber,
                            notes: d.notes,
                            category: d.category,
                            dateAdded: new Date(),
                            dateOfUpdate: new Date(),
                            dateAddedString: new Date().toDateString(),
                        }]);



                    });

                }
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
            });
    };


    const checkPayment = async () => {

        const paymentStatus = await checkPaymentStatus();

        if (!paymentStatus) {
            toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

            setTimeout(() => {
                router.push({
                    pathname: '/payments',
                });
            }, 5000);

        }


    }


    const getItems = (status: string) => {
        return stockItems.filter((item) => item.status === status).length;
    }









    return (
        <>
            {/* <Joyride
                steps={steps}
                showProgress={true}
                continuous={true}
                styles={{
                    options: {
                        primaryColor: "#00947a"
                    }
                }}
            /> */}
            <div>

                <div className='flex flex-col '>

                    <div className='lg:col-span-3' id="nav">
                        <ClientNav organisationName={'Vision Is Primary'} url={'home'} />
                    </div>


                    {loading ?
                        <div className='flex flex-col justify-center items-center w-full col-span-9'>
                            <Loader color={''} />
                        </div>

                        :
                        <div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8 '>
                            <div className='mt-5'>
                                Transaction Overview
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
                            <div className='mt-5'>
                                Stock Overview
                            </div>
                            <div className='grid grid-cols-4 shadow-lg p-8 rounded-[25px]'>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-2xl'>{stockItems.length}</h1>
                                    <h1>Stock Items</h1>
                                </div>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-md'>{getItems('Served')}</h1>
                                    <h1>Items Served</h1>
                                </div>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-md'>{getItems('Kitchen')}</h1>
                                    <h1>Items in the Kitchen</h1>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h1 className='text-md'>{getItems('Pantry')}</h1>
                                    <h1>Items in the Pantry</h1>
                                </div>

                            </div>
                            <div className='mt-5'>
                                Recent Orders
                            </div>
                            <div className='w-full overflow-x-auto flex flex-row space-x-4 p-4 '>
                                {orders.slice(0, 4).map((v) => {
                                    return (
                                        <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                                            <h1 className='font-bold text-xl text-[#8b0e06]'>Order No: {v.orderNo}</h1>
                                            <h1 className='font-bold text-sm'>Due: {v.totalCost}USD</h1>
                                            <h1 className='font-bold text-sm'>{v.customerName}</h1>
                                            <div className='flex flex-row justify-between space-x-2'>
                                                <div className='w-25 h-25'>
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

                                            </div>
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
                            <div className='mt-5'>
                                Recent Reservations
                            </div>
                            <div className='w-full overflow-x-auto flex flex-row space-x-4 p-4 '>
                                {reservations.map((v) => (
                                    <div              >
                                        <div className="flex flex-col shadow-xl rounded-[25px] p-8 w-full ">
                                            <h1 className='font-bold text-xl text-[#8b0e06]'>Reservation Name: {v.name}</h1>
                                            <h1 className='font-bold text-sm'>Date: {v.dateAddedString}</h1>
                                            <h1 className='font-bold text-sm'>Time: {v.dateAddedString}</h1>
                                            <h1 className='font-bold text-sm'>Number of people: {v.peopleNumber}</h1>
                                            <h1 className='font-bold text-sm'>{v.category}</h1>
                                            <Disclosure>
                                                <Disclosure.Button className={'-ml-16 underline text-xs'}>
                                                    See Order Details
                                                </Disclosure.Button>
                                                <Disclosure.Panel>
                                                    <div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
                                                        <p className='text-xs'>{v.notes}</p>
                                                    </div>
                                                </Disclosure.Panel>
                                            </Disclosure>

                                        </div>
                                    </div>
                                ))}
                            </div>




                        </div>}




                </div>



                <ToastContainer
                    position="top-right"
                    autoClose={5000} />
            </div>
        </>


    )
};


export default Home
