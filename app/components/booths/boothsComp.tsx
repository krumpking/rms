import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import MapPicker from 'react-google-map-picker';
import { IMeal, IMenuItem } from '../../types/menuTypes';
import {
	DEFAULT_LOCATION,
	WEBSITE_INFO_COLLECTION,
} from '../../constants/websiteConstants';
import { IOrder } from '../../types/orderTypes';
import { IWebsiteOneInfo } from '../../types/websiteTypes';
import { getDataFromAll } from '../../api/mainApi';
import { searchStringInArray } from '../../utils/arrayM';
import Loader from '../loader';
import {
	FOODIES_BOOTH_URL,
	PRIMARY_COLOR,
	PRIMARY_URL_LOCAL,
} from '../../constants/constants';
import ShowImage from '../showImage';

const BoothsComp = (props: {
	changeIndex: (info: IWebsiteOneInfo, index: number) => void;
}) => {
	const { changeIndex } = props;
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);
	const [boothsSto, setBoothsSto] = useState<IWebsiteOneInfo[]>([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		getWebsites();
	}, []);

	const getWebsites = () => {
		getDataFromAll(WEBSITE_INFO_COLLECTION)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setBooths((booths) => [
							...booths,
							{
								id: d.id,
								websiteName: d.websiteName,
								adminId: d.adminId,
								userId: d.userId,
								logo: d.logo,
								serviceProviderName: d.serviceProviderName,
								headerTitle: d.headerTitle,
								headerText: d.headerText,
								headerImage: d.headerImage,
								aboutUsImage: d.aboutUsImage,
								aboutUsTitle: d.aboutUsTitle,
								aboutUsInfo: d.aboutUsInfo,
								themeMainColor: d.themeMainColor,
								themeSecondaryColor: d.themeSecondayColor,
								reservation: d.reservation,
								contactUsImage: d.contactUsImage,
								email: d.email,
								address: d.adress,
								phone: d.phone,
								date: d.date,
								dateString: d.dateString,
								deliveryCost: d.deliveryCost,
								mapLocation: d.mapLocation,
								daysOfWork: d.daysOfWork,
								radius: d.radius,
								freeDeliveryAreas: d.freeDeliveryAreas,
								prepTime: d.prepTime,
								socialMedialinks: d.socialMedialinks,
							},
						]);
						setBoothsSto((booths) => [
							...booths,
							{
								id: d.id,
								websiteName: d.websiteName,
								adminId: d.adminId,
								userId: d.userId,
								logo: d.logo,
								serviceProviderName: d.serviceProviderName,
								headerTitle: d.headerTitle,
								headerText: d.headerText,
								headerImage: d.headerImage,
								aboutUsImage: d.aboutUsImage,
								aboutUsTitle: d.aboutUsTitle,
								aboutUsInfo: d.aboutUsInfo,
								themeMainColor: d.themeMainColor,
								themeSecondaryColor: d.themeSecondayColor,
								reservation: d.reservation,
								contactUsImage: d.contactUsImage,
								email: d.email,
								address: d.adress,
								phone: d.phone,
								date: d.date,
								dateString: d.dateString,
								deliveryCost: d.deliveryCost,
								mapLocation: d.mapLocation,
								daysOfWork: d.daysOfWork,
								radius: d.radius,
								freeDeliveryAreas: d.freeDeliveryAreas,
								prepTime: d.prepTime,
								socialMedialinks: d.socialMedialinks,
							},
						]);
					});
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	const handleKeyDown = (event: { key: string }) => {
		if (event.key === 'Enter') {
			searchFor();
		}
	};

	const searchFor = () => {
		setBooths([]);
		setLoading(true);
		if (search !== '') {
			let res: IWebsiteOneInfo[] = searchStringInArray(boothsSto, search);
			if (res.length > 0) {
				setTimeout(() => {
					setBooths(res);
					setLoading(false);
				}, 1500);
			} else {
				toast.info(`${search} not found `);
				setTimeout(() => {
					setBooths(boothsSto);
					setLoading(false);
				}, 1500);
			}
		} else {
			setTimeout(() => {
				setBooths(boothsSto);
				setLoading(false);
			}, 1500);
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-1 md:p-4 '>
					<div
						className='border rounded-[25px] w-full h-full'
						style={{ borderColor: PRIMARY_COLOR }}
					>
						<div
							style={{ backgroundColor: PRIMARY_COLOR }}
							className='h-12 p-2 rounded-t-[25px]'
						>
							<button
								onClick={() => {
									router.push('/');
								}}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke-width='1.5'
									stroke='currentColor'
									className='w-6 h-6 text-white'
								>
									<path
										stroke-linecap='round'
										stroke-linejoin='round'
										d='M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75'
									/>
								</svg>
							</button>
						</div>
						<div className='p-2 md:p-8'>
							<input
								type='text'
								value={search}
								placeholder={'Search for your favorite food business'}
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								style={{ borderColor: PRIMARY_COLOR }}
								className='
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        '
								onKeyDown={handleKeyDown}
							/>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 p-12'>
								{booths.map((v) => (
									<div className='relative shadow-2xl rounded-[25px] p-4 w-full'>
										<div className='p-4'>
											<p className='text-xl'>{v.serviceProviderName}</p>
											<div className='flex flex-col'>
												<div className='w-full'>
													<p className='text-md'>
														{v.aboutUsInfo.slice(0, 52)}...
													</p>
												</div>
												<div className='flex flex-row space-x-2'>
													<button
														onClick={() => {
															changeIndex(v, 1);
														}}
														className='relative rounded-full p-2'
														style={{ backgroundColor: PRIMARY_COLOR }}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															stroke-width='1.5'
															stroke='currentColor'
															className='w-6 h-6 text-white'
														>
															<path
																stroke-linecap='round'
																stroke-linejoin='round'
																d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
															/>
														</svg>
													</button>
													<button
														onClick={() => {
															router.push(
																`https://${v.websiteName}.foodiesbooth.com`
															);
														}}
														className='relative rounded-full p-2'
														style={{ backgroundColor: PRIMARY_COLOR }}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															stroke-width='1.5'
															stroke='currentColor'
															className='w-6 h-6 text-white'
														>
															<path
																stroke-linecap='round'
																stroke-linejoin='round'
																d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
															/>
														</svg>
													</button>
												</div>
											</div>
										</div>
										<div className='absolute -top-10 -left-10 right-10 z-10 '>
											<ShowImage
												src={`/${v.websiteName}/logo/${v.logo.thumbnail}`}
												alt={'Logo'}
												style={'rounded-full h-20 w-20 '}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default BoothsComp;
