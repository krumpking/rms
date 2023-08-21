import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { createId } from '../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, PERSON_ROLE } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { addAClientToDB } from '../api/crmApi';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import { print } from '../utils/console';
import { useRouter } from 'next/router';
import { IBookingEvent } from '../types/bookingsTypes';
import { addBookingEvent } from '../api/bookingsApi';
import { getOrgInfoFromDB } from '../api/orgApi';

const AddBookingEvent = () => {
    const [date, setDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [directions, setDirections] = useState('');
    const [parking, setParking] = useState("");
    const [refreshments, setRefreshments] = useState("");
    const [otherInfo, setOtherInfo] = useState("");
    const [dressCode, setDressCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);


    useEffect(() => {
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
                if (roleTitle !== "Admin") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }
                getOrgInfo();

            }
        }



    }, []);


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

                    if (typeof element.data().venues !== "undefined") {

                        let venuesA: any = [];
                        element.data().venues.forEach((e: any) => {
                            venuesA.push(decrypt(e, id));
                        });
                        setVenues(venuesA);
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



            addBookingEvent(booking).then((r) => {
                setLoading(false);
                toast.success('Event added Successfully');
            }).catch((e) => {
                toast.error('There was an error adding event, please try again');
                console.error(e)
            });

        }
    };

    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-col-1 md:grid-cols-2 gap-4">
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
                                    focus:border-primary' onClick={(e) => e.preventDefault()}>
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
                                    "
                        />
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
                            Add Event
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default AddBookingEvent;
