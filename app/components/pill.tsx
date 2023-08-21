import React, { useEffect, useState } from 'react'
import { FC } from 'react';


interface MyProps {
    title: string,
    description: string,

}



const Pill: FC<MyProps> = ({ title, description }) => {





    return (

        <div className='grid grid-cols-12 shadow-2xl rounded-r-[30px] rounded-l-[20px] h-fit w-full'>
            <div className='bg-[#00947a] col-span-1 rounded-l-[20px] border'>

            </div>
            <div className="p-4  flex flex-col col-span-11">
                <h1>{title}</h1>
                <p className='text-xs w-48'>{description}</p>
            </div>
        </div>



    )
};


export default Pill