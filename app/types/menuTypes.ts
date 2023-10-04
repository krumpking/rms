export type ICategory = {
    id: string,
    adminId: string,
    userId: string,
    category: string,
    pic: any,
    date: Date,
    dateString: string
};


export type IMenuItem = {
    id: string,
    adminId: string,
    userId: string,
    category: string,
    title: string,
    description: string,
    discount: number,
    pic: any,
    date: Date,
    dateString: string,
    price: number
}


export type IMeal = {
    id: string,
    adminId: string,
    userId: string,
    category: string,
    menuItems: IMenuItem[],
    title: string,
    description: string,
    discount: number,
    date: Date,
    dateString: string,
    price: number,
    pic: any
}
