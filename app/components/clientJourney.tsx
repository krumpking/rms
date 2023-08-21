import React, { Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from 'react-use-cookie';
import { IClient } from '../types/userTypes';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE } from '../constants/constants';
import Loader from './loader';
import { getAllClientsToDB } from '../api/crmApi';
import { decrypt } from '../utils/crypto';
import Accordion from './accordion';
import { useRouter } from 'next/router';






const ClientJourney = () => {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Map<any, any>>();
    const [contactMade, setContactMade] = useState([]);
    const [quotation, setQuotationSent] = useState([]);
    const [invoiceSent, setInvoiceSent] = useState([]);
    const [receiptSent, setReceiptSent] = useState([]);
    const [projectSigned, setProjectSigned] = useState([]);
    const [projectInProgress, setProjectInProgress] = useState([]);
    const [projectFinished, setProjectFinished] = useState([]);
    const router = useRouter();








    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        setContactMade([]);
        setQuotationSent([]);
        setInvoiceSent([]);
        setReceiptSent([]);
        setProjectSigned([]);
        setProjectInProgress([]);
        setProjectFinished([]);
        getClientsFromDB();


        let role = getCookie(PERSON_ROLE);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        if (typeof role !== 'undefined') {
            if (role !== "") {
                var id = decrypt(infoFromCookie, COOKIE_ID);
                var roleTitle = decrypt(role, id);
                if (roleTitle == "Editor") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }




    }, []);









    // const deleteMemb = (id: string) => {
    //     setLoading(true);
    //     deleteClientById(id).then((v) => {
    //         setUsers([]);
    //         getUsersFromDB();
    //     }).catch((e) => {
    //         console.error(e);
    //     })

    // }


    const getClientsFromDB = () => {
        setLoading(true);

        getAllClientsToDB().then((v) => {


            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }
            var id = decrypt(infoFromCookie, COOKIE_ID)


            if (v !== null) {
                var sortedData = new Map();

                v.data.forEach(element => {

                    var notesA: any = [];
                    element.data().notes.forEach((el: string) => {
                        notesA.push(decrypt(el, id));
                    });


                    var prodA: any = [];
                    element.data().enquired.forEach((el: any) => {
                        prodA.push(
                            {
                                product: decrypt(el.product, id),
                                value: decrypt(el.value, id),
                                totalNumber: decrypt(el.totalNumber, id)
                            }
                        )
                    });

                    var client = {
                        docId: element.id,
                        id: element.data().id,
                        adminId: element.data().adminId,
                        date: element.data().date,
                        dateString: element.data().dateString,
                        name: decrypt(element.data().name, id),
                        contact: decrypt(element.data().contact, id),
                        organisation: decrypt(element.data().organisation, id),
                        stage: decrypt(element.data().stage, id),
                        notes: notesA,
                        refSource: decrypt(element.data().refSource, id),
                        enquired: prodA,
                        value: decrypt(element.data().value, id)
                    }
                    let curr: IClient[] = [];

                    if (sortedData.has(client.stage)) {
                        curr = sortedData.get(client.stage);
                        curr.push(client);
                        sortedData.set(client.stage, curr);
                    } else {
                        curr.push(client);
                        sortedData.set(client.stage, curr);
                    }


                });



                setClients(sortedData);
                setContactMade(sortedData.has("Contact Made") ? sortedData.get("Contact Made") : []);
                setQuotationSent(sortedData.has("Quotation Sent") ? sortedData.get("Quotation Sent") : []);
                setInvoiceSent(sortedData.has("Invoice Sent") ? sortedData.get("Invoice Sent") : []);
                setReceiptSent(sortedData.has("Receipt Sent") ? sortedData.get("Receipt Sent") : []);
                setProjectSigned(sortedData.has("Project Started") ? sortedData.get("Project Started") : []);
                setProjectInProgress(sortedData.has("Project In Progress") ? sortedData.get("Project In Progress") : []);
                setProjectFinished(sortedData.has("Project Finished") ? sortedData.get("Project Finished") : []);

            }

            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });


    }




    return (
        <div>

            {loading ?
                <div className='flex flex-col items-center content-center'>
                    <Loader />
                </div> :
                <div className=' w-full'>

                    {typeof clients !== 'undefined' ?
                        <div className='grid grid-cols-7 gap-4 overflow-x-auto whitespace-nowrap'>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{contactMade.length} Contact Made </p>
                                {contactMade.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{quotation.length} Quotation Sent</p>
                                {quotation.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{invoiceSent.length} Invoice Sent</p>
                                {invoiceSent.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p> {receiptSent.length} Receipt Sent</p>
                                {receiptSent.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{projectSigned.length} Project Started</p>
                                {projectSigned.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{projectInProgress.length} Project In Progress</p>
                                {projectInProgress.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                            <div className='w-96 h-full shadow-xl p-4 rounded-[15px]'>
                                <p>{projectFinished.length} Project Finished</p>
                                {projectFinished.map((v: any) => {
                                    return (
                                        <Accordion key={v.name} title={v.name} description={v.value} />
                                    )
                                })}
                            </div>
                        </div> : <p>No information to show at this moment</p>
                    }

                </div>}


            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default ClientJourney


