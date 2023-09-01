export type ITransaction = {
    id: string,
    adminId: string,
    userId: string,
    transactionType: string,
    paymentMode: string,
    title: string,
    details: any,
    amount: number,
    customer: string,
    date: Date,
    dateString: string,
    file: any,
    currency: string
}