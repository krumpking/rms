import { DateTime } from "./types"

export type IShift = {
    id: string,
    userId: string,
    adminId: string,
    user: any,
    date: Date,
    dateString: string,
    startDate: string,
    endDate: string,
    dateOfUpdate: Date,
    startTime: string,
    endTime: string,
    role: string,
    confirmed: boolean
}


export type ILog = {
    id: string,
    userId: string,
    adminId: string,
    user: any,
    date: Date,
    dateString: string,
    month: string,
    hours: number
}