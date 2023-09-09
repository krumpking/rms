import { Calendar, type View, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { print } from '../../utils/console';
import React from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, COOKIE_ID } from '../../constants/constants';
import { decrypt, encrypt } from '../../utils/crypto';
import { getMyEvents } from '../../api/bookingsApi';
import { IAttendee } from '../../types/bookingsTypes';
import Head from 'next/head';
import { getDataFromDBTwo } from '../../api/mainApi';
import { SHIFT_COLLECTION } from '../../constants/staffConstants';
import DateMethods from '../../utils/date';
import { addDays } from 'date-fns';

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
                    backgroundColor: '#8b0e06',
                },
            }),
            ...(isSelected && {
                style: {
                    backgroundColor: '#8b0e06',
                },
            })
        }),
        []
    );
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [adminId, setAdminId] = useState("");


    useEffect(() => {

        getDataFromDBTwo(SHIFT_COLLECTION, AMDIN_FIELD, adminId, 'confirmed', true).then((v) => {
            if (v !== null) {
                v.data.forEach(element => {
                    let d = element.data();
                    let repeats = DateMethods.diffDatesDays(d.startDate, d.endDate);
                    for (let index = 0; index < repeats; index++) {
                        let dateNext = new Date(addDays(new Date(d.startDate), index))
                        setEvents(events => [...events, {
                            id: element.id,
                            title: d.user.name,
                            allDay: false,
                            start: new Date(dateNext.toDateString() + ' ' + d.startTime),
                            end: new Date(dateNext.toDateString() + ' ' + d.endTime),
                        }]);


                    }
                });
            }


        }).catch((e) => {
            console.error(e);

        });




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
                // onSelectEvent={((e) => {
                //     router.push(`/eventBooking/${encrypt(e.id, COOKIE_ID)}`)
                // })}
                // onView={onView}
                views={["month", "week", "day", "agenda"]}
                style={{
                    color: '#8b0e06',
                    height: 700
                }}
            />
        </>
    )
}

export default BasicCalendar