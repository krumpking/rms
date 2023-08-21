



export type IBookingEvent = {
    adminId: any,
    id: any,
    created: any,
    title: any,
    date: any,
    endDate: any,
    dateString: any,
    description: any,
    time: any,
    venue: any,
    directions: any,
    parking: any,
    refreshments: any,
    dressCode: any,
    otherInfo: any,
    encryption: number,
    bookings: IAttendee[]

}


export type IAttendee = {
    eventId: any,
    name: any,
    phone: any,
    email: any,
    attended: boolean,
    notes: any[]

}