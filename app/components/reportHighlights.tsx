import React, { useEffect, useState } from 'react'
import { FC } from 'react';


interface MyProps {
    title: string,
    description: string
}



const ReportHighlight: FC<MyProps> = ({ title, description }) => {


    const getFontSize = () => {
        if (description.length < 3) {
            return 'text-4xl';
        } else if (description.length < 6) {
            return 'text-4xl';
        } else if (description.length < 12) {
            return 'text-xl';
        } else {
            return 'text-base';
        }
    }


    return (

        <div className='grid grid-cols-12 shadow-2xl rounded-r-[30px] rounded-l-[20px] h-24 w-48'>
            <div className='bg-[#00947a] col-span-1 rounded-l-[30px] border'>

            </div>
            <div className="p-4  flex flex-col col-span-11 ">
                <h1>{title}</h1>
                <h1 className={`${getFontSize()} w-full text-center`}>{description}</h1>
            </div>
        </div>


    )
};


export default ReportHighlight