

export type IStockCategory = {
    id: string,
    adminId: string,
    userId: string,
    category: string,
    date: Date,
    dateString: string
};


export type IStockItem = {
    id: string,
    adminId: string,
    userId: string,
    category: string,
    title: string,
    details: any,
    itemNumber: number,
    date: Date,
    dateString: string,
    dateOfUpdate: string,
    status: string
    confirmed: boolean

}