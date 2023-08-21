import { Calendar, type View, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { print } from '../utils/console';
import React from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { getMyEvents } from '../api/bookingsApi';
import { IAttendee } from '../types/bookingsTypes';
import Head from 'next/head';

const localizer = momentLocalizer(moment);

// const events = [

//     {
//         id: 14,
//         title: 'Today',
//         start: new Date(new Date().setHours(new Date().getHours() - 3)),
//         end: new Date(new Date().setHours(new Date().getHours() + 3)),
//     },
//     {
//         id: 15,
//         title: 'Point in Time Event',
//         start: new Date(),
//         end: new Date(),
//         style: {
//             backgroundColor: '#000',
//         },
//     },

// ]


const BasicCalendar = () => {
    const [date, setDate] = useState(new Date())
    const eventPropGetter = useCallback(
        (event: any, start: any, end: any, isSelected: any) => ({
            ...(!isSelected && {
                style: {
                    backgroundColor: '#00947a',
                },
            }),
            ...(isSelected && {
                style: {
                    backgroundColor: '#0fa991',
                },
            })
        }),
        []
    );
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);


    useEffect(() => {



        getMyEvents().then((res) => {

            if (res !== null) {

                var infoFromCookie = "";
                if (getCookie(ADMIN_ID) == "") {
                    infoFromCookie = getCookie(COOKIE_ID);
                } else {
                    infoFromCookie = getCookie(ADMIN_ID);
                }
                let id = decrypt(infoFromCookie, COOKIE_ID);


                var ev: any[] = [];

                res.data.forEach(element => {
                    let d = element.data();
                    let h = decrypt(d.time, id).toString().split(":");
                    ev.push({
                        id: element.id,
                        title: decrypt(d.title, id),
                        allDay: true,
                        start: new Date(d.dateString).setHours(parseInt(h[0]), parseInt(h[1]), 0),
                        end: new Date(d.endDate),
                    })
                });

                setEvents(ev);
            }



        }).catch(console.error);



    }, []);




    const onNavigate = useCallback((newDate: SetStateAction<Date>) => setDate(newDate), [setDate])
    return (
        <>
            <Head>
                <meta name="viewport" content="width=978"></meta>
            </Head>
            <Calendar
                // components={components}
                defaultView="month"
                date={date}
                events={events}
                localizer={localizer}
                eventPropGetter={eventPropGetter}
                onNavigate={onNavigate}
                onSelectEvent={((e) => {
                    router.push(`/eventBooking/${encrypt(e.id, COOKIE_ID)}`)
                })}
                // onView={onView}
                views={["month", "week", "day", "agenda"]}
                style={{
                    color: '#00947a',
                    height: 700
                }}
            />
        </>
    )
}

export default BasicCalendar