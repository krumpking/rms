import React from 'react'
import { FC } from 'react';

interface MyProps {
    text: string,
    clickEvent: () => void,
}


const PrimaryButton: FC<MyProps> = ({ text, clickEvent }) => {
    return (
        <button
            className='bg-sky-400 h-10 rounded-[30px] px-4 text-white font-bold mx-2 w-48'
            onClick={() => clickEvent()}>
            {text}
        </button>
    )
};


export default PrimaryButton
