import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { getCookie } from 'react-use-cookie';
import { IClient } from '../types/userTypes';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY } from '../constants/constants';
import Loader from './loader';
import { getAllTasksToDB, updateClientToDB } from '../api/crmApi';
import { decrypt, encrypt } from '../utils/crypto';
import TaskAccordion from './taskAccordian';
import { ITask } from '../types/taskTypes';





const CRMTasks = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selected, setSelected] = useState([]);
    const [role, setRole] = useState("Admin");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [labels, setLabels] = useState(['Created', 'Name', 'Contact', 'Stage', 'Organisation']);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editMember, setEditMember] = useState<any>();
    const [search, setSearch] = useState("");
    const [sortDateUp, setSortDateUp] = useState(false);
    const [tempClients, setTempClients] = useState<IClient[]>([]);
    const [contact, setContact] = useState("");
    const [organisation, setOrganisation] = useState("");
    const [stage, setStage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [view, setView] = useState(0);
    const [notes, setNotes] = useState("");
    const [refSource, setRefSource] = useState("");
    const [products, setProducts] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [docId, setDocId] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [priority, setPriority] = useState("");
    const [reminder, setReminder] = useState(0);
    const [description, setDescription] = useState("");







    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        setTasks([]);
        getTasksFromDB();




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


    const getTasksFromDB = () => {
        setLoading(true);

        getAllTasksToDB().then((v) => {

            var id = decrypt(getCookie(COOKIE_ID), COOKIE_ID);
            if (v !== null) {
                var clnts: any[] = [];
                v.data.forEach(element => {

                    var client = getClient(element.data().client, id);

                    var task = {
                        docId: element.id,
                        id: element.data().id,
                        adminId: element.data().adminId,
                        date: element.data().dateString,
                        description: decrypt(element.data().description, id),
                        email: decrypt(element.data().email, id),
                        priority: decrypt(element.data().priority, id),
                        reminder: decrypt(element.data().reminder, id),
                        client: client,
                        title: decrypt(element.data().title, id),

                    }

                    clnts.push(task);

                });
                setTasks(clnts);


            }

            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });


    }

    const getClient = (client: any, id: string) => {
        var notesA: any = [];
        client.notes.forEach((el: string) => {
            notesA.push(decrypt(el, id));
        });



        var prodA: any = [];

        if (client.enquired.length > 0) {
            client.enquired.forEach((el: any) => {
                prodA.push(
                    {
                        product: decrypt(el.product, id),
                        value: decrypt(el.value, id),
                        totalNumber: decrypt(el.totalNumber, id)
                    }
                )
            });
        }

        var clientF = {
            id: client.id,
            adminId: client.adminId,
            date: client.dateString,
            name: decrypt(client.name, id),
            contact: decrypt(client.contact, id),
            organisation: decrypt(client.organisation, id),
            stage: decrypt(client.stage, id),
            notes: notesA,
            refSource: decrypt(client.refSource, id),
            enquired: prodA,
            value: decrypt(client.value, id)
        }

        return clientF;
    }






    const updateStage = () => {
        setOpenDialog(false);
        setTempClients([]);
        if (typeof editMember !== 'undefined') {
            setLoading(true);
            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }

            var id = decrypt(infoFromCookie, COOKIE_ID);


            var notesA: any = [];
            var notesAr = editMember.notes;
            notesAr.forEach((el: any) => {

                notesA.push(encrypt(el, id))
            })


            var prodA: any = [];

            var prodAr = editMember.enquired;
            prodAr.forEach((el: any) => {
                prodA.push(encrypt(el, id));
            })




            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                dateString: editMember.dateString,
                name: encrypt(editMember.name, id),
                contact: encrypt(editMember.contact, id),
                organisation: encrypt(editMember.organisation, id),
                stage: encrypt(stage, id),
                notes: notesA,
                refSource: encrypt(editMember.refSource, id),
                enquired: prodA,
                value: encrypt(editMember.value, id),
                encryption: 2
            }

            updateClientToDB(editMember.docId, client).then((r) => {
                // getClientsFromDB();
            }).catch((e) => {
                toast.error("There was an error adding client please try again");
                setLoading(false);
                console.error(e);
            });
        }
    }

    const addNotes = () => {
        setOpenDialog(false);
        setTempClients([]);
        if (typeof editMember !== 'undefined') {
            setLoading(true);
            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }

            var id = decrypt(infoFromCookie, COOKIE_ID);


            var notesA: any = [];
            var notesAr = editMember.notes;
            notesAr.forEach((el: any) => {

                notesA.push(encrypt(el, id))
            });
            notesA.push(encrypt(notes, id));

            var prodA: any = [];

            var prodAr = editMember.enquired;
            prodAr.forEach((el: any) => {
                prodA.push(encrypt(el, id));
            })





            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                dateString: editMember.dateString,
                name: encrypt(editMember.name, id),
                contact: encrypt(editMember.contact, id),
                organisation: encrypt(editMember.organisation, id),
                stage: encrypt(editMember.stage, id),
                notes: notesA,
                refSource: encrypt(editMember.refSource, id),
                enquired: prodA,
                value: encrypt(editMember.value, id),
                encryption: 2
            }

            updateClientToDB(editMember.docId, client).then((r) => {
                // getClientsFromDB();
            }).catch((e) => {
                toast.error("There was an error adding client please try again");
                setLoading(false);
                console.error(e);
            });
        }
    }





    return (
        <div>

            {loading ?
                <div className='flex flex-col items-center content-center'>
                    <Loader />
                </div> :
                <div className='flex flex-col'>

                    <div className='grid grid-cols-2 p-4'>
                        <div>
                            <p className='text-base'>Total number of tasks {tasks.length}</p>
                        </div>
                    </div>

                    <div className='w-full overscroll-contain'>
                        {
                            tasks.map((value, index) => {

                                return (
                                    <TaskAccordion title={value.title} task={value} key={index} />

                                )
                            })
                        }
                    </div>



                </div>}


            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default CRMTasks


