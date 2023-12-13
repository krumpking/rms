import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../app/components/loader';
import {
	AMDIN_FIELD,
	PRIMARY_COLOR,
	PRIMARY_URL_LOCAL,
} from '../app/constants/constants';
import { IMeal, IMenuItem } from '../app/types/menuTypes';
import {
	DAYS_OF_THE_WEEK_ARRAY,
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
	WEBSITE_INFO_COLLECTION,
} from '../app/constants/websiteConstants';
import {
	addDocument,
	getDataFromAll,
	getDataFromDBOne,
	getNearest,
} from '../app/api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../app/constants/menuConstants';
import {
	findOccurrencesObjectId,
	searchStringInArray,
} from '../app/utils/arrayM';
import { IOrder } from '../app/types/orderTypes';
import ShowImage from '../app/components/showImage';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';
import { ORDER_COLLECTION } from '../app/constants/orderConstants';
import Drawer from '../app/components/drawer';
import { numberWithCommas } from '../app/utils/stringM';
import MapPicker from 'react-google-map-picker';
import { IWebsiteOneInfo } from '../app/types/websiteTypes';
import MarketPlace from '../app/components/market/marketPlace';
import BoothsComp from '../app/components/booths/boothsComp';
import DateMethods from '../app/utils/date';
import Head from 'next/head';
import { print } from '../app/utils/console';
import { Dialog, Transition } from '@headlessui/react';

const Market = () => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [meals, setMeals] = useState<IMeal[]>([]);
	const [mealsSto, setMealsSto] = useState<IMeal[]>([]);
	const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
	const [menuItemsSto, setMenuItemsSto] = useState<IMenuItem[]>([]);
	const [displayedItems, setDisplayedItems] = useState<any>([]);
	const [deliveryMethods, setDeliveryMethods] = useState([
		'Pick Up',
		'Delivery',
	]);
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [location, setLocation] = useState(DEFAULT_LOCATION);
	const [order, setOrder] = useState<IOrder>({
		id: '',
		adminId: 'adminId',
		userId: 'userId',
		orderNo: 0,
		items: [],
		status: 0,
		statusCode: '',
		totalCost: 0,
		deliveryMethod: 'Pick Up',
		clientId: '',
		customerName: '',
		customerEmail: '',
		customerPhone: '',
		customerAddress: '',
		deliveryLocation: null,
		tableNo: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		deliveryDate: new Date(),
		deliveryDateString: '',
		deliveryTime: '',
		deliveredSignature: null,
		deliverer: '',
		confirmed: false,
	});
	const [addItems, setAddItems] = useState<any[]>([]);
	const [websiteName, setWebsiteName] = useState('websitename');
	const [webfrontname, setWebfrontname] = useState('webfrontId');
	const [loadDist, setLoadDist] = useState(false);
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);
	const [index, setIndex] = useState(0);
	const [info, setInfo] = useState<IWebsiteOneInfo>({
		id: '',
		websiteName: '',
		adminId: '',
		userId: '',
		logo: {
			original: '',
			thumbnail: '',
		},
		serviceProviderName: '',
		headerImage: {
			original: '',
			thumbnail: '',
		},
		headerTitle: '',
		headerText: '',
		aboutUsImage: {
			original: '',
			thumbnail: '',
		},
		aboutUsTitle: '',
		aboutUsInfo: '',
		themeMainColor: '#8b0e06',
		themeSecondaryColor: '#8b0e06',

		reservation: true,
		contactUsImage: {
			original: '',
			thumbnail: '',
		},
		email: '',
		address: '',
		phone: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		deliveryCost: 0,
		mapLocation: DEFAULT_LOCATION,
		daysOfWork: DAYS_OF_THE_WEEK_ARRAY,
		radius: 50,
		prepTime: 48,
		socialMedialinks: [],
		freeDeliveryAreas: [],
	});
	const [menuItemsLoading, setMenuItemsLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
		getWebsites();
	}, []);

	const getWebsites = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				// const latitude = position.coords.latitude;
				// const longitude = position.coords.longitude;
				getDataFromAll(WEBSITE_INFO_COLLECTION)
					.then((v) => {
						if (v !== null) {
							let b: IWebsiteOneInfo[] = [];
							v.data.forEach((element) => {
								let d = element.data();

								let ifOpen = DateMethods.checkIfOpen(new Date(), d.daysOfWork);
								if (ifOpen) {
									let dis = computeDistanceBetween(
										new LatLng(location.lat, location.lng),
										new LatLng(d.mapLocation.lat, d.mapLocation.lng)
									);
									let finalD = dis / 1000;

									if (finalD < 51) {
										setBooths((meals) => [
											...meals,
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
												address: d.address,
												phone: d.phone,
												date: d.date,
												dateString: d.dateString,
												deliveryCost: d.deliveryCost,
												mapLocation: d.mapLocation,
												daysOfWork: d.daysOfWork,
												radius: d.radius,
												prepTime: d.prepTime,
												socialMedialinks: d.socialMedialinks,
												freeDeliveryAreas: d.freeDeliveryAreas,
											},
										]);

										b.push({
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
											address: d.address,
											phone: d.phone,
											date: d.date,
											dateString: d.dateString,
											deliveryCost: d.deliveryCost,
											mapLocation: d.mapLocation,
											daysOfWork: d.daysOfWork,
											radius: d.radius,
											prepTime: d.prepTime,
											socialMedialinks: d.socialMedialinks,
											freeDeliveryAreas: d.freeDeliveryAreas,
										});
									}
								}
							});
							getMenuItems(b);
						}
						setLoading(false);
					})
					.catch((e) => {
						console.error(e);
						setLoading(true);
					});
			});
		} else {
			console.log('Geolocation is not supported by this browser.');
			getDataFromAll(WEBSITE_INFO_COLLECTION)
				.then((v) => {
					if (v !== null) {
						let b: IWebsiteOneInfo[] = [];
						v.data.forEach((element) => {
							let d = element.data();

							let ifOpen = DateMethods.checkIfOpen(new Date(), d.daysOfWork);
							if (ifOpen) {
								setBooths((meals) => [
									...meals,
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
										address: d.address,
										phone: d.phone,
										date: d.date,
										dateString: d.dateString,
										deliveryCost: d.deliveryCost,
										mapLocation: d.lat,
										lng: d.lng,
										daysOfWork: d.daysOfWork,
										radius: d.radius,
										geohash: d.geohash,
										prepTime: d.prepTime,
										socialMedialinks: d.socialMedialinks,
										freeDeliveryAreas: d.freeDeliveryarea,
									},
								]);

								b.push({
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
									address: d.address,
									phone: d.phone,
									date: d.date,
									dateString: d.dateString,
									deliveryCost: d.deliveryCost,
									mapLocation: d.mapLocation,
									daysOfWork: d.daysOfWork,
									radius: d.radius,
									prepTime: d.prepTime,
									socialMedialinks: d.socialMedialinks,
									freeDeliveryAreas: d.freeDeliveryarea,
								});
							}
						});
						getMenuItems(b);
					}
					setLoading(false);
				})
				.catch((e) => {
					console.error(e);
					setLoading(true);
				});
		}
	};

	const getMenuItems = (b: IWebsiteOneInfo[]) => {
		setMenuItemsLoading(false);
		if (booths.length > 0) {
			console.log(booths.length);
		}
	};

	const handleKeyDown = (event: { key: string }) => {
		if (event.key === 'Enter') {
			searchFor();
		}
	};

	const searchFor = () => {
		setMenuItems([]);
		setMeals([]);
		setLoading(true);
		if (search !== '') {
			let res: IMenuItem[] = searchStringInArray(menuItemsSto, search);
			let results: IMeal[] = searchStringInArray(mealsSto, search);
			if (res.length > 0 || results.length > 0) {
				setTimeout(() => {
					setMenuItems(res);
					setMeals(results);
					setLoading(false);
				}, 1500);
			} else {
				toast.info(`${search} not found `);
				setTimeout(() => {
					setMenuItems(menuItemsSto);
					setMeals(mealsSto);
					setLoading(false);
				}, 1500);
			}
		} else {
			setTimeout(() => {
				setMenuItems(menuItemsSto);
				setMeals(mealsSto);
				setLoading(false);
			}, 1500);
		}
	};

	const getView = () => {
		return (
			<div
				className='border rounded-[25px] w-full min-h-screen h-full'
				style={{ borderColor: PRIMARY_COLOR }}
			>
				<div
					style={{ backgroundColor: PRIMARY_COLOR }}
					className='h-fit p-2 rounded-t-[20px] flex flex-col space-y-2 md:space-y-0  md:justify-between'
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
					<div className='flex justify-between space-x-4 px-1 md:px-4'>
						<button
							onClick={() => {
								// router.push('/signup');
								setIsLogin(false);
								setOpenDialog(true);
							}}
							style={{ color: PRIMARY_COLOR, borderColor: '#fff' }}
							className='font-bold
                                        w-48
                                        rounded-[25px]
                                        border-2
                                        py-2
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
										bg-white
										'
						>
							Register
						</button>
						<button
							onClick={() => {
								// router.push('/signup');
								setIsLogin(true);
								setOpenDialog(true);
							}}
							style={{ color: PRIMARY_COLOR, borderColor: '#fff' }}
							className='
										bg-white
                                        font-bold
                                        w-48
                                        rounded-[25px]
                                        border-2
                                        py-2
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition'
						>
							Login
						</button>
					</div>
				</div>
				<div className='flex items-center content-center items-center w-full'>
					<div
						x-data='{}'
						x-init="$nextTick(() => {
							let ul = $refs.logos;
							ul.insertAdjacentHTML('afterend', ul.outerHTML);
							ul.nextSibling.setAttribute('aria-hidden', 'true');
						})"
						className='w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] p-2'
					>
						<ul
							x-ref='logos'
							className='flex items-center justify-center [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll'
						>
							{booths.map((v) => (
								<li>
									<ShowImage
										src={`/${v.websiteName}/logo/${v.logo.thumbnail}`}
										alt={'Logo'}
										style={'rounded-[25px] h-20 w-20 '}
									/>
								</li>
							))}
						</ul>
					</div>
				</div>

				{menuItemsLoading ? (
					<Loader color={''} />
				) : (
					<MarketPlace
						info={booths}
						changeIndex={(index: number) => {
							setIndex(index);
						}}
						borderRadius={'rounded-[25px]'}
					/>
				)}
			</div>
		);
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-1 md:p-4 min-h-screen h-full'>
					{getView()}
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
			<Transition appear show={openDialog} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={() => {
						setOpenDialog(false);
					}}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black/25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='h3'
										className='text-lg font-medium leading-6 text-gray-900 px-4'
									></Dialog.Title>
									<div className='flex flex-col justify-between space-y-3 p-4 items-start bg-white text-black w-full'>
										{isLogin ? (
											<form
												className='flex flex-col content-center items-center justify-center'
												onSubmit={(e) => {
													e.preventDefault();
													login();
												}}
											>
												<div className='flex flex-col justify-center items-center'>
													<img src='images/logo.png' className='w-full h-32' />
												</div>
												<div className='mb-6 w-full'>
													<button
														className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
														onClick={(e) => e.preventDefault()}
													>
														<select
															value={category}
															onChange={(e) => {
																setCategory(e.target.value);
															}}
															className='bg-white w-full'
															data-required='1'
															required
														>
															<option value='Value' hidden>
																Select User Category
															</option>
															{USERS_CATEGORIES.map((v) => (
																<option value={v}>{v}</option>
															))}
														</select>
													</button>
												</div>
												<div className='mb-6 w-full'>
													<input
														type='text'
														value={sent ? accessCode : phone}
														placeholder={
															sent
																? 'Please enter the One Time Password'
																: 'Phone (include country your code )'
														}
														onChange={(e) => {
															if (sent) {
																setAccessCode(e.target.value);
															} else {
																setPhone(e.target.value);
															}
														}}
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
												'
														style={{ borderColor: PRIMARY_COLOR }}
														required
													/>
												</div>
												<div className='mb-10 w-full'>
													<input
														type='submit'
														value={sent ? 'Login' : 'Send One Time Password'}
														className='
												font-bold
												w-full
												rounded-[25px]
												border-2
												py-3
												px-5
												text-base 
												text-white
												cursor-pointer
												hover:bg-opacity-90
												transition
											'
														style={{
															backgroundColor: PRIMARY_COLOR,
															borderColor: PRIMARY_COLOR,
														}}
													/>
												</div>
											</form>
										) : (
											<form
												onSubmit={(e) => {
													e.preventDefault();
													signUp();
												}}
											>
												<p className='text-center text-xl text-black-300 mb-4 font-bold'>
													Start your 7 Day FREE trial
												</p>
												<div className='mb-6'>
													<input
														type='text'
														value={fullName}
														placeholder={'Full Name'}
														onChange={(e) => {
															setFullName(e.target.value);
														}}
														className='
																	w-full
																	rounded-[25px]
																	border-2
																	border-[#8b0e06]
																	py-3
																	px-5
																	bg-white
																	text-base text-body-color
																	placeholder-[#ACB6BE]
																	outline-none
																	focus-visible:shadow-none
																	focus:border-primary
																'
														required
													/>
												</div>
												<div className='mb-6'>
													<input
														type='text'
														value={phone}
														placeholder={'Phone (include country your code )'}
														onChange={(e) => {
															setPhone(e.target.value);
														}}
														className='
																	w-full
																	rounded-[25px]
																	border-2
																	border-[#8b0e06]
																	py-3
																	px-5
																	bg-white
																	text-base text-body-color
																	placeholder-[#ACB6BE]
																	outline-none
																	focus-visible:shadow-none
																	focus:border-primary
																'
														required
													/>
												</div>
												<div className='mb-6'>
													<input
														type='text'
														value={email}
														placeholder={'Email'}
														onChange={(e) => {
															setEmail(e.target.value);
														}}
														className='
																	w-full
																	rounded-[25px]
																	border-2
																	border-[#8b0e06]
																	py-3
																	px-5
																	bg-white
																	text-base text-body-color
																	placeholder-[#ACB6BE]
																	outline-none
																	focus-visible:shadow-none
																	focus:border-primary
																'
														required
													/>
												</div>
												<div className='mb-4'>
													<input
														type='submit'
														value={'Send One Time Password'}
														className='
																	font-bold
																	w-full
																	rounded-[25px]
																	border-2
																	border-[#8b0e06]
																	border-primary
																	py-3
																	px-5
																	bg-[#8b0e06]
																	text-base 
																	text-white
																	cursor-pointer
																	hover:bg-opacity-90
																	transition
																'
													/>
												</div>
												<div className='text-center'>
													<input
														onChange={() => {
															setChecked(true);
														}}
														type='checkbox'
														id='terms'
														name='terms'
														value='terms'
														className='accent-[#8b0e06] text-white bg-whites'
													/>
													<label htmlFor='terms'>
														{' '}
														I understand the Terms and Conditions
													</label>
													<br></br>
												</div>
												<Link href={'/terms'}>
													<p className='text-center text-xs text-gray-300 mb-4 font-bold underline'>
														See Terms
													</p>
												</Link>
											</form>
										)}
										<button
											onClick={() => {}}
											className={
												'rounded-[25px] py-3 px-5 text-white w-full border '
											}
											style={{
												backgroundColor: PRIMARY_COLOR,
												borderColor: PRIMARY_COLOR,
											}}
										>
											Add
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default Market;
