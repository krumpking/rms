import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { IContact, IWebsiteOneInfo } from '../../../types/websiteTypes';
import ShowImage from '../../showImage';
import { IMeal, IMenuItem } from '../../../types/menuTypes';
import { addDocument, getDataFromDBOne } from '../../../api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../../../constants/menuConstants';
import {
	AMDIN_FIELD,
	CURRENCIES,
	FOODIES_BOOTH_URL,
	PRIMARY_COLOR,
} from '../../../constants/constants';
import {
	findOccurrencesObjectId,
	searchStringInArray,
} from '../../../utils/arrayM';
import { print } from '../../../utils/console';
import Head from 'next/head';
import { Popover, Transition } from '@headlessui/react';
import Drawer from '../../drawer';
import { IOrder } from '../../../types/orderTypes';
import { createId, numberWithCommas } from '../../../utils/stringM';
import { ORDER_COLLECTION } from '../../../constants/orderConstants';
import MapPicker from 'react-google-map-picker';
import {
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
} from '../../../constants/websiteConstants';
import { distance, findDis, getDis } from '../../../utils/mapMethods';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import PaypalCheckoutButton from '../../paypalButton';
import { IPayments } from '../../../types/paymentTypes';
import { CONTACT_COLLECTION } from '../../../constants/contactConstats';
import { useAuthIds } from '../../authHook';
import DateMethods from '../../../utils/date';
import { isEqual, isAfter } from 'date-fns';
import { sendSMS } from '../../../api/twillioApi';

interface MyProps {
	info: IWebsiteOneInfo;
}

const WebOneWebsite: FC<MyProps> = ({ info }) => {
	const [loading, setLoading] = useState(true);
	const [meals, setMeals] = useState<IMeal[]>([]);
	const [mealsSto, setMealsSto] = useState<IMeal[]>([]);
	const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
	const [menuItemsSto, setMenuItemsSto] = useState<IMenuItem[]>([]);
	const [search, setSearch] = useState('');
	const [reservation, setReservation] = useState({
		id: '',
		adminId: '',
		userId: '',
		name: '',
		phoneNumber: 0,
		email: '',
		date: new Date(),
		time: '',
		peopleNumber: 0,
		notes: '',
		category: '',
		dateAdded: new Date(),
		dateOfUpdate: new Date(),
		dateAddedString: '',
	});
	const [contact, setContact] = useState<IContact>({
		id: '',
		adminId: '',
		userId: '',
		name: '',
		phone: '',
		email: '',
		message: '',
	});
	const [addItems, setAddItems] = useState<any[]>([]);
	const [index, setIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
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
		customerPhone: '+263',
		customerAddress: '',
		deliveryLocation: null,
		tableNo: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		deliveryDate: new Date(),
		deliveryDateString: new Date().toDateString(),
		deliveryTime: '',
		deliveredSignature: null,
		deliverer: '',
	});
	const [displayedItems, setDisplayedItems] = useState<any>([]);
	const [deliveryMethods, setDeliveryMethods] = useState([
		'Pick Up',
		'Delivery',
	]);
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [location, setLocation] = useState(DEFAULT_LOCATION);
	const [loadDist, setLoadDist] = useState(false);
	const [isReservationPayment, setIsReservationPayment] = useState(false);
	const [{ isPending }] = usePayPalScriptReducer();
	const [payment, setPayment] = useState<IPayments>({
		id: '',
		adminId: '',
		userId: '',
		dateAdded: new Date(),
		dateAddedString: new Date().toDateString(),
		paymentDateString: new Date().toDateString(),
		paymentDate: new Date(),
		amount: 10,
		duration: 0,
		refCode: '',
		package: '',
		date: new Date(),
	});
	const [navItems, setNavItems] = useState([
		{ title: 'Home', id: '#home' },
		{ title: 'Menu', id: '#menu' },
		{ title: 'About Us', id: '#about' },
		{ title: 'Contact Us', id: '#contact' },
	]);
	const [navOpen, setNavOpen] = useState(false);

	useEffect(() => {
		getMeals();
		getMenuItems();
	}, []);

	const handleChangeLocation = (lat: any, lng: any) => {
		setLocation({ lat: lat, lng: lng });
	};

	const getMeals = () => {
		getDataFromDBOne(MEAL_ITEM_COLLECTION, AMDIN_FIELD, info.adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setMeals((meals) => [
							...meals,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								menuItems: d.menuItems,
								title: d.title,
								discount: d.discount,
								description: d.description,
								category: d.category,
								date: d.date,
								dateString: d.dateString,
								price: d.price,
								pic: d.pic,
							},
						]);
						setMealsSto((meals) => [
							...meals,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								menuItems: d.menuItems,
								title: d.title,
								discount: d.discount,
								description: d.description,
								category: d.category,
								date: d.date,
								dateString: d.dateString,
								price: d.price,
								pic: d.pic,
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

	const getMenuItems = () => {
		getDataFromDBOne(MENU_ITEM_COLLECTION, AMDIN_FIELD, info.adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setMenuItems((menuItems) => [
							...menuItems,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								pic: d.pic,
								title: d.title,
								discount: d.discount,
								description: d.description,
								category: d.category,
								date: d.date,
								dateString: d.dateString,
								price: d.price,
							},
						]);
						setMenuItemsSto((menuItems) => [
							...menuItems,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								pic: d.pic,
								title: d.title,
								discount: d.discount,
								description: d.description,
								category: d.category,
								date: d.date,
								dateString: d.dateString,
								price: d.price,
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

	const handleChange = (e: any) => {
		setReservation({
			...reservation,
			[e.target.name]: e.target.value,
		});
	};

	const handleChangeOrder = (e: any) => {
		if (e.target.name === 'customerPhone') {
			if (e.target.value.includes('+263')) {
				setOrder({
					...order,
					[e.target.name]: e.target.value,
				});
			}
		} else {
			setOrder({
				...order,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleChangeContact = (e: any) => {
		setContact({
			...contact,
			[e.target.name]: [e.target.value],
		});
	};

	const removeItem = (v: any) => {
		let items: any[] = [];
		displayedItems.forEach((e: any) => {
			if (v.id !== e.id) {
				items.push(e);
			}
		});
		setDisplayedItems(items);
		let aItems: any[] = [];
		addItems.forEach((e) => {
			if (v.id !== e.id) {
				aItems.push(e);
			}
		});
		setAddItems(aItems);
	};

	const getTotal = () => {
		let total = 0;

		addItems.forEach((el) => {
			total += el.price;
		});

		if (order.deliveryMethod == 'Delivery') {
			print(info.mapLocation);
			print(location);
			let dis = computeDistanceBetween(
				new LatLng(location.lat, location.lng),
				new LatLng(info.mapLocation.lat, info.mapLocation.lng)
			);
			let d = info.deliveryCost * (dis / 1000);
			d.toFixed(2);
			total += d;
		}

		return total.toFixed(2);
	};

	const addToCart = (v: any) => {
		setAddItems((categories) => [...categories, v]);
		let display = displayedItems;

		let count = 0;
		let index = 0;
		for (let i = 0; i < displayedItems.length; i++) {
			if (displayedItems[i].id === v.id) {
				print(displayedItems[i].id === v.id);
				count = displayedItems[i].count + 1;
				index = i;
				return;
			}
		}
		if (count > 0) {
			display[index] = {
				id: displayedItems[index].id,
				itemName: displayedItems[index].itemName,
				count: count,
				price: displayedItems[index].price,
			};
		} else {
			display.push({
				id: v.id,
				itemName: v.title,
				count: 1,
				price: v.price,
			});
		}
		toast.success('Added to cart');
		setDisplayedItems(display);
	};

	const getCount = (id: string) => {
		let total = 0;

		addItems.forEach((el: any) => {
			if (el.id == id) {
				total++;
			}
		});
		return total;
	};

	const getPriceOfItem = (v: any) => {
		let total = 0;

		displayedItems.forEach((el: any) => {
			if (el.id === v.id) {
				total = findOccurrencesObjectId(addItems, v.id) * v.price;

				return;
			}
		});
		return total;
	};

	const getDeliveryCost = () => {
		let dis = computeDistanceBetween(
			new LatLng(location.lat, location.lng),
			new LatLng(info.mapLocation.lat, info.mapLocation.lng)
		);
		let d = info.deliveryCost * (dis / 1000);

		return d.toFixed(2);
	};

	const submitOrder = () => {
		getDataFromDBOne(ORDER_COLLECTION, AMDIN_FIELD, info.adminId)
			.then((v) => {
				let oN = 1;
				if (v !== null) {
					oN = v.count + 1;
				}
				let total = 0;

				addItems.forEach((el) => {
					total += el.price;
				});
				if (order.deliveryMethod == 'Delivery') {
					let dis = computeDistanceBetween(
						new LatLng(location.lat, location.lng),
						new LatLng(info.mapLocation.lat, info.mapLocation.lng)
					);
					let d = info.deliveryCost * (dis / 1000);
					d.toFixed(2);
					total += d;
				}

				let newOrder: IOrder = {
					...order,
					orderNo: oN,
					items: addItems,
					status: 0,
					statusCode: 'Sent',
					totalCost: total,
					deliveryLocation: location,
					deliveryDateString: new Date(order.deliveryDate).toDateString(),
					date: new Date(),
					dateString: new Date().toDateString(),
					adminId: info.adminId,
					userId: info.userId,
				};

				addDocument(ORDER_COLLECTION, newOrder)
					.then((v) => {
						sendSMS(
							info.phone,
							`${order.customerName} whose contact number is ${order.customerPhone},has just made an order,log on to see more click on this ${FOODIES_BOOTH_URL}/orders`
						).catch(console.error);
						setLoading(false);
						toast.success('Order Added successfully');
					})
					.catch((e) => {
						console.error(e);
						toast.error('Please try again');
					});
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	const addOrder = () => {
		let deliveryDate = new Date(order.deliveryDate);
		let deliveryTime = parseInt(order.deliveryTime.split(':')[0]);

		if (deliveryTime < 19) {
			if (
				isEqual(deliveryDate, new Date()) ||
				isAfter(deliveryDate, new Date())
			) {
				if (isEqual(deliveryDate, new Date())) {
					if (new Date().getHours() + 2 < deliveryTime) {
						let ifOpen = DateMethods.checkIfOpen(
							new Date(order.deliveryDate),
							info.daysOfWork
						);
						if (ifOpen) {
							setLoading(true);
							if (
								order.customerEmail !== '' &&
								order.customerName !== '' &&
								order.customerPhone !== ''
							) {
								submitOrder();
							} else {
								setLoading(false);
								toast.error('Ensure you enter all details');
							}
						} else {
							toast.info(
								'Ooops looks like you selected a date which we are not open, please change date'
							);
						}
					} else {
						toast.info(
							'Order can not be done in less than 2 hours, kindly change the date'
						);
					}
				} else {
					let ifOpen = DateMethods.checkIfOpen(
						new Date(order.deliveryDate),
						info.daysOfWork
					);
					if (ifOpen) {
						setLoading(true);
						if (
							order.customerEmail !== '' &&
							order.customerName !== '' &&
							order.customerPhone !== ''
						) {
							submitOrder();
						} else {
							setLoading(false);
							toast.error('Ensure you enter all details');
						}
					} else {
						toast.info(
							'Ooops looks like you selected a date which we are not open, please change date'
						);
					}
				}
			} else {
				toast.info('Delivery date can only be, today or later');
			}
		} else {
			toast.info('Delivery date can only be before 1900');
		}
	};

	const addReservation = () => {
		let newRes = {
			...reservation,
			date: new Date(),
			addedDate: new Date(),
			dateString: new Date().toDateString(),
			dateAddedString: new Date().toDateString(),
		};
		setReservation(newRes);
		setIsReservationPayment(true);
		setIsOpen(true);
	};

	const addContact = () => {
		let newContact = {
			...contact,
			date: new Date(),
			dateString: new Date().toDateString(),
			adminId: info.adminId,
			userId: info.userId,
		};

		addDocument(CONTACT_COLLECTION, newContact)
			.then((v) => {
				if (v !== null) {
					toast.success('Message successfully sent');
				}
			})
			.catch((e) => {
				console.error(e);
				toast.error('There was an error sending a message please try again');
			});
	};

	const getView = () => {
		switch (index) {
			case 0:
				return (
					<div className='relative'>
						<div className='flex flex-col'>
							<div className='flex justify-between items-center content-center'>
								<div className='flex flex-row items-center space-x-4 content-center'>
									{info.logo.thumbnail !== '' ? (
										<ShowImage
											src={`${info.websiteName}/logo/${info.logo.thumbnail}`}
											alt={''}
											style={'h-8 rounded-[25px]'}
										/>
									) : (
										<img
											src='images/logo.png'
											className='h-8 rounded-[25px] w-8 self-center'
										/>
									)}

									<h1>{info.serviceProviderName}</h1>
								</div>
								<div className='hidden nineSixteen:block'>
									<div className='flex flex-row items-center space-x-4 font-bold'>
										{navItems.map((v) => (
											<a href={v.id}>
												<h1>{v.title}</h1>
											</a>
										))}

										<button
											className='py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out'
											aria-label='Cart'
											onClick={() => {
												setIsOpen(true);
											}}
										>
											<svg
												className='h-6 w-6'
												fill='none'
												stroke-linecap='round'
												stroke-linejoin='round'
												stroke-width='2'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'></path>
											</svg>
											<span className='absolute inset-0 object-right-top -mr-6'>
												<div
													className={
														'inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 text-white'
													}
													style={{ backgroundColor: `${info.themeMainColor}` }}
												>
													{addItems.length}
												</div>
											</span>
										</button>
									</div>
								</div>
								<div className='nineSixteen:hidden'>
									<div className='-mr-2 flex '>
										<button
											onClick={() => setNavOpen(!navOpen)}
											type='button'
											style={{ backgroundColor: info.themeMainColor }}
											className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
											aria-controls='mobile-menu'
											aria-expanded='false'
										>
											<span className='sr-only'>Open main menu</span>
											{!navOpen ? (
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
							<Transition
								show={navOpen}
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
											style={{ backgroundColor: info.themeMainColor }}
											className='flex flex-col px-2 pt-2 pb-3 space-y-1 
                            						sm:px-3 shadow-lg rounded-lg p-4'
										>
											{navItems.map((v, index) => {
												return (
													<div
														className={`bg-[#fff] rounded-[20px] p-2`}
														key={index}
													>
														<a
															style={{ color: info.themeMainColor }}
															className='smXS:text-xs md:text-sm afterMini:text-xs xl:text-xl text-center p-4'
															href={v.id}
														>
															{v.title}
														</a>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</Transition>
							<div
								className='grid grid-cols-1 xl:grid-cols-2 place-content-center place-items-center mb-6'
								id='about'
							>
								<div className='flex flex-col space-y-10'>
									<h1 className='text-2xl lg:text-4xl xl:text-6xl font-bold'>
										{info.headerTitle}
									</h1>
									<p className='text-bold'>{info.headerText}</p>
									<h1>Days Open:</h1>
									<div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0  lg:space-x-2'>
										{info.daysOfWork.map((v) => (
											<p
												style={{ backgroundColor: info.themeMainColor }}
												className='rounded-md p-2 text-white'
											>
												{v}
											</p>
										))}
									</div>
									<button
										className='py-2 px-5 text-white rounded-md w-1/2 md:w-1/4'
										onClick={() => {
											setIndex(1);
											setMenuItems(menuItemsSto);
											setMeals(mealsSto);
										}}
										style={{ backgroundColor: `${info.themeMainColor}` }}
									>
										Order Now
									</button>
								</div>
								<div className='p-4 '>
									{info.headerImage.thumbnail !== '' ? (
										<ShowImage
											src={`${info.websiteName}/header/${info.headerImage.thumbnail}`}
											alt={''}
											style={''}
										/>
									) : (
										<img
											src='images/webOneDefaultPicture.jpg'
											className='h-96 rounded-[25px] w-96'
										/>
									)}
								</div>
							</div>
							<div className='flex flex-col mb-6'>
								<h1 className='text-4xl text-center mb-12'>
									Our Favorite Menu
								</h1>
								<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8'>
									{menuItems.slice(0, 3).map((v) => (
										<div className='relative shadow-2xl rounded-md p-4 w-full lg:w-3/4'>
											<div className='p-4'>
												<p className='text-xl'>{v.title}</p>
												<div className='flex justify-between'>
													<p className='text-md'>{v.price}USD</p>
													<button
														onClick={() => {
															addToCart(v);
														}}
														className='relative rounded-md p-2'
														style={{ backgroundColor: info.themeMainColor }}
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
												</div>
											</div>
											<div className='absolute -top-10 -left-10 right-10 z-10 '>
												<ShowImage
													src={`/${info.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
													alt={'Menu Item'}
													style={'rounded-full h-20 w-20 '}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
							<div
								className='grid grid-cols-1 lg:grid-cols-2 place-content-center place-items-center mb-6 gap-4'
								id='about'
							>
								<div>
									{info.aboutUsImage.thumbnail !== '' ? (
										<ShowImage
											src={`${info.websiteName}/about/${info.aboutUsImage.thumbnail}`}
											alt={''}
											style={'h-96 rounded-md w-full lg:w-96'}
										/>
									) : (
										<img
											src='images/webOneDefaultPicture.jpg'
											className='h-96 rounded-[25px] w-96'
										/>
									)}
								</div>
								<div>
									<h1 className='text-5xl'>{info.aboutUsTitle}</h1>
									<p>{info.aboutUsInfo}</p>
								</div>
							</div>
							<div className='flex flex-col' id='menu'>
								<div className='flex justify-between content-center items-center mb-6'>
									<h1 className='text-2xl'>Order Now</h1>
									<div
										className='flex flex-row space-x-4 max-w-[800px] overflow-x-auto'
										onClick={() => {
											setIndex(1);
											setMenuItems(menuItemsSto);
											setMeals(mealsSto);
										}}
									>
										<h1 className='underline'>See All</h1>
									</div>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
									{menuItems.slice(0, 4).map((v) => (
										<div className='flex flex-col shadow-2xl rounded-md'>
											<ShowImage
												src={`/${info.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-md h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>
												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-md w-1/2'
													style={{ backgroundColor: `${info.themeMainColor}` }}
												>
													Add
												</button>
											</div>
										</div>
									))}
									{meals.slice(0, 4).map((v) => (
										<div className='flex flex-col shadow-2xl rounded-md'>
											<ShowImage
												src={`/${info.adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-md h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>
												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-md w-1/2'
													style={{ backgroundColor: `${info.themeMainColor}` }}
												>
													Add
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
							{info.reservation ? (
								<div className='flex flex-col p-4 mb-6'>
									<h1 className='text-4xl text-center'>Make a reservation</h1>
									<div className='grid grid-cols-1 md:grid-cols-2 mb-6 gap-4 shadow-md p-8'>
										<input
											type='text'
											// value={reservation}
											name='name'
											placeholder={'Full Name'}
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                        w-full
                                        rounded-md
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
										/>
										<input
											type='text'
											// value={reservation}
											name='phoneNumber'
											placeholder={'Phone Number'}
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                        w-full
                                        rounded-md
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
										/>
										<input
											type='date'
											// value={search}
											// placeholder={"Date"}
											name='date'
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                            w-full
                                            rounded-md
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
										/>
										<input
											type='time'
											// value={search}
											placeholder={'time'}
											name='time'
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                            w-full
                                            rounded-md
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
										/>
										<input
											type='text'
											// value={search}
											placeholder={'Email'}
											name='email'
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                            md:col-span-2
                                            w-full
                                            rounded-md
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
										/>
										<textarea
											name='notes'
											// value={search}
											placeholder={'Notes'}
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                            md:col-span-2
                                            w-full
                                            rounded-md
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
										/>
										<input
											type='number'
											name='peopleNumber'
											placeholder={'Number of people'}
											onChange={handleChange}
											style={{ borderColor: `${info.themeMainColor}` }}
											className='
                                            w-full
                                            rounded-md
                                            border-2
                                            py-3
                                            px-5
                                            bg-white
                                            text-base text-body-color
                                            placeholder-[#ACB6BE]
                                            outline-none
                                            focus-visible:shadow-none
                                            focus:border-primary                                        
                                        '
										/>

										<button
											onClick={() => {
												addReservation();
											}}
											className='py-3 px-5 text-white rounded-md w-full border'
											style={{
												backgroundColor: `${info.themeMainColor}`,
												borderColor: info.themeMainColor,
											}}
										>
											Add Reservation
										</button>
									</div>
								</div>
							) : (
								<p></p>
							)}
							<div
								className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 place-items-center'
								id='contact'
							>
								<div>
									{info.id !== '' ? (
										<ShowImage
											src={`${info.websiteName}/contact/${info.contactUsImage.thumbnail}`}
											alt={'contact image'}
											style={'h-96 rounded-[25px] w-96'}
										/>
									) : (
										<img
											src='images/webOneDefaultPicture.jpg'
											className='h-96 rounded-[25px] w-96'
										/>
									)}
								</div>
								<div>
									<h1 className='text-4xl text-center mb-6'>Contact Us</h1>
									<input
										type='text'
										// value={reservation}
										name='name'
										placeholder={'Full Name'}
										onChange={handleChangeContact}
										style={{ borderColor: `${info.themeMainColor}` }}
										className='
                                        w-full
                                        rounded-md
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
									/>
									<input
										type='text'
										// value={reservation}
										name='phoneNumber'
										placeholder={'Phone Number'}
										onChange={handleChangeContact}
										style={{ borderColor: `${info.themeMainColor}` }}
										className='
                                        w-full
                                        rounded-md
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
									/>
									<input
										type='text'
										// value={reservation}
										name='email'
										placeholder={'Email'}
										onChange={handleChangeContact}
										style={{ borderColor: `${info.themeMainColor}` }}
										className='
                                        w-full
                                        rounded-md
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
									/>
									<textarea
										// value={reservation}
										name='message'
										placeholder={'Message'}
										onChange={handleChangeContact}
										style={{ borderColor: `${info.themeMainColor}` }}
										className='
                                        w-full
                                        rounded-md
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
									/>
									<button
										onClick={() => {
											addContact();
										}}
										className='py-3 px-5 text-white rounded-md w-full'
										style={{ backgroundColor: `${info.themeMainColor}` }}
									>
										Send Message
									</button>
								</div>
							</div>
							<div className='w-full'>
								<MapPicker
									defaultLocation={{
										lat: info.mapLocation.lat,
										lng: info.mapLocation.lng,
									}}
									zoom={14}
									// mapTypeId={createId()}
									style={{ height: '500px', width: '100%' }}
									// onChangeLocation={handleChangeLocation}
									apiKey={MAP_API}
								/>
							</div>
							<div
								className='flex flex-col content-center items-center min-h-48 text-white p-8'
								style={{ backgroundColor: `${info.themeMainColor}` }}
							>
								{info.id !== '' ? (
									<ShowImage
										src={`${info.websiteName}/logo/${info.logo.thumbnail}`}
										alt={'logo image'}
										style={'h-8 rounded-[25px] w-8'}
									/>
								) : (
									<img
										src='images/logo.png'
										className='h-8 rounded-[25px] w-8'
									/>
								)}
								<h1 className='mb-6'>{info.serviceProviderName}</h1>
								<h1 className='mb-6'>{info.email}</h1>
								<h1 className='mb-6'>{info.phone}</h1>
								<h1 className='mb-6'>{info.address}</h1>
								<h1 className='mb-6'>&copy;2023 {info.serviceProviderName}</h1>
							</div>
						</div>
						<div className='fixed bottom-10 left-0 right-10 z-10'>
							<div className='flex flex-row-reverse space-x-4'>
								<button
									style={{
										backgroundColor: info.themeMainColor,
										borderColor: info.themeMainColor,
									}}
									className='
                                py-4 
                                px-4 
                                relative 
                                border-2 
                                border-transparent 
                                text-gray-800 
                                rounded-full
                                 hover:text-gray-400 
                                 focus:outline-none 
                                 ocus:text-gray-500 
                                 transition duration-150 
                                 ease-in-out'
									aria-label='Cart'
									onClick={() => {
										setIsOpen(true);
									}}
								>
									<svg
										className='h-6 w-6 text-white'
										fill='none'
										stroke-linecap='round'
										stroke-linejoin='round'
										stroke-width='2'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'></path>
									</svg>
									<span className='absolute inset-0 object-right-top -mr-12'>
										<div
											className={
												'inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 text-white'
											}
											style={{ backgroundColor: `${info.themeMainColor}` }}
										>
											{addItems.length}
										</div>
									</span>
								</button>
							</div>
						</div>
					</div>
				);
			case 1:
				return (
					<div className='relative'>
						<div
							className='border rounded-md w-full h-fit'
							style={{ borderColor: info.themeMainColor }}
						>
							<div
								style={{ backgroundColor: info.themeMainColor }}
								className='h-12 p-2'
							>
								<button
									onClick={() => {
										setIndex(0);
										setMenuItems(menuItemsSto);
										setMeals(mealsSto);
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
							<div className='p-8'>
								<div className='flex justify-between content-center items-center mb-6'>
									<h1 className='hidden md:block md:text-2xl'>Order Now</h1>
									<div className='flex flex-row space-x-4 max-w-[800px] overflow-x-auto'>
										{menuItems.map((v) => (
											<h1
												className='hover:cursor-pointer'
												onClick={() => {
													setSearch(v.category);
													searchFor();
												}}
											>
												{v.category}
											</h1>
										))}
										{meals.map((v) => (
											<h1
												className='hover:cursor-pointer'
												onClick={() => {
													setSearch(v.category);
													searchFor();
												}}
											>
												{v.category}
											</h1>
										))}
									</div>
								</div>
								<input
									type='text'
									value={search}
									placeholder={'Search'}
									onChange={(e) => {
										setSearch(e.target.value);
									}}
									style={{ borderColor: `${info.themeMainColor}` }}
									className='
                                        w-full
                                        rounded-md
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
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
									{menuItems.map((v) => (
										<div className='flex flex-col shadow-2xl rounded-md'>
											<ShowImage
												src={`/${info.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-md h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>
												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-md w-1/2'
													style={{ backgroundColor: `${info.themeMainColor}` }}
												>
													Add
												</button>
											</div>
										</div>
									))}
									{meals.map((v) => (
										<div className='flex flex-col shadow-2xl rounded-md'>
											<ShowImage
												src={`/${info.adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-md h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>
												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-md w-1/2'
													style={{ backgroundColor: `${info.themeMainColor}` }}
												>
													Add
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className='fixed bottom-10 left-0 right-10 z-10'>
							<div className='flex flex-row-reverse space-x-4'>
								<button
									style={{
										backgroundColor: info.themeMainColor,
										borderColor: info.themeMainColor,
									}}
									className='
                                py-4 
                                px-4 
                                relative 
                                border-2 
                                border-transparent 
                                text-gray-800 
                                rounded-full
                                 hover:text-gray-400 
                                 focus:outline-none 
                                 ocus:text-gray-500 
                                 transition duration-150 
                                 ease-in-out'
									aria-label='Cart'
									onClick={() => {
										setIsOpen(true);
									}}
								>
									<svg
										className='h-6 w-6 text-white'
										fill='none'
										stroke-linecap='round'
										stroke-linejoin='round'
										stroke-width='2'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'></path>
									</svg>
									<span className='absolute inset-0 object-right-top -mr-12'>
										<div
											className={
												'inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 text-white'
											}
											style={{ backgroundColor: `${info.themeMainColor}` }}
										>
											{addItems.length}
										</div>
									</span>
								</button>
							</div>
						</div>
					</div>
				);

			default:
				break;
		}
	};

	return (
		<div>
			<Head>
				<title>{info.serviceProviderName}</title>
				<link rel='shortcut icon' href={info.logo.thumbnail} />
			</Head>
			<div>
				{loading ? (
					<div className='flex justify-center content-center items-center h-screen'>
						<Loader color={info.themeMainColor} />
					</div>
				) : (
					<div className='bg-white rounded-[30px] p-4 '>
						{getView()}
						<Drawer
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							bg={'#fff'}
							color={info.themeMainColor}
						>
							{isReservationPayment ? (
								<div className='w-full'>
									{isPending ? (
										<Loader color={''} />
									) : (
										<PaypalCheckoutButton
											payment={payment}
											isReservationPayment={false}
											reservation={reservation}
											color={''}
										/>
									)}
								</div>
							) : (
								<div
									style={{ borderColor: info.themeMainColor }}
									className='border rounded-md h-fit w-full flex flex-col items-center m-4 p-4'
								>
									<div className={'mb-2 w-full'}>
										<input
											type='string'
											value={order.customerName}
											name='customerName'
											placeholder={'Full Name'}
											onChange={handleChangeOrder}
											style={{ borderColor: info.themeMainColor }}
											className='
                                                w-full
                                                rounded-md
                                                border-2                                               
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                        '
										/>
									</div>
									<div className={'mb-2 w-full'}>
										<input
											type='string'
											value={order.customerPhone}
											placeholder={'Phone Number'}
											name='customerPhone'
											onChange={handleChangeOrder}
											style={{ borderColor: info.themeMainColor }}
											className='
                                                w-full
                                                rounded-md
                                                border-2
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                        '
										/>
									</div>
									<div className={'mb-2 w-full'}>
										<input
											type='string'
											value={order.customerEmail}
											placeholder={'Email'}
											name='customerEmail'
											onChange={handleChangeOrder}
											style={{ borderColor: info.themeMainColor }}
											className='
                                                w-full
                                                rounded-md
                                                border-2
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                        '
										/>
									</div>
									<button
										className='font-bold rounded-md border-2 bg-white px-4 py-3 w-full mb-2'
										style={{ borderColor: info.themeMainColor }}
										onClick={(e) => e.preventDefault()}
									>
										<select
											// value={order.deliveryMethod}
											onChange={handleChangeOrder}
											name='deliveryMethod'
											className='bg-white w-full'
											data-required='1'
											required
										>
											<option value='Delivery' hidden>
												Select Delivery Method
											</option>
											{deliveryMethods.map((v) => (
												<option value={v}>{v}</option>
											))}
										</select>
									</button>
									<div className={'mb-2 w-full'}>
										<p className='text-center text-xs'>
											Date of {order.deliveryMethod}
										</p>
										<input
											type='date'
											// value={order.deliveryDate}
											placeholder={`Date of ${order.deliveryMethod}`}
											name='deliveryDate'
											onChange={handleChangeOrder}
											style={{ borderColor: info.themeMainColor }}
											className='
                                                w-full
                                                rounded-md
                                                border-2
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                        '
										/>
									</div>
									<div className={'mb-2 w-full'}>
										<p className='text-center text-xs'>
											Time of {order.deliveryMethod}
										</p>
										<input
											type='time'
											// value={order.deliveryDate}
											placeholder={`Date of ${order.deliveryMethod}`}
											name='deliveryTime'
											onChange={handleChangeOrder}
											style={{ borderColor: info.themeMainColor }}
											className='
                                                w-full
                                                rounded-md
                                                border-2
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                        '
										/>
									</div>

									<div className='mb-2 overflow-y-auto max-h-54 w-full'>
										<div>
											<div className='flex flex-row justify-between shadow-md m-4 p-4'>
												<p className='text-xs'> Item</p>
												<div className='flex justify-between space-x-2'>
													<p className='text-xs'>No of Items</p>
													<p className='text-xs'>Price</p>
													<p className='text-xs'>Total</p>
													<p className='text-xs w-4'></p>
												</div>
											</div>
											{displayedItems.map((v: any) => (
												<div className='flex flex-row justify-between shadow-md m-4 p-4'>
													<h1>{v.itemName}</h1>
													<div className='flex justify-between space-x-4'>
														<h1>{getCount(v.id)}</h1>
														<h1>{v.price}</h1>
														<h1>{getPriceOfItem(v)}</h1>
														<button
															onClick={() => {
																removeItem(v);
															}}
														>
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
																	d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
																/>
															</svg>
														</button>
													</div>
												</div>
											))}
										</div>
									</div>

									{order.deliveryMethod == 'Delivery' ? (
										<div className='w-full'>
											<div className={'mb-2 w-full'}>
												<input
													type='string'
													value={order.customerAddress}
													placeholder={'Delivery Address'}
													name='customerAddress'
													onChange={handleChangeOrder}
													style={{ borderColor: info.themeMainColor }}
													className='
                                                    w-full
                                                    rounded-md
                                                    border-2
                                                    py-3
                                                    px-5
                                                    bg-white
                                                    text-base text-body-color
                                                    placeholder-[#ACB6BE]
                                                    outline-none
                                                    focus-visible:shadow-none
                                                        focus:border-primary
                                                '
												/>
											</div>
											<div>
												<p>Tap your location</p>
												<MapPicker
													defaultLocation={DEFAULT_LOCATION}
													zoom={DEFAULT_ZOOM}
													// mapTypeId={createId()}
													style={{ height: '200px', width: '100%' }}
													onChangeLocation={handleChangeLocation}
													apiKey={MAP_API}
												/>
											</div>
										</div>
									) : (
										<p></p>
									)}
									{order.deliveryMethod == 'Delivery' ? (
										<div className='flex flex-row items-center text-center px-8 py-4 my-2 shadow-xl rounded-md w-full'>
											{loadDist ? (
												<p>Loading Distance...</p>
											) : (
												<h1 className='text-md'>
													Delivery Cost {getDeliveryCost()}
												</h1>
											)}
										</div>
									) : (
										<p></p>
									)}
									<div className='flex flex-row items-center text-left px-8 py-4 my-2 shadow-xl rounded-md w-full'>
										<h1
											className='text-xl'
											style={{ color: `${info.themeMainColor}` }}
										>
											Total Cost: {numberWithCommas(getTotal().toString())} USD
										</h1>
									</div>
									<button
										onClick={() => {
											addOrder();
										}}
										className='
                                        font-bold
                                        w-full
                                        rounded-md
                                        border-2
                                        border-primary
                                        py-3
                                        px-10
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    '
										style={{
											borderColor: info.themeMainColor,
											backgroundColor: info.themeMainColor,
										}}
									>
										Submit Order
									</button>
								</div>
							)}
						</Drawer>
					</div>
				)}
				<ToastContainer position='top-right' autoClose={5000} />
			</div>
		</div>
	);
};

export default WebOneWebsite;
