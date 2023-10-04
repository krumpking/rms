import React, { FC } from 'react';
import { Grid } from 'react-loader-spinner';
import { PRIMARY_COLOR } from '../constants/constants';

interface MyProps {
	color: string;
}

const Loader: FC<MyProps> = ({ color }) => {
	if (color === '') {
		return (
			<div className='flex flex-col justify-center items-center w-full content-center h-screen'>
				<img
					src='images/loading.png'
					className='w-full md:w-1/3 h-48 animate-bounce'
				/>
			</div>
		);
	} else {
		return (
			<Grid
				height='100'
				width='100'
				color={color}
				ariaLabel='grid-loading'
				radius='12.5'
				wrapperStyle={{}}
				wrapperClass=''
				visible={true}
			/>
		);
	}
};

export default Loader;
