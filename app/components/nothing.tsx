import React from 'react'
import { FC } from 'react';

interface MyProps {
    text: string
}


const Nothing: FC<MyProps> = ({ text }) => {
    return (
        <div className="m-auto w-full p-4">
            <p className='font-extrabold text-center text-2xl w-full'>It looks like there are no {text} yet</p>
        </div>
    )
};


export default Nothing
