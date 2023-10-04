import React from 'react';
import { FC } from 'react';
import { PRIMARY_COLOR } from '../constants/constants';

interface MyProps {
	text: string;
}

const Nothing: FC<MyProps> = ({ text }) => {
	return (
		<div
			className=' w-full h-screen p-4 md:p-8 2xl:p-16'
			style={{ backgroundColor: PRIMARY_COLOR }}
		>
			<div className='bg-white h-full rounded-[25px] flex flex-col items-center justify-center'>
				<a href={'https://foodiesbooth.com'}>
					<img src='images/logo.png' />
					<h1 className='underline text-center'>Home</h1>
				</a>
				<p className='font-extrabold text-center text-2xl mb-6'>{text}</p>
			</div>
		</div>
	);
};

export default Nothing;
