import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { FC } from 'react';


interface MyProps {
    title: string,
    description: string
}



const TaskSummary: FC<MyProps> = ({ title, description }) => {
    const router = useRouter();




    return (

        <div className='grid grid-cols-12 shadow-2xl rounded-r-[30px] rounded-l-[20px] h-32 w-48 hover:cursor-pointer' onClick={() => { router.push("/crm") }}>
            <div className='bg-[#00947a] col-span-1 rounded-l-[30px] border'>

            </div>
            <div className="p-4  flex flex-col col-span-11">
                <h1>{title}</h1>
                <p className='text-xs w-48'>{description.substring(0, 20)}...</p>
            </div>
        </div>



    )
};


export default TaskSummary