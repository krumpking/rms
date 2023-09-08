import React, { useEffect, useState } from 'react'
import { COOKIE_ID, LIGHT_GRAY, TEMPLATES } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import { getCookie } from 'react-use-cookie';
import Payment from '../app/utils/paymentUtil';
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
import AppAccess from '../app/components/accessLevel';


const Staff = () => {
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


    ])
    const [accessArray, setAccessArray] = useState<any[]>([
        'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
        'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
        'staff-scheduling', 'staff-timesheets', 'website', 'payments', 'stock-overview', 'receipting',]);



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;







    }, []);

    const checkPayment = async () => {
        const paymentDate = await Payment.getPaymentDate();
        setpaymentD(paymentDate);


        const paymentStatus = await Payment.checkPaymentStatus();

        if (!paymentStatus) {
            toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

            setTimeout(() => {
                router.push({
                    pathname: '/payments',
                });
            }, 5000);

        }


    }

    const updDateTasks = (tasks: ITask[]) => {

        tasks.forEach((element) => {
            print(element.docId);
            updateTask(element.docId, addDays(new Date(), element.reminder).toDateString());
        });

    }







    return (


        < div >

            <div className='flex flex-col lg:grid lg:grid-cols-12 '>

                <div className='lg:col-span-3' id="nav">
                    <ClientNav organisationName={'FoodiesBooth'} url={'staff'} />
                </div>


                {loading ?
                    <div className='flex flex-col justify-center items-center w-full col-span-9'>
                        <Loader />
                    </div>

                    :
                    <div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8'>


                    </div>}




            </div>



            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >



    )
};


export default Staff
