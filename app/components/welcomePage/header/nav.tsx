import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { FIFTH_COLOR, PRIMARY_COLOR } from '../../../constants/constants';
import { Transition } from '@headlessui/react';

const Nav = () => {
	const [navItems, setNavItems] = useState([
		{
			name: 'Market Place',
			url: '/booths',
		},
		{
			name: 'Services',
			url: '#services',
		},
		{
			name: 'Pricing',
			url: '#pricing',
		},
		{
			name: 'Log In',
			url: '/login',
		},
	]);
	const [res, setRes] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav>
			<div className=' mx-auto px-4 sm:px-6 lg:px-8 justify-center content-center  items-center'>
				<div className='hidden nineSixteen:block'>
					<div className='flex items-center justify-between p-4 content-center'>
						<div className='flex flex-row justify-center content-center items-center'>
							<img src='images/logo.png' className='h-14 w-14' />
						</div>

						<div className='flex items-baseline flex-row justify-end space-x-4 '>
							{navItems.map((v, index) => {
								return (
									<div className={`bg-white rounded-[25px] p-2`} key={index}>
										<a
											className={
												'md:text-xs 2xl:text-xl text-center  p-1 lg:p-4'
											}
											style={{ color: PRIMARY_COLOR }}
											href={v.url}
										>
											{v.name}
										</a>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className='nineSixteen:hidden'>
					<div className='flex items-center justify-between p-4'>
						<div className='flex-shrink-0'>
							<img src='images/logo.png' className='h-14 w-14' />
						</div>
						<div className='-mr-2 flex '>
							<button
								onClick={() => setIsOpen(!isOpen)}
								type='button'
								style={{ backgroundColor: PRIMARY_COLOR }}
								className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
								aria-controls='mobile-menu'
								aria-expanded='false'
							>
								<span className='sr-only'>Open main menu</span>
								{!isOpen ? (
									<svg
										className='block h-6 w-6'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										aria-hidden='true'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M4 6h16M4 12h16M4 18h16'
										/>
									</svg>
								) : (
									<svg
										className='block h-6 w-6'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										aria-hidden='true'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<Transition
				show={isOpen}
				enter='transition ease-out duration-100 transform'
				enterFrom='opacity-0 scale-95'
				enterTo='opacity-100 scale-100'
				leave='transition ease-in duration-75 transform'
				leaveFrom='opacity-100 scale-100'
				leaveTo='opacity-0 scale-95'
			>
				{(ref) => (
					<div className='nineSixteen:hidden' id='mobile-menu'>
						<div
							ref={ref}
							style={{ backgroundColor: PRIMARY_COLOR }}
							className='flex flex-col px-2 pt-2 pb-3 space-y-1 
                            sm:px-3 shadow-lg rounded-lg p-4'
						>
							{navItems.map((v, index) => {
								if (index === 3 || index === 4) {
									return (
										<div className={`bg-[#fff] rounded-[20px] p-2`} key={index}>
											<a
												style={{ color: PRIMARY_COLOR }}
												className='smXS:text-xs md:text-sm afterMini:text-xs xl:text-xl text-center p-4'
												href={v.url}
											>
												{v.name}
											</a>
										</div>
									);
								} else {
									return (
										<a
											className='text-white space-x-1 smXS:text-xs md:text-sm afterMini:text-xs   xl:text-xl  p-2'
											href={v.url}
											key={index}
										>
											{v.name}
										</a>
									);
								}
							})}
						</div>
					</div>
				)}
			</Transition>
		</nav>
	);
};

export default Nav;
