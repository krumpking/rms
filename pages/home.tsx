import React, { useEffect, useState } from 'react'
import { COOKIE_ID, LIGHT_GRAY, TEMPLATES } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import ClientNav from '../app/components/clientNav';
import FormSummary from '../app/components/formSummary';
import DataSummary from '../app/components/dataSummary';
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


    ])



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;



        // setPreviousForms([
        //     {
        //         id: "element.id",
        //         title: " element.data().title",
        //         description: 'element.data().description',
        //         elements: [{
        //             id: "string",
        //             elementId: 5,
        //             label: "string",
        //             arg1: "any",
        //             arg2: "any",
        //             arg3: "any"
        //         }],
        //         dateCreated: "element.data().dateCreated",
        //         creatorId: "id",
        //         editorNumbers: [" element.data().editorNumbers"]
        //     }
        // ])

        // checkPayment()



        // var infoFormCookie = getCookie(COOKIE_ID);
        // if (typeof infoFormCookie !== 'undefined') {


        //     if (infoFormCookie.length > 0) {
        //         const id = decrypt(infoFormCookie, COOKIE_ID);


        //         getForms(id).then((v) => {
        //             if (v !== null) {
        //                 v.data.forEach(element => {
        //                     setPreviousForms((prevForms) => [...prevForms, {
        //                         id: element.id,
        //                         title: element.data().title,
        //                         description: element.data().description,
        //                         elements: element.data().elements,
        //                         dateCreated: element.data().dateCreated,
        //                         adminId: element.data().adminId,
        //                         creatorId: id,
        //                         editorNumbers: element.data().editorNumbers
        //                     }]);

        //                     element.data().editorNumbers.forEach((elem: any) => {
        //                         setNumberOfDevices((prevNum: any) => [...prevNum, elem]);
        //                     });

        //                 });
        //                 setLoading(false);
        //                 setNumberOfForms(v.count);


        //             }
        //         }).catch((e) => {
        //             toast.error('There was an error getting the')
        //         });


        //         getAllTasksToday().then((v) => {

        //             var id = decrypt(getCookie(COOKIE_ID), COOKIE_ID);
        //             if (v !== null) {
        //                 var clnts: any[] = [];
        //                 v.data.forEach(element => {

        //                     var client = getClient(element.data().client, id);

        //                     var task = {
        //                         docId: element.id,
        //                         id: element.data().id,
        //                         adminId: element.data().adminId,
        //                         date: element.data().date,
        //                         description: decrypt(element.data().description, id),
        //                         email: decrypt(element.data().email, id),
        //                         priority: decrypt(element.data().priority, id),
        //                         reminder: decrypt(element.data().reminder, id),
        //                         client: client,
        //                         title: decrypt(element.data().title, id),

        //                     }

        //                     clnts.push(task);

        //                 });
        //                 setTasks(clnts);
        //                 if (clnts.length > 0) {
        //                     toast.info(`You have ${clnts.length} tasks today!!`);
        //                     updDateTasks(clnts)
        //                 }


        //             }

        //             setLoading(false);
        //         }).catch((e) => {
        //             console.error(e);
        //             setLoading(false);
        //         });
        //     } else {
        //         router.push({
        //             pathname: '/login',
        //         });
        //     }

        // }


        // const getClient = (client: any, id: string) => {
        //     var notesA: any = [];
        //     client.notes.forEach((el: string) => {
        //         notesA.push(decrypt(el, id));
        //     });


        //     var prodA: any = [];
        //     client.enquired.forEach((el: string) => {
        //         prodA.push(decrypt(el, id));
        //     });

        //     var clientF = {
        //         id: client.id,
        //         adminId: client.adminId,
        //         date: client.date,
        //         name: decrypt(client.name, id),
        //         contact: decrypt(client.contact, id),
        //         organisation: decrypt(client.organisation, id),
        //         stage: decrypt(client.stage, id),
        //         notes: notesA,
        //         refSource: decrypt(client.refSource, id),
        //         enquired: prodA,
        //         value: decrypt(client.value, id)
        //     }

        //     return clientF;
        // }






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
                            <Loader />
                        </div>

                        :
                        <div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8'>


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
