import React, { useEffect, useState } from 'react'
import { FC } from 'react';
import { print } from '../utils/console';


interface MyProps {
    title: string,
    description: string,
    date: string,
    priority: string,
    email: string
}



const TaskExpressed: FC<MyProps> = ({ title, description, date, priority, email }) => {




    const getColor = () => {
        if (priority == "High") {
            return "bg-red-500";
        } else if (priority == "Medium") {
            return "bg-orage-500";
        } else {
            return "bg-green-500"
        }

    }
    return (

        <div className='grid grid-cols-12 shadow-2xl rounded-r-[30px] rounded-l-[20px] h-fit w-full'>
            <div className={`${getColor()} col-span-1 rounded-l-[18px] border`}>

            </div>
            <div className="p-4  flex flex-col col-span-11">
                <p className={`text-sx text-white ${getColor()}`}>Priority {priority}</p>
                <p className='text-sx'>{date}</p>
                <h1>{title}</h1>
                <p className='text-xs w-48'>{description}</p>
                <p className='text-xs'>Email for reminder {email}</p>
            </div>
        </div>



    )
};


export default TaskExpressed