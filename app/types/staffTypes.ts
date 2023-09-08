import { DateTime } from "./types"

export type IShift = {
    id: string,
    adminId: string,
    user: any,
    date: Date,
    dateString: string,
    startDate: Date,
    endDate: Date,
    dateOfUpdate: Date,
    startTime: string,
    endTime: string,
    role: string,
    confirmed: boolean
}