import React, { Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { getCookie } from 'react-use-cookie';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { IClient } from '../types/userTypes';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE } from '../constants/constants';
import ClientNav from './clientNav';
import Loader from './loader';
import { addTasksToDB, getAllClientsToDB, updateClientToDB } from '../api/crmApi';
import { print } from '../utils/console';
import { searchStringInMembers } from '../utils/stringM';
import DateMethods from '../utils/date';
import { decrypt, encrypt } from '../utils/crypto';
import DataSummary from './dataSummary';
import Pill from './pill';
import { addDays } from 'date-fns';






const ClientProfile = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selected, setSelected] = useState([]);
    const [role, setRole] = useState("Admin");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [clients, setClients] = useState<IClient[]>([]);
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


        setClients([]);
        getClientsFromDB();




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
                var clnts: any[] = [];
                v.data.forEach(element => {

                    var notesA: any = [];
                    element.data().notes.forEach((el: string) => {
                        notesA.push(decrypt(el, id));
                    });


                    var prodA: any = [];

                    if (element.data().enquired.length > 0) {
                        element.data().enquired.forEach((el: any) => {
                            prodA.push(
                                {
                                    product: decrypt(el.product, id),
                                    value: decrypt(el.value, id),
                                    totalNumber: decrypt(el.totalNumber, id)
                                }
                            )
                        });
                    }


                    var client = {
                        docId: element.id,
                        id: element.data().id,
                        adminId: element.data().adminId,
                        dateString: element.data().dateString,
                        date: element.data().date,
                        name: decrypt(element.data().name, id),
                        contact: decrypt(element.data().contact, id),
                        organisation: decrypt(element.data().organisation, id),
                        stage: decrypt(element.data().stage, id),
                        notes: notesA,
                        refSource: decrypt(element.data().refSource, id),
                        enquired: prodA,
                        value: decrypt(element.data().value, id),
                        salesPerson: decrypt(element.data().salesPerson, id),
                    }

                    clnts.push(client);

                });
                let res = clnts.sort((a, b) => new Date(a.dateString).getTime() - new Date(b.dateString).getTime());
                setClients(res);
                setTempClients(res);

            }

            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });


    }


    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            setLoading(true);
            if (search !== '') {


                let res: IClient[] = searchStringInMembers(clients, search);
                setTimeout(() => {
                    setTempClients(res);
                    setLoading(false);
                }, 1500);


            } else {

                toast.info(`${search} not found`);
                setTempClients(clients);
                setLoading(false);


            }



        }
    };


    // TODO later Update Client
    const updateClient = () => {
        setOpenDialog(false);
        if (typeof editMember !== 'undefined') {
            setLoading(true);
            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }

            var id = decrypt(infoFromCookie, COOKIE_ID);

            var notesA = [];
            notesA.push(encrypt(notes, id));
            var prodA: any = [];
            if (products.includes(",")) {
                var prodAr = products.split(",");
                prodAr.forEach((el) => {
                    prodA.push(encrypt(el, id))
                })

            } else {
                prodA.push(products);
            }

            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                dateString: editMember.dateString,
                name: encrypt(fullName, id),
                contact: encrypt(contact, id),
                organisation: encrypt(organisation, id),
                stage: encrypt(stage, id),
                notes: notesA,
                refSource: encrypt(refSource, id),
                enquired: prodA,
                value: encrypt(totalAmount, id),
                encryption: 2
            }

            updateClientToDB(editMember.docId, client).then((r) => {
                getClientsFromDB();
            }).catch((e) => {
                toast.error("There was an error adding client please try again");
                setLoading(false);
                console.error(e);
            });


        }
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
                prodA.push(
                    {
                        product: encrypt(el.product, id),
                        value: encrypt(el.value, id),
                        totalNumber: encrypt(el.totalNumber, id)
                    }
                )
            })




            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                name: encrypt(editMember.name, id),
                contact: encrypt(editMember.contact, id),
                organisation: encrypt(editMember.organisation, id),
                stage: encrypt(stage, id),
                notes: notesA,
                dateString: editMember.dateString,
                refSource: encrypt(editMember.refSource, id),
                enquired: prodA,
                value: encrypt(editMember.value, id),
                encryption: 2
            }

            updateClientToDB(editMember.docId, client).then((r) => {
                getClientsFromDB();
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
                prodA.push(
                    {
                        product: encrypt(el.product, id),
                        value: encrypt(el.value, id),
                        totalNumber: encrypt(el.totalNumber, id)
                    }
                )
            })






            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                name: encrypt(editMember.name, id),
                contact: encrypt(editMember.contact, id),
                organisation: encrypt(editMember.organisation, id),
                stage: encrypt(editMember.stage, id),
                notes: notesA,
                refSource: encrypt(editMember.refSource, id),
                enquired: prodA,
                dateString: editMember.dateString,
                value: encrypt(editMember.value, id),
                encryption: 2
            }

            updateClientToDB(editMember.docId, client).then((r) => {
                getClientsFromDB();
            }).catch((e) => {
                toast.error("There was an error adding client please try again");
                setLoading(false);
                console.error(e);
            });
        }
    }

    const sortClients = () => {
        setLoading(true);
        setSortDateUp(!sortDateUp);
        setTempClients([]);
        var res = DateMethods.sortObjectsByDate(tempClients, sortDateUp);
        setTimeout(() => {
            setTempClients(res);
            setLoading(false);
        }, 2000);
    }

    const addTasks = () => {
        setOpenDialog(false);
        setLoading(true);


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


            var prodA: any = [];

            var prodAr = editMember.enquired;
            prodAr.forEach((el: any) => {
                prodA.push(
                    {
                        product: encrypt(el.product, id),
                        value: encrypt(el.value, id),
                        totalNumber: encrypt(el.totalNumber, id)
                    }
                )
            })





            var client = {
                id: editMember.id,
                adminId: editMember.adminId,
                date: editMember.date,
                name: encrypt(editMember.name, id),
                contact: encrypt(editMember.contact, id),
                organisation: encrypt(editMember.organisation, id),
                stage: encrypt(editMember.stage, id),
                notes: notesA,
                refSource: encrypt(editMember.refSource, id),
                enquired: prodA,
                value: encrypt(editMember.value, id),
                encryption: 2,
                dateString: editMember.dateString

            }



            var task = {
                docId: "",
                client: client,
                title: encrypt(title, id),
                email: encrypt(email, id),
                priority: encrypt(priority, id),
                reminder: encrypt(reminder.toString(), id),
                description: encrypt(description, id),
                encryption: 2,
                date: new Date(),
                dateString: new Date().toDateString(),
                adminId: id,
                id: decrypt(getCookie(COOKIE_ID), COOKIE_ID),
                taskDate: addDays(new Date(), reminder).toDateString(),
                active: true
            }

            addTasksToDB(task).then((e) => {
                setLoading(false);
                toast.success("Task added successfully");
            }).catch((e) => {
                console.error(e);
                toast.error("There was an error adding task please try again");
            });
        }
    }

    const getView = () => {

        switch (view) {
            case 0:
                return (
                    <div className='flex flex-col'>
                        <Pill title={`${editMember?.name}`} description={'Name'} />
                        <Pill title={`${editMember?.contact}`} description={'Contact'} />
                        <Pill title={`${editMember?.organisation}`} description={'Organization'} />
                        <Pill title={`${editMember?.refSource}`} description={'Came to us through'} />
                        <Pill title={`${editMember?.enquired.map((v: any) => v.product)}`} description={'Enquired About'} />
                        <Pill title={`${editMember?.value}`} description={'Total Value'} />
                        <Pill title={`${editMember?.stage}`} description={'Stage'} />
                        <Pill title={`${editMember?.notes}`} description={'Notes'} />
                        <Pill title={`${editMember?.salesPerson}`} description={'Sales Person'} />
                    </div>
                );
            case 1:

                return (
                    <div className='flex flex-col space-y-2 '>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={fullName}
                                placeholder={"Full Name"}
                                onChange={(e) => {
                                    setFullName(e.target.value);

                                }}
                                className="
                            w-full
                            rounded-[25px]
                            border-2
                            border-[#fdc92f]
                            py-3
                            px-5
                            bg-white
                            text-base text-body-color
                            placeholder-[#ACB6BE]
                            outline-none
                                focus-visible:shadow-none
                                focus:border-primary
                            "

                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={contact}
                                placeholder={"Contact"}
                                onChange={(e) => {
                                    setContact(e.target.value);

                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={organisation}
                                placeholder={"Organisation"}
                                onChange={(e) => {
                                    setOrganisation(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className='mb-6'>
                            <button className='font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full' >
                                <select
                                    value={stage}
                                    onChange={(e) => {
                                        setStage(e.target.value);
                                    }}
                                    className='bg-white w-full'
                                    data-required="1"
                                    required>
                                    <option value="Contact" hidden>
                                        Stage of Relationship
                                    </option>
                                    <option value="Contact" hidden>
                                        Stage of Deal
                                    </option>
                                    <option value="Quotation Sent" >
                                        Quotation Sent
                                    </option>
                                    <option value="Invoice Sent" >
                                        Invoice Sent
                                    </option>
                                    <option value="Receipt Sent" >
                                        Receipt Sent
                                    </option>
                                    <option value="Project Started" >
                                        Project Started
                                    </option>
                                    <option value="Project In Progress" >
                                        Project In Progress
                                    </option>
                                    <option value="Project Finished" >
                                        Project Finished
                                    </option>
                                </select>
                            </button>

                        </div>
                        <div className="mb-6">
                            <input
                                value={products}
                                placeholder={"List of products/services enquired"}
                                onChange={(e) => {
                                    setProducts(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <input
                                value={totalAmount}
                                placeholder={"Total Value Amount"}
                                onChange={(e) => {
                                    setTotalAmount(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <textarea
                                value={notes}
                                placeholder={"Notes"}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    h-48
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <textarea
                                value={refSource}
                                placeholder={"How they heard"}
                                onChange={(e) => {
                                    setRefSource(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    h-48
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <button
                                onClick={() => { updateClient() }}
                                className="
                                    font-bold
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    border-primary
                                    py-3
                                    px-5
                                    bg-[#fdc92f]
                                    text-base
                                    text-[#7d5c00]
                                    cursor-pointer
                                    hover:bg-opacity-90
                                    transition
                                    ">
                                Update Client
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className='flex flex-col space-y-2 '>
                        <div className='mb-6'>
                            <button className='font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full' >
                                <select
                                    value={stage}
                                    onChange={(e) => {
                                        setStage(e.target.value);
                                    }}
                                    className='bg-white w-full'
                                    data-required="1"
                                    required>
                                    <option value="Contact" hidden>
                                        Stage of communication
                                    </option>
                                    <option value="Contact Made">
                                        Contact Made
                                    </option>
                                    <option value="Appointment Set" >
                                        Appointment Set
                                    </option>
                                    <option value="Presentation Made" >
                                        Presentation Made
                                    </option>
                                    <option value="Decision Maker brought in" >
                                        Decision Maker brought in
                                    </option>
                                    <option value="Contract Sent" >
                                        Contract Sent
                                    </option>
                                    <option value="Contract Signed" >
                                        Contract Signed
                                    </option>
                                    <option value="Project Started" >
                                        Project Started
                                    </option>
                                    <option value="Project In Progress" >
                                        Project In Progress
                                    </option>
                                    <option value="Project Finished" >
                                        Project Finished
                                    </option>
                                </select>
                            </button>

                        </div>
                        <div className="mb-6">
                            <button
                                onClick={() => { updateStage() }}
                                className="
                                    font-bold
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    border-primary
                                    py-3
                                    px-5
                                    bg-[#fdc92f]
                                    text-base
                                    text-[#7d5c00]
                                    cursor-pointer
                                    hover:bg-opacity-90
                                    transition
                                    ">
                                Update Stage
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className='flex flex-col space-y-2 '>
                        <div className="mb-6">
                            <textarea
                                value={notes}
                                placeholder={"Notes"}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    h-48
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <button
                                onClick={() => { addNotes() }}
                                className="
                                    font-bold
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    border-primary
                                    py-3
                                    px-5
                                    bg-[#fdc92f]
                                    text-base
                                    text-[#7d5c00]
                                    cursor-pointer
                                    hover:bg-opacity-90
                                    transition
                                    ">
                                Add Notes
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className='grid grid-cols-1 gap-4'>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={title}
                                placeholder={"Title of task"}
                                onChange={(e) => {
                                    setTitle(e.target.value);

                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={email}
                                placeholder={"Email"}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className='mb-6'>
                            <button className='font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full' >
                                <select
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value);
                                    }}
                                    className='bg-white w-full'
                                    data-required="1"
                                    required>
                                    <option value="title" hidden>
                                        Select Priority
                                    </option>
                                    <option value="High">
                                        High
                                    </option>
                                    <option value="Medium">
                                        Medium
                                    </option>
                                    <option value="Low" >
                                        Low
                                    </option>

                                </select>
                            </button>

                        </div>
                        <div className="mb-6">
                            <p className='text-xs text-center'>Reminder cycle in days</p>
                            <input
                                type='number'
                                value={reminder}
                                placeholder={"Set reminder cycle in days"}
                                onChange={(e) => {
                                    setReminder(parseInt(e.target.value));
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>

                        <div className="mb-6">
                            <textarea
                                value={description}
                                placeholder={"Description"}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    h-48
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "

                            />
                        </div>
                        <div className="mb-6">
                            <button
                                onClick={() => { addTasks() }}
                                className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#fdc92f]
                                        border-primary
                                        py-3
                                        px-5
                                        bg-[#fdc92f]
                                        text-base
                                        text-[#7d5c00]
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    ">
                                Add Task
                            </button>
                        </div>

                    </div>
                )
            default:
                return (
                    <div className='flex flex-col'>
                        <Pill title={`${editMember?.name}`} description={'Name'} />
                        <Pill title={`${editMember?.contact}`} description={'Contact'} />
                        <Pill title={`${editMember?.organisation}`} description={'Organization'} />
                        <Pill title={`${editMember?.refSource}`} description={'Came to us through'} />
                        <Pill title={`${editMember?.enquired}`} description={'Enquired About'} />
                        <Pill title={`${editMember?.value}`} description={'Total Value'} />
                        <Pill title={`${editMember?.stage}`} description={'Stage'} />
                        <Pill title={`${editMember?.notes}`} description={'Notes'} />
                    </div>
                );
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
                            <p className='text-base'>Total recorded of clients {clients.length}</p>
                        </div>
                    </div>

                    <div className='w-full overscroll-contain overflow-y-auto max-h-screen min-h-screen'>
                        <div className='grid grid-cols-1 md:grid-cols-6'>
                            <div className='col-span-1'>
                                <button
                                    onClick={() => { sortClients() }}
                                    className='
                                        
                                                flex 
                                                flex-row
                                                items-center
                                                content-center
                                                font-bold
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-[#fdc92f]
                                                border-primary
                                                py-3
                                                px-5
                                                bg-[#fdc92f]
                                                text-base
                                                text-[#7d5c00]
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition'>
                                    Sort by Date
                                    {sortDateUp ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
                                        </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
                                        </svg>
                                    }
                                </button>
                            </div>
                            <div className='col-span-5'>
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
                                            border-[#fdc92f]
                                            py-3
                                            px-5
                                            bg-white
                                            text-base
                                             text-body-color
                                             text-black
                                            placeholder-[#ACB6BE]
                                            outline-none
                                            focus-visible:shadow-none
                                            focus:border-primary
                                            "
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                        <table className="table border-separate border-spacing-1  shadow-2xl rounded-[25px] p-4 w-full">
                            <thead className=' text-white font-bold w-full p-4'>

                                <tr className=' bg-[#00947a] py-3'>
                                    {labels.map((v: any) => (
                                        <th key={v.label} className='text-left'>{v}</th>
                                    ))}
                                </tr>


                            </thead>
                            <tbody>

                                {
                                    tempClients.map((value, index) => {
                                        return (
                                            <tr key={index}
                                                className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer '}
                                            >

                                                <td className='text-left' >{value.dateString}</td>
                                                <td className='text-left' >{value.name}</td>
                                                <td className='text-left' >{value.contact}</td>
                                                <td className='text-left' >{value.stage}</td>
                                                <td className='text-left' >{value.organisation}</td>

                                                <td className=" whitespace-nowrap text-right">

                                                    <Menu>
                                                        {({ open }) => (
                                                            <>
                                                                <span className="rounded-md shadow-sm">
                                                                    <Menu.Button className="inline-flex justify-center text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 ">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                                        </svg>

                                                                    </Menu.Button>
                                                                </span>

                                                                <Transition
                                                                    show={open}
                                                                    enter="transition ease-out duration-100"
                                                                    enterFrom="transform opacity-0 scale-95"
                                                                    enterTo="transform opacity-100 scale-100"
                                                                    leave="transition ease-in duration-75"
                                                                    leaveFrom="transform opacity-100 scale-100"
                                                                    leaveTo="transform opacity-0 scale-95"
                                                                >
                                                                    <Menu.Items
                                                                        static
                                                                        className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                                                                    >
                                                                        <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') { setOpenDialog(true); setEditMember(value); setView(0); } }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        View
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div>
                                                                        {/* <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') { setOpenDialog(true); setEditMember(value); setView(1); } }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div> */}
                                                                        <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') { setOpenDialog(true); setEditMember(value); setView(2); } }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        Move Stage
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div>
                                                                        <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') setOpenDialog(true); setEditMember(value); setView(3); }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        Add Notes
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div>
                                                                        <div className="py-1">

                                                                            <Menu.Item>
                                                                                {({ active }) => (
                                                                                    <button
                                                                                        onClick={() => { if (typeof value.id !== 'undefined') setOpenDialog(true); setEditMember(value); setView(4); }}
                                                                                        className={`${active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700"
                                                                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                    >
                                                                                        Add Task
                                                                                    </button>
                                                                                )}
                                                                            </Menu.Item>
                                                                        </div>




                                                                    </Menu.Items>
                                                                </Transition>
                                                            </>
                                                        )}
                                                    </Menu>

                                                </td>

                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </table>
                    </div>



                </div>}

            <Transition appear show={openDialog} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setOpenDialog(false)}
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
                            <div className="bg-slate-100 my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">



                                {getView()}



                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default ClientProfile


