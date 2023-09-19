import React, { useState } from 'react'
import { FC } from 'react';
import { FIFTH_COLOR, PRIMARY_COLOR, WHATSAPP_CONTACT } from '../../../constants/constants';
import Carousel from '../../carousel';
import Link from 'next/link';
import PrimaryButton from '../../primaryButton';
import MainCarousel from '../../mainCarousel';
import Nav from './nav';
import { useRouter } from 'next/router';




const Header = () => {
    const router = useRouter();

    return (
        <div className="w-screen h-screen bg-cover  bg-headerImage bg-no-repeat flex flex-col">

            <Nav />
            <div className="flex flex-col p-8 space-y-10 mt-20">
                <div className="flex flex-col w-1/3 space-y-3">
                    <h1 className='text-2xl'>Become the best Food Business</h1>
                    <p>FoodiesBooth will take care of all your operations, from menu creation, order management, stock management, cash management, staff management.You focus on what you do best<span style={{ color: PRIMARY_COLOR }}> Cooking, Baking and Serving</span></p>
                    <div className='flex flex-row'>
                        <button
                            onClick={() => { router.push('/signup') }}
                            style={{ backgroundColor: PRIMARY_COLOR }}
                            className='font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-primary
                                        py-3
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition'>
                            Get Started for Free

                        </button>
                        <button
                            onClick={() => { router.push('#services') }}
                            style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            className='

                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-primary
                                        py-3
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition'>
                            Learn More

                        </button>
                    </div>

                </div>
                <div className="flex flex-col  w-1/3 space-y-4">
                    <h1 className='text-2xl'>Make every bite memorable</h1>
                    <p>Never waste hunger, make each bite a memory, by ordering from the <span style={{ color: PRIMARY_COLOR }}>best Food Businesses</span> in the country.</p>
                    <div className='flex flex-row'>
                        <button
                            onClick={() => { router.push('/booths') }}
                            style={{ backgroundColor: PRIMARY_COLOR }}
                            className='font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-primary
                                        py-3
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition'>
                            Order Now

                        </button>
                        <button
                            onClick={() => { router.push('/booths') }}
                            style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            className='

                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-primary
                                        py-3
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition'>
                            See Booths

                        </button>
                    </div>
                </div>
            </div>





        </div>

    )
};


export default Header
