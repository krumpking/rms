import React, { useEffect, useState } from 'react'
import { FC } from 'react';

interface MyProps {
    description: string,
    num: number
}



const DataSummary: FC<MyProps> = ({ description, num }) => {





    return (

        <div className='grid grid-cols-12 shadow-2xl rounded-r-[30px] rounded-l-[20px] h-16 w-full'>
            <div className='bg-[#00947a] col-span-1 rounded-l-[30px] border'>

            </div>
            <div className="p-4 col-span-11 grid grid-cols-12">
                <p className='font-bold col-span-10'>{description}</p>
                <p className='font-bold col-span-2 text-[#00947a]'>{num}</p>
            </div>
        </div>



    )
};


export default DataSummary