import axios from 'axios';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner';
import Drawer from './drawer';
import { ADMIN_ID, COOKIE_EMAIL, COOKIE_ID, COOKIE_NAME, COOKIE_ORGANISATION, COOKIE_PHONE, DOWNLOAD_APP, PERSON_ROLE, URL_LOCK_ID, WHATSAPP_CONTACT } from '../constants/constants';
import { getCookie, setCookie } from 'react-use-cookie';
import { decrypt } from '../utils/crypto';
import { COOKIE_AFFILIATE_NUMBER } from '../constants/affilliateConstants';
import { print } from '../utils/console';
import { useRouter } from 'next/router';


interface MyProps {
    organisationName: string,
    url: string,
}

const ClientNav: FC<MyProps> = ({ organisationName, url }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [affiliateNo, setAffiliateNo] = useState(0);
    const [role, setRole] = useState("");
    const router = useRouter();

    useEffect(() => {
        document.body.style.backgroundColor = '#ECECEC';


        // var roleCookie = getCookie(PERSON_ROLE);

        // if (typeof roleCookie !== 'undefined') {

        //     if (roleCookie !== "") {

        //         var role = decrypt(getCookie(PERSON_ROLE), ADMIN_ID);
        //         print(role);
        //         setRole(role);

        //     }
        // }





    }, []);


    const logout = () => {
        setCookie(COOKIE_NAME, "");
        setCookie(COOKIE_PHONE, "");
        setCookie(COOKIE_ORGANISATION, "");
        setCookie(COOKIE_EMAIL, "");
        setCookie(COOKIE_ID, "");
        setCookie(ADMIN_ID, "");
        setCookie(PERSON_ROLE, "");
        setCookie(URL_LOCK_ID, "");
        router.push("/login");

    }



    return (
        <nav className='h-full'>

            <div className='flex flex-row-reverse  '>
                <button className='rounded-full shadow-2xl bg-[#8b0e06] p-4 m-4' onClick={() => setIsOpen(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-white w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </button>
                <Drawer isOpen={isOpen} setIsOpen={setIsOpen} bg={'bg-[#8b0e06]'}>
                    <div className='w-[200px]  p-4 flex justify-center items-center bg-white rounded-[25px] mt-4'>
                        <img src="/images/logo.png" className='h-24 w-24 my-6 rounded-xl' />
                    </div>
                    <h1 className='text-white font-bold mb-6'>{'FoodiesBooth'}</h1>
                    <div className='flex flex-col space-y-4'>

                        <a href={'/home'} className={url === 'home' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full '>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 col-span-1 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <h1 className='col-span-3 text-white'>Home</h1>
                            </div>
                        </a>
                        <a href={'/info'} className={`${url === 'info' ? 'bg-[#fc0109] p-2 rounded-[25px]' : 'p-2 rounded-[25px]'}`}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 col-span-1 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                </svg>


                                <h1 className='col-span-3 text-white'> Info</h1>
                            </div>
                        </a>
                        <a href={'/users'} className={`${url === 'users' ? 'bg-[#fc0109] p-2 rounded-[25px]' : 'p-2 rounded-[25px]'}`}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                </svg>


                                <h1 className='col-span-3 text-white'>Manage Users</h1>
                            </div>
                        </a>
                        <a href={'/menu'} className={url === 'menu' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                <h1 className='col-span-3 text-white'>Menu</h1>
                            </div>
                        </a>
                        <a href={'/orders'} className={url === 'orders' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Orders</h1>
                            </div>
                        </a>
                        <a href={'/receipting'} className={url === 'receipting' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>



                                <h1 className='col-span-3 text-white'>Payment Receipt</h1>
                            </div>
                        </a>
                        <a href={'/cashbook'} className={url === 'cashbook' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>



                                <h1 className='col-span-3 text-white'>Cash Book</h1>
                            </div>
                        </a>
                        <a href={'/inventory'} className={url === 'inventory' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Inventory</h1>
                            </div>
                        </a>
                        <a href={'/bookings'} className={url === 'bookings' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Reservations</h1>
                            </div>
                        </a>
                        <a href={'/staff'} className={url === 'staff' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Staff Management</h1>
                            </div>
                        </a>
                        <a href={'/web'} className={url === 'web' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Web Front</h1>
                            </div>
                        </a>
                        <a href={'/payments'} className={`${url === 'payments' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}`}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                                <h1 className='col-span-3 text-white'>My Payments</h1>
                            </div>
                        </a>
                        <a href={WHATSAPP_CONTACT} className={url === 'support' ? 'bg-[#fc0109] p-2 rounded-[25px] ' : 'p-2 rounded-[25px]'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                <h1 className='col-span-3 text-white'>Support</h1>
                            </div>
                        </a>
                        <a onClick={() => { logout() }} className={'p-2 rounded-[25px] hover:cursor-pointer'}>
                            <div className='grid grid-cols-4 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="col-span-1 w-6 h-6 text-white justify-self-center">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>

                                <h1 className='col-span-3 text-white'>Log Out</h1>
                            </div>
                        </a>
                        {/* <a href={DOWNLOAD_APP}
                            className='
                                font-bold
                                w-full
                                rounded-[25px]
                                border-2
                                bg-[#fc0109]
                                border-primary
                                py-2
                                px-5
                                bg-[#fc0109]
                                text-base
                                text-center
                                text-white
                                cursor-pointer
                                hover:bg-opacity-90
                                transition
                                '>
                            Download App
                        </a> */}
                        <Link href={'/privacyPolicy'}>
                            <p className='text-center text-xs text-gray-300 mb-4 font-bold underline'>Privacy Policy</p>
                        </Link>
                    </div>
                </Drawer>
            </div >
        </nav >

    )
};


export default ClientNav

