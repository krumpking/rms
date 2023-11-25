import React, { Fragment, useEffect, useState } from 'react';
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import AppAccess from '../app/components/accessLevel';
import { IWebsite } from '../app/types/websiteTypes';
import { Dialog, Transition } from '@headlessui/react';
import {
	addDocument,
	getOneDocument,
	updateDocument,
} from '../app/api/mainApi';
import { WEBSITE_COLLECTION } from '../app/constants/websiteConstants';
import WebOne from '../app/components/website/webOne/webOne';
import { useAuthIds } from '../app/components/authHook';
import Head from 'next/head';

const WebFront = () => {
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { adminId, userId, access } = useAuthIds();
	const [webs, setWebs] = useState<IWebsite[]>([
		{
			id: '',
			websiteId: '',
			adminId: 'adminId',
			userId: '',
			websiteName: '',
			chosenWebsiteNo: 1,
			src: 'images/webOne.png',
			date: new Date(),
			dateString: '',
		},
	]);
	const [chooseWebsite, setChooseWebsite] = useState<IWebsite>({
		id: '',
		websiteId: '',
		adminId: 'adminId',
		userId: '',
		websiteName: 'Flair',
		chosenWebsiteNo: 1,
		src: 'images/webOne.png',
		date: new Date(),
		dateString: '',
	});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
	}, []);

	const getSelectedWebsite = () => {
		getOneDocument(WEBSITE_COLLECTION, adminId)
			.then((v) => {
				if (v !== null) {
					let el = v.data.data();
					setChooseWebsite({
						id: v.data.id,
						websiteId: el.id,
						adminId: el.adminId,
						userId: el.userId,
						websiteName: el.websiteName,
						chosenWebsiteNo: el.chosenWebsiteName,
						src: el.src,
						date: el.date,
						dateString: el.dateString,
					});
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getView = (index: number) => {
		switch (index) {
			case 1:
				return <WebOne />;
			default:
				return <p></p>;
		}
	};

	const addWebsite = async () => {
		setOpen(false);
		setLoading(true);
		addDocument(WEBSITE_COLLECTION, chooseWebsite)
			.then((v) => {
				toast.success('Website selected');
				getSelectedWebsite();
			})
			.catch((e: any) => {
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const editWebsite = async () => {
		let newItem = { ...chooseWebsite, dateOfUpdate: new Date().toDateString() };

		setOpen(false);
		setLoading(true);
		updateDocument(WEBSITE_COLLECTION, chooseWebsite.id, newItem)
			.then((v) => {
				toast.success('Website successfully updated');
				setOpen(false);
			})
			.catch((e: any) => {
				setOpen(false);
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	return (
		<div>
			<AppAccess access={access} component={'website'}>
				<div>
					<div className='flex flex-col min-h-screen h-full'>
						<div className='lg:col-span-3' id='nav'>
							<ClientNav organisationName={'FoodiesBooth'} url={'web'} />
						</div>

						{loading ? (
							<div className='flex flex-col justify-center items-center w-full col-span-9'>
								<Loader color={''} />
							</div>
						) : (
							<div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8'>
								{/* <h1 className='font-bold'>Choose your website</h1> */}
								<h1>Edit your website</h1>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									{webs.map((v) => (
										<div
											className='shadow-2xl h-72 rounded-[25px] flex flex-col p-4    '
											onClick={() => {
												setChooseWebsite(v);
												setOpen(true);
											}}
										>
											<div className='flex justify-between'>
												<h1 className='text-xl font-bol'>{v.websiteName}</h1>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													stroke-width='1.5'
													stroke='currentColor'
													className='w-6 h-6'
												>
													<path
														stroke-linecap='round'
														stroke-linejoin='round'
														d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
													/>
												</svg>
											</div>
											<img src={v.src} className='h-48 mb-6' />
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					<Transition appear show={open} as={Fragment}>
						<Dialog
							as='div'
							className='fixed inset-0 z-10 overflow-y-auto w-full'
							onClose={() => setOpen(false)}
						>
							<div className='min-h-screen px-1 md:px-4 text-center backdrop-blur-sm '>
								<Transition.Child
									as={Fragment}
									enter='ease-out duration-300'
									enterFrom='opacity-0'
									enterTo='opacity-100'
									leave='ease-in duration-200'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'
								>
									<Dialog.Overlay className='fixed inset-0' />
								</Transition.Child>

								<span
									className='inline-block h-screen align-middle'
									aria-hidden='true'
								>
									&#8203;
								</span>
								<Transition.Child
									as={Fragment}
									enter='ease-out duration-300'
									enterFrom='opacity-0 scale-95'
									enterTo='opacity-100 scale-100'
									leave='ease-in duration-200'
									leaveFrom='opacity-100 scale-100'
									leaveTo='opacity-0 scale-95'
								>
									<div className='bg-white my-8 inline-block w-full transform overflow-hidden rounded-2xl p-1 md:p-6 text-left align-middle shadow-xl transition-all'>
										<Dialog.Title
											as='h3'
											className='text-sm font-medium leading-6 text-gray-900 m-4 flex justify-between'
										>
											<h1 className='text-2xl font-bold underline'>
												{chooseWebsite.websiteName}
											</h1>
											{/* <button
                                            onClick={() => {
                                                addWebsite();
                                            }}
                                            className="
                                                font-bold
                                                w-1/6
                                                rounded-[25px]
                                                border-2
                                                border-[#8b0e06]
                                                border-primary
                                                py-3
                                                px-10
                                                bg-[#8b0e06]
                                                text-base
                                                text-white
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition
                                            "
                                        >
                                            Select Website
                                        </button> */}
										</Dialog.Title>

										<div className='w-full border-2 rounded-[15px]'>
											{getView(chooseWebsite.chosenWebsiteNo)}
										</div>
									</div>
								</Transition.Child>
							</div>
						</Dialog>
					</Transition>
					<ToastContainer position='top-right' autoClose={5000} />
				</div>
			</AppAccess>
		</div>
	);
};

export default WebFront;
