export type IWebsite = {
    id: string,
    websiteId: number,
    adminId: string,
    userId: string,
    title: string,
    src: string,
}


export type IWebsiteOneInfo = {
    id: string,
    websiteId: number,
    adminId: string,
    userId: string,
    title: string,
    logo: any,
    serviceProviderName: string,
    headerTitle: string,
    headerText: string,
    headerImage: any
    aboutUsImage: any,
    aboutUsTitle: string,
    aboutUsInfo: string,
    themeMainColor: string,
    themeSecondaryColor: string,
    reservation: boolean,
    contactUsImage: any
    email: string,
    address: string,
    phone: string,


}


export type IContact = {
    id: string,
    adminId: string,
    userId: string,
    name: string,
    phone: string,
    email: string,
    message: string
}
