import React, { FC } from 'react';

interface MyProps {
	children: any;
	isOpen: any;
	setIsOpen: any;
	bg: string;
	color: string;
}

const Drawer: FC<MyProps> = ({ children, isOpen, setIsOpen, bg, color }) => {
	return (
		<main
			className={
				' fixed overflow-hidden z-[100] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
				(isOpen
					? ' transition-opacity opacity-100 duration-500 translate-x-0 backdrop-blur-sm bg-white '
					: ' transition-all delay-500 opacity-0 translate-x-full  ')
			}
		>
			<section
				className={
					' w-screen max-w-lg right-0 absolute bg-transparent h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform   ' +
					(isOpen ? ' translate-x-0 ' : ' translate-x-full ')
				}
			>
				<article
					style={{ backgroundColor: bg }}
					className={
						' relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full  rounded-[25px] items-center shadow-md px-2 md:px-8'
					}
				>
					<button onClick={() => setIsOpen(false)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							style={{ color: color }}
							className='w-6 h-6 m-2'
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</button>
					{children}
				</article>
			</section>
		</main>
	);
};

export default Drawer;
