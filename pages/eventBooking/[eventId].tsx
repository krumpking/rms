import React, { Fragment, useEffect, useMemo, useReducer, useState } from 'react'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, TEMPLATES } from '../../app/constants/constants';
import Payment from '../../app/utils/paymentUtil';
import { getCookie } from 'react-use-cookie';
import { decrypt, encrypt } from '../../app/utils/crypto';
import { addAdmin, deleteDocument } from '../../app/api/adminApi';
import Random from '../../app/utils/random';
import ClientNav from '../../app/components/clientNav';
import Loader from '../../app/components/loader';
import { Dialog, Menu, Tab, Transition } from '@headlessui/react';
import Elem, { iElements } from '../../app/components/elements';
import { createId } from '../../app/utils/stringM';
import { print } from '../../app/utils/console';
import { IFormElement } from '../../app/types/formTypes';
import { getOneForm, updateForm } from '../../app/api/formApi';
import { addBookingEvent, addBookingToEvent, getMyEvents, getOneBookingEvent, sendEmailAtBooking, updateBooking, updateBookingEvent } from '../../app/api/bookingsApi';
import Pill from '../../app/components/pill';
import { IAttendee, IBookingEvent } from '../../app/types/bookingsTypes';
import { downloadExcel } from '../../app/utils/excel';
import { getOrgInfoFromDB } from '../../app/api/orgApi';
import { searchStringInArrayOfObjects } from '../../app/utils/arrayM';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const EventBooking = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");
    const [directions, setDirections] = useState("");
    const [time, setTime] = useState("");
    const [docId, setDocId] = useState("");
    const [tabs, setTabs] = useState(["Event", "Bookings"]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bookings, setBookings] = useState<IAttendee[]>([]);
    const [topics, setTopics] = useState(["Name", "Email", "Phone Number", "Attendance"])
    const [openDialog, setOpenDialog] = useState(false);
    const [notes, setNotes] = useState("");
    const [tempClients, setTempClients] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [organizationName, setOrganizationName] = useState("");
    const [address, setAddress] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    const [call, setCall] = useState("");
    const [landline, setLandline] = useState("");
    const [vat, setVat] = useState(0);
    const [image, setImage] = useState<any>()
    const [imageAdded, setImageAdded] = useState(false);
    const [endDate, setEndDate] = useState("");
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [tempAllBookings, setTempAllBookings] = useState<any[]>([]);
    const [bookingTopics, setBookingTopics] = useState<any[]>(["Name", "Email", "Phone Number"]);
    const [tableLoading, setTableLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [parking, setParking] = useState("");
    const [refreshments, setRefreshments] = useState("");
    const [otherInfo, setOtherInfo] = useState("");
    const [dressCode, setDressCode] = useState("");
    const [edit, setEdit] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);
    const [notesMember, setNotesMember] = useState<any>();






    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        checkPayment();

        if (router.isReady) {


            const { eventId } = router.query;

            if (typeof eventId == 'string') {

                const idDec = decrypt(eventId, COOKIE_ID);
                print(idDec);
                setDocId(idDec);
                getBookingEvent(idDec);
                getAllEvents();
                getOrgInfo();
            }




        }


    }, [router.isReady]);

    const checkPayment = async () => {
        const paymentStatus = await Payment.checkPaymentStatus();
        if (!paymentStatus) {
            toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

            setTimeout(() => {
                router.push({
                    pathname: '/payments',
                });
            }, 5000);

        }

        return paymentStatus;
    }

    const getOrgInfo = () => {
        setLoading(true);
        getOrgInfoFromDB().then((r) => {

            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }
            var id = decrypt(infoFromCookie, COOKIE_ID);


            if (r !== null) {

                r.data.forEach(element => {

                    setOrganizationName(decrypt(element.data().organizationName, id));
                    setAddress(decrypt(element.data().address, id));
                    setOrgEmail(decrypt(element.data().email, id));
                    setCall(decrypt(element.data().call, id));
                    setLandline(decrypt(element.data().landline, id));
                    setVat(parseInt(decrypt(element.data().vat, id)));
                    setImage(element.data().image);


                    if (typeof element.data().venues !== "undefined") {
                        let venuesA: any = [];
                        element.data().venues.forEach((e: any) => {
                            venuesA.push(decrypt(e, id));
                        });
                        setVenues(venuesA);
                        print(venuesA);
                    }

                    if (typeof element.data().events !== "undefined") {
                        let evnts: any = [];
                        element.data().events.forEach((e: any) => {
                            evnts.push(decrypt(e, id));
                        });
                        setEvents(evnts);
                    }
                });

            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });
    }


    const getBookingEvent = (id: string) => {


        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        let adminId = decrypt(infoFromCookie, COOKIE_ID);



        getOneBookingEvent(id).then((v) => {

            if (v !== null) {
                let d = v.data.data();
                setTitle(decrypt(d.title, adminId));
                setDescription(decrypt(d.description, adminId));
                setDate(d.dateString);
                setEndDate(new Date(d.endDate).toDateString());
                setVenue(decrypt(d.venue, adminId));
                setDirections(decrypt(d.directions, adminId));
                setParking(decrypt(d.parking, adminId));
                setRefreshments(decrypt(d.refreshments, adminId));
                setDressCode(decrypt(d.dressCode, adminId));
                setOtherInfo(decrypt(d.otherInfo, adminId));
                setBookings(d.bookings);
                setTime(decrypt(d.time, adminId));
            } else {
                toast.error('Form not found, please refresh the page');
            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
        });


    }


    const getAllEvents = () => {
        getMyEvents().then((res) => {

            if (res !== null) {


                var bookings: any[] = [];

                res.data.forEach(element => {
                    bookings = bookings.concat(element.data().bookings);
                });

                setAllBookings(bookings);
                setTempAllBookings(bookings);
            }



        }).catch(console.error);
    }

    const addBooking = () => {

        setLoading(true);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        let adminId = decrypt(infoFromCookie, COOKIE_ID);


        let booking: any[] = [];
        if (bookings.length > 0) {
            booking = bookings
        } else {
            booking = []
        }


        if (name !== "" && phone !== "" && email !== "") {
            booking.push({
                eventId: createId(),
                name: encrypt(name, adminId),
                phone: encrypt(phone, adminId),
                email: encrypt(email, adminId),
                attended: false,
                notes: []
            });

            setBookings(booking);
            print(booking);

            addBookingToEvent(docId, booking).then((v) => {
                toast.success("Booking added Sucessfully");
                setCurrentTab(1);
                sendEmailAtBooking(email, name, title, description, venue, directions, date, endDate, time, orgEmail, call, organizationName, image, parking, refreshments, dressCode, otherInfo);
                setLoading(false);
            }).catch((e) => { console.error(e) });
        } else {
            toast.error(`Name, Phone and Email cannot all be empty, please try again`);
            setLoading(false);
        }











    }

    const addBookingDataFromTable = (name: string, phone: string, email: string) => {
        setLoading(true);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        let adminId = decrypt(infoFromCookie, COOKIE_ID);


        let booking: any[] = [];
        if (bookings.length > 0) {
            booking = bookings
        } else {
            booking = []
        }


        if (name !== "" && phone !== "" && email !== "") {
            booking.push({
                eventId: createId(),
                name: encrypt(name, adminId),
                phone: encrypt(phone, adminId),
                email: encrypt(email, adminId),
                attended: false,
                notes: []
            });

            setBookings(booking);

            addBookingToEvent(docId, booking).then((v) => {
                toast.success("Booking added Sucessfully");
                setCurrentTab(1);
                sendEmailAtBooking(email, name, title, description, venue, directions, date, endDate, time, orgEmail, call, organizationName, image, parking, refreshments, dressCode, otherInfo);
                setLoading(false);
            }).catch((e) => { console.error(e) });
        } else {
            toast.error(`Name, Phone and Email cannot all be empty, please try again`);
            setLoading(false);
        }
    }

    const addNotes = () => {
        setOpenDialog(false);

        if (typeof notesMember !== 'undefined') {
            setLoading(true);
            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }
            var id = decrypt(infoFromCookie, COOKIE_ID);
            var notesA: any = [];

            if (notesMember.notes.length > 0) {
                notesA = notesMember.notes;
            }

            notesA.push(encrypt(notes, id));



            var client = {
                eventId: notesMember.eventId,
                name: notesMember.name,
                phone: notesMember.phone,
                email: notesMember.email,
                attended: notesMember.attended,
                notes: notesA
            }

            let booking: any[] = [];
            if (bookings.length > 0) {
                booking = bookings
            } else {
                booking = []
            }

            booking.forEach((element, index) => {
                if (element.eventId === client.eventId) {
                    booking[index] = client;
                    return;
                }
            });
            addBookingToEvent(docId, booking).then((r) => {

                getBookingEvent(docId);

            }).catch((e) => {
                toast.error("There was an error adding notes please try again");
                setLoading(false);
                console.error(e);
            });
        }
    }

    const getData = (data: string) => {
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        let adminId = decrypt(infoFromCookie, COOKIE_ID);
        return decrypt(data, adminId);
    }

    const markAttended = (editMember: any) => {
        var client = {
            eventId: editMember.eventId,
            name: editMember.name,
            phone: editMember.phone,
            email: editMember.email,
            attended: true,
            notes: editMember.notes
        }

        let booking: any[] = [];
        if (bookings.length > 0) {
            booking = bookings
        } else {
            booking = []
        }

        booking.forEach((element, index) => {
            if (element.eventId === client.eventId) {
                booking[index] = client;
                return;
            }

        });

        addBookingToEvent(docId, booking).then((r) => {
            getBookingEvent(docId);
        }).catch((e) => {
            toast.error("There was an error adding client please try again");
            setLoading(false);
            console.error(e);
        });
    }

    const deleteBooking = (editMember: any) => {
        setLoading(true);
        let text = `Are you sure you want to delete booking? \nEither OK or Cancel.`;
        if (confirm(text) == true) {
            text = "You pressed OK!";
            let booking: any[] = [];
            if (bookings.length > 0) {
                booking = bookings
            } else {
                booking = []
            }
            booking.forEach((element, index) => {
                if (element.eventId === editMember.eventId) {
                    booking.splice(index, 1);
                    return;
                }

            });
            updateBooking(docId, { bookings: booking }).then((v: any) => {
                getBookingEvent(docId);
                setLoading(false);

            }).catch(console.log);
        } else {
            text = "You canceled!";
        }
    }

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            setTempAllBookings([]);
            setTableLoading(true);
            if (search !== '') {

                if (search == '=') {

                    let res: any[] = searchStringInArrayOfObjects(allBookings, " ");
                    setTimeout(() => {
                        setTempAllBookings(res);
                        setTableLoading(false);
                    }, 1500);
                } else {
                    let res: any[] = searchStringInArrayOfObjects(allBookings, search);

                    if (res.length > 0) {
                        setTimeout(() => {
                            setTempAllBookings(res);
                            setTableLoading(false);
                        }, 1500);
                    } else {
                        toast.info(`${search} not found`);
                        setTimeout(() => {
                            setTempAllBookings(allBookings);
                            setTableLoading(false);
                        }, 1500);

                    }

                }

            } else {

                setTimeout(() => {
                    setTempAllBookings(allBookings);
                    setTableLoading(false);
                }, 1500);

            }



        }
    };

    const AddEvent = () => {
        setLoading(true);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        var adminId = decrypt(infoFromCookie, COOKIE_ID);
        var myId = decrypt(infoFromCookie, COOKIE_ID);

        if (description !== "" && date !== "" && title !== "" && time !== "" && venue !== "" && directions !== "") {

            let booking: IBookingEvent = {
                adminId: adminId,
                id: myId,
                description: encrypt(description, adminId),
                date: date,
                endDate: endDate,
                dateString: new Date(date).toDateString(),
                created: new Date(),
                title: encrypt(title, adminId),
                time: encrypt(time, adminId),
                venue: encrypt(venue, adminId),
                directions: encrypt(directions, adminId),
                parking: encrypt(parking, adminId),
                dressCode: encrypt(dressCode, adminId),
                refreshments: encrypt(refreshments, adminId),
                otherInfo: encrypt(otherInfo, adminId),
                encryption: 2,
                bookings: []
            }

            updateBookingEvent(docId, booking).then((r) => {
                setLoading(false);
                toast.success('Event updated Successfully');
            }).catch((e) => {
                toast.error('There was an error adding event, please try again');
                console.error(e)
            });

        }
    };




    return (
        <div>
            <div className='flex flex-col lg:grid lg:grid-cols-12 w-full'>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'bookings'} />
                </div>

                {loading ?
                    <div className='flex flex-col justify-center items-center w-full lg:col-span-9'>
                        <Loader />
                    </div>

                    : <div className='bg-white col-span-9 m-8 rounded-[30px] p-4 lg:p-16 overflow-y-scroll'>


                        <Tab.Group
                            defaultIndex={currentTab}
                            selectedIndex={currentTab}
                            onChange={(index) => {
                                console.log("Changed selected tab to:", index);
                                setCurrentTab(index);
                            }}
                        >
                            <Tab.List className="flex space-x-1 rounded-[25px] bg-green-900/20 p-1">
                                {tabs.map((category) => (
                                    <Tab
                                        key={category}
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full  py-2.5 text-sm font-medium leading-5 text-[#00947a] rounded-[25px]',
                                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#00947a] focus:outline-none focus:ring-2',
                                                selected
                                                    ? 'bg-white shadow'
                                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >
                                        {category}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className="mt-2 ">
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>

                                        {edit ?
                                            <>
                                                <div className="mb-6">
                                                    <p className='text-center text-xs text-gray-300 mb-1 font-bold'>Start Date</p>
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        placeholder={'Date'}
                                                        onChange={(e) => {
                                                            setDate(e.target.value);
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
                                                    <p className='text-center text-xs text-gray-300 mb-1 font-bold'>End Date</p>
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        placeholder={'End date'}
                                                        onChange={(e) => {
                                                            setEndDate(e.target.value);
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
                                                    <p className='text-center text-xs text-gray-300 mb-1 font-bold'>Event Title</p>
                                                    <div className="mb-6 w-full">
                                                        <button className=' w-full
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
                                                            focus:border-primary'
                                                            onClick={(e) => e.preventDefault()}>
                                                            <select
                                                                value={title}
                                                                onChange={(e) => {
                                                                    setTitle(e.target.value);
                                                                }}
                                                                className='bg-white w-full'
                                                                required
                                                            >
                                                                <option value="Category" hidden>
                                                                    Select Event
                                                                </option>
                                                                {events.map((v) => {
                                                                    return (
                                                                        <option value={v} key={v}>{v}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </button>

                                                    </div>
                                                </div>
                                                <div className="mb-6">
                                                    <p className='text-center text-xs text-gray-300 mb-1 font-bold'>Event Time</p>
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        placeholder={'Time'}
                                                        onChange={(e) => {
                                                            setTime(e.target.value);
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
                                                <div className="mb-6 md:col-span-2">
                                                    <button className=' w-full
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
                                                        focus:border-primary' onClick={(e) => e.preventDefault()}>
                                                        <select
                                                            value={venue}
                                                            onChange={(e) => {
                                                                setVenue(e.target.value);
                                                            }}
                                                            className='bg-white w-full'
                                                            required
                                                        >
                                                            <option value="Category" hidden>
                                                                Select Venue
                                                            </option>
                                                            {venues.map((v) => {
                                                                return (
                                                                    <option value={v} key={v}>{v}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </button>
                                                </div>
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={description}
                                                        placeholder={'Event Description'}
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
                                                            bg-white
                                                            text-base text-body-color
                                                            placeholder-[#ACB6BE]
                                                            outline-none
                                                            focus-visible:shadow-none
                                                            focus:border-primary
                                                        "
                                                    />
                                                </div>
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={directions}
                                                        placeholder={'Event Directions'}
                                                        onChange={(e) => {
                                                            setDirections(e.target.value);
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
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={parking}
                                                        placeholder={'Parking'}
                                                        onChange={(e) => {
                                                            setParking(e.target.value);
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
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={dressCode}
                                                        placeholder={'Dress Code'}
                                                        onChange={(e) => {
                                                            setDressCode(e.target.value);
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
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={refreshments}
                                                        placeholder={'Refreshments'}
                                                        onChange={(e) => {
                                                            setRefreshments(e.target.value);
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
                                                        "                                                    />
                                                </div>
                                                <div className="mb-6 md:col-span-2">
                                                    <textarea
                                                        value={otherInfo}
                                                        placeholder={'Other info'}
                                                        onChange={(e) => {
                                                            setOtherInfo(e.target.value);
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
                                                    <button
                                                        onClick={() => {
                                                            AddEvent();
                                                        }}
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
                                                        "
                                                    >
                                                        Update Event
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => {
                                                            setEdit(false);
                                                        }}
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
                                                                flex
                                                                flex-row
                                                                justify-center
                                                            "
                                                    >
                                                        Cancel Edit

                                                    </button>
                                                </div>
                                            </>

                                            : <>
                                                <div className='flex flex-col'>
                                                    <Pill title={`${title}`} description={'title'} />
                                                    <Pill title={`${description}`} description={'Description'} />
                                                    <Pill title={`${venue}`} description={'Venue'} />
                                                    <Pill title={`${directions}`} description={'Directions'} />
                                                    <Pill title={`${parking}`} description={'Parking'} />
                                                    <Pill title={`${dressCode}`} description={'Dress Code'} />
                                                    <Pill title={`${refreshments}`} description={'Refreshments'} />
                                                    <Pill title={`${otherInfo}`} description={'Other Info'} />
                                                    <Pill title={`${date}`} description={'Date'} />
                                                    <button
                                                        onClick={() => {
                                                            setEdit(true);
                                                        }}
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
                                                                flex
                                                                flex-row
                                                                justify-center
                                                            "
                                                    >
                                                        Edit
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>

                                                    </button>
                                                </div>
                                                <div>
                                                    <div className="mb-6">
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            placeholder={'Full Name'}
                                                            onChange={(e) => {
                                                                setName(e.target.value);
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
                                                            placeholder={'Email'}
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
                                                    <div className="mb-6">
                                                        <input
                                                            type="text"
                                                            value={phone}
                                                            placeholder={'Phone'}
                                                            onChange={(e) => {
                                                                setPhone(e.target.value);
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
                                                        <button
                                                            onClick={() => {
                                                                addBooking();
                                                            }}
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
                                                    "
                                                        >
                                                            Add Booking
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='md:col-span-2'>
                                                    <div className=' bg-white  rounded-md'>
                                                        <input
                                                            type="text"
                                                            placeholder="Search "
                                                            onChange={(e) => {
                                                                setSearch(e.target.value)
                                                            }}
                                                            onFocus={() => {
                                                                setTempAllBookings(allBookings);
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
                                                            onKeyDown={handleKeyDown}
                                                        />

                                                    </div>
                                                    <div className='min-h-screen h-full'>
                                                        <div className="overflow-x-auto whitespace-nowrap mb-12 min-h-screen">
                                                            {tableLoading ?

                                                                <div className='flex flex-col items-center content-center'>
                                                                    <Loader />
                                                                </div>
                                                                : <table className="table-auto border-separate border-spacing-1 w-full h-full">
                                                                    <thead className='bg-[#00947a] text-white font-bold w-full '>
                                                                        <tr>
                                                                            {bookingTopics.map((v: any) => (
                                                                                <th key={v} className='text-left'>{v}</th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            tempAllBookings.map((value, index) => {
                                                                                return (
                                                                                    <tr key={index}
                                                                                        className={'odd:bg-white even:bg-slate-50 '}>

                                                                                        <td>{getData(value.name)}</td>
                                                                                        <td>{getData(value.email)}</td>
                                                                                        <td>{getData(value.phone)}</td>

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
                                                                                                                                onClick={() => {

                                                                                                                                    if (typeof value.name !== 'undefined' && value.name !== "") {

                                                                                                                                        setName(getData(value.name));
                                                                                                                                        setEmail(getData(value.email));
                                                                                                                                        setPhone(getData(value.phone));
                                                                                                                                        addBookingDataFromTable(getData(value.name), getData(value.phone), getData(value.email));


                                                                                                                                    }
                                                                                                                                }}
                                                                                                                                className={`${active
                                                                                                                                    ? "bg-gray-100 text-gray-900"
                                                                                                                                    : "text-gray-700"
                                                                                                                                    } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                                                            >
                                                                                                                                Add To Event
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
                                                                </table>}
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        }

                                    </div>
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <div className='min-h-screen h-full'>
                                        <div className="overflow-x-auto whitespace-nowrap mb-12 min-h-screen">
                                            <table className="table-auto border-separate border-spacing-1 w-full h-full">
                                                <thead className='bg-[#00947a] text-white font-bold w-full '>
                                                    <tr>
                                                        {topics.map((v: any) => (
                                                            <th key={v} className='text-left'>{v}</th>
                                                        ))}
                                                    </tr>


                                                </thead>
                                                <tbody>

                                                    {
                                                        bookings.map((value, index) => {
                                                            return (
                                                                <tr key={index}
                                                                    className={'odd:bg-white even:bg-slate-50 '}>

                                                                    <td>{getData(value.name)}</td>
                                                                    <td>{getData(value.email)}</td>
                                                                    <td>{getData(value.phone)}</td>
                                                                    <td>{value.attended ? "Attended" : "Not Attended"}</td>
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
                                                                                                            onClick={() => { if (typeof value.name !== 'undefined') markAttended(value); }}
                                                                                                            className={`${active
                                                                                                                ? "bg-gray-100 text-gray-900"
                                                                                                                : "text-gray-700"
                                                                                                                } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                                        >
                                                                                                            Mark Attended
                                                                                                        </button>

                                                                                                    )}
                                                                                                </Menu.Item>
                                                                                            </div>
                                                                                            <div className="py-1">

                                                                                                <Menu.Item>
                                                                                                    {({ active }) => (
                                                                                                        <button
                                                                                                            onClick={() => { if (typeof value.name !== 'undefined') setOpenDialog(true); setNotesMember(value); }}
                                                                                                            className={`${active
                                                                                                                ? "bg-gray-100 text-gray-900"
                                                                                                                : "text-gray-700"
                                                                                                                } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                                        >
                                                                                                            Notes
                                                                                                        </button>
                                                                                                    )}
                                                                                                </Menu.Item>
                                                                                            </div>
                                                                                            <div className="py-1">

                                                                                                <Menu.Item>
                                                                                                    {({ active }) => (
                                                                                                        <button
                                                                                                            onClick={() => { if (typeof value.name !== 'undefined') deleteBooking(value); }}
                                                                                                            className={`${active
                                                                                                                ? "bg-gray-100 text-gray-900"
                                                                                                                : "text-gray-700"
                                                                                                                } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                                                                                        >
                                                                                                            Delete Booking
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
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setLoading(true);
                                                    var exlD: any[] = [];
                                                    bookings.forEach(element => {
                                                        var ntes = element.notes.map((v) => getData(v));
                                                        const object = {
                                                            name: getData(element.name),
                                                            email: getData(element.email),
                                                            phone: getData(element.phone),
                                                            attended: element.attended,
                                                            notes: ntes.toString()
                                                        };
                                                        exlD.push(object);
                                                    });

                                                    downloadExcel(exlD, `${title}-${date}`);
                                                    setLoading(false);
                                                }}
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
                                                "
                                            >Download Table as Excel File</button>
                                        </div>
                                    </div>

                                </Tab.Panel>


                            </Tab.Panels>
                        </Tab.Group>






                    </div>
                }



            </div>
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

                                    <div>
                                        {typeof notesMember !== "undefined" ? notesMember.notes.map((v: any) => {
                                            return (
                                                <p className='p-4 shadow-2xl rounded-[20px]' key={v}>{getData(v)}</p>
                                            )
                                        }) : <p></p>}
                                    </div>
                                </div>



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


export default EventBooking
