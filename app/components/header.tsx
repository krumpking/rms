import React, { useState } from 'react'
import { FC } from 'react';
import { FIFTH_COLOR, WHATSAPP_CONTACT } from '../constants/constants';
import Carousel from './carousel';
import Link from 'next/link';
import PrimaryButton from './primaryButton';
import MainCarousel from './mainCarousel';




const Header = () => {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-10 p-4' >
            <div className='col-span-4 lg:col-span-5  lg:p-0 flex flex-col m-4    afterMini:bg-none afterMini:border-none p-4'>
                <h1 className='text-white xxs:text-2xl xs:text-3xl font-extrabold m-8 w-11/12'>Rest  <span className='text-yellow-500'>Assured </span> </h1>


                <ul className='text-white text-lg mt-8 ml-8 mr-8 list-disc'>
                    <li>Say bye to hours spent manually creating reports <span className='text-yellow-500'>hello software automation</span> </li>
                    <li>Say bye to hours spent manually collecting info <span className='text-yellow-500'>hello digital collection of data</span></li>
                    <li>Say bye to insecure records and files <span className='text-yellow-500'>hello bank level protection of records</span></li>
                </ul>

                <p className='text-white text-lg mt-8 ml-8 mr-8'>We can build on top of what we have and have <span className='text-yellow-500'>Customized Software</span> for your organization for only 45USD per month</p>

                <div className='mt-8 ml-8 mr-8 flex flex-row justify-start text-center'>
                    <button className={`bg-[#fdc92f] rounded-[30px] p-2 text-center`}>
                        <Link className='text-xl  text-[#7d5c00] text-center ' href='/signup'>Start Free trial</Link>
                    </button>
                    <Link href="#benefits"><p className="m-2 text-white p-2 text-xl">See more</p></Link>

                </div>
            </div>
            <div className='col-span-6 lg:col-span-5 w-full'>
                <MainCarousel />
            </div>

        </div>
    )
};


export default Header
