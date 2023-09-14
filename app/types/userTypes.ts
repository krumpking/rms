export type IUser = {
    id: string,
    userId: string,
    adminId: string,
    access: string[],
    date: Date,
    dateOfUpdate: Date,
    dateString: string,
    name: string,
    contact: string,
    email: string,

}





export type IClient = {
    id: any,
    adminId: any,
    date: any,
    dateString: any,
    name: any,
    contact: any,
    organisation: any,
    stage: any,
    notes: any[],
    refSource: any,
    enquired: any[],
    value: any
}





