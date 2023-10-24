import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { IMeal, IMenuItem } from '../../types/menuTypes';
import {
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
} from '../../constants/websiteConstants';
import { IOrder } from '../../types/orderTypes';
import { IWebsiteOneInfo } from '../../types/websiteTypes';
import { addDocument, getDataFromDBOne } from '../../api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../../constants/menuConstants';
import {
	AMDIN_FIELD,
	DISCLAIMER,
	FOODIES_BOOTH_URL,
	PRIMARY_COLOR,
} from '../../constants/constants';
import {
	findOccurrencesObjectId,
	searchStringInArray,
} from '../../utils/arrayM';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';
import ShowImage from '../showImage';
import Drawer from '../drawer';
import MapPicker from 'react-google-map-picker';
import { numberWithCommas } from '../../utils/stringM';
import Loader from '../loader';
import { print } from '../../utils/console';
import DateMethods from '../../utils/date';
import { isAfter, isEqual } from 'date-fns';
import { sendOrderEmail } from '../../api/emailApi';
import { Disclosure } from '@headlessui/react';

const MarketPlace = (props: {
	info: IWebsiteOneInfo;
	changeIndex: (index: number) => void;
}) => {
	const { info, changeIndex } = props;
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
	const [userId, setUserId] = useState('userId');
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
		deliverer: '',
		deliveredSignature: null,
	});
	const [addItems, setAddItems] = useState<any[]>([]);
	const [loadDist, setLoadDist] = useState(false);
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);

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
			let dis = computeDistanceBetween(
				new LatLng(location.lat, location.lng),
				new LatLng(info.mapLocation.lat, info.mapLocation.lng)
			);
			let d = dis / 1000;
			let deliveryCost = 0;
			if (d > 0 && d < 3) {
				deliveryCost = 2;
			} else if (d > 3 && d < 5) {
				deliveryCost = 3;
			} else if (d > 5 && d < 10) {
				deliveryCost = 5;
			} else if (d > 10 && d < 15) {
				deliveryCost = 7;
			} else if (d > 15 && d < 20) {
				deliveryCost = 10;
			} else if (d > 20 && d < 30) {
				deliveryCost = 15;
			}
			total += deliveryCost;
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
		toast.success('Added to order');
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
					let d = dis / 1000;
					let deliveryCost = 0;
					if (d > 0 && d < 3) {
						deliveryCost = 2;
					} else if (d > 3 && d < 5) {
						deliveryCost = 3;
					} else if (d > 5 && d < 10) {
						deliveryCost = 5;
					} else if (d > 10 && d < 15) {
						deliveryCost = 7;
					} else if (d > 15 && d < 20) {
						deliveryCost = 10;
					} else if (d > 20 && d < 30) {
						deliveryCost = 15;
					}
					total += deliveryCost;
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
						sendOrderEmail(info.email, newOrder).catch(console.error);
						setLoading(false);
						toast.success('Order Added successfully');
					})
					.catch((e) => {
						setLoading(false);
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
		setLoading(true);
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

	const getDeliveryCost = () => {
		let dis = computeDistanceBetween(
			new LatLng(location.lat, location.lng),
			new LatLng(info.mapLocation.lat, info.mapLocation.lng)
		);
		let d = dis / 1000;

		if (d > 0 && d < 3) {
			return 2;
		} else if (d > 3 && d < 5) {
			return 3;
		} else if (d > 5 && d < 10) {
			return 5;
		} else if (d > 10 && d < 15) {
			return 7;
		} else if (d > 15 && d < 20) {
			return 10;
		} else if (d > 20 && d < 30) {
			return 15;
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-0 sm:p-4 '>
					<div className='relative'>
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
										changeIndex(0);
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
							<div className='flex items-center w-full justify-center m-4'>
								<ShowImage
									src={`/${info.websiteName}/logo/${info.logo.thumbnail}`}
									alt={'Logo'}
									style={'rounded-full h-40 w-40 '}
								/>
							</div>
							<div className='p-2 sm:p-8'>
								<div className='flex justify-between content-center items-center mb-6'>
									<h1 className='hidden lg:block text-md md:text-2xl'>
										Order Now
									</h1>
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
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
									{menuItems.map((v) => (
										<div className='flex flex-col shadow-2xl rounded-[25px]'>
											<ShowImage
												src={`/${v.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-[25px] h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<Disclosure>
												<Disclosure.Button
													className={' underline text-xs text-left px-4'}
												>
													See Details
												</Disclosure.Button>
												<Disclosure.Panel>
													<p className='text-xs px-4 w-full'>{v.description}</p>
												</Disclosure.Panel>
											</Disclosure>

											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>

												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-[25px] w-1/2'
													style={{ backgroundColor: PRIMARY_COLOR }}
												>
													Add
												</button>
											</div>
										</div>
									))}
									{meals.map((v) => (
										<div className='flex flex-col shadow-2xl rounded-[25px]'>
											<ShowImage
												src={`/${v.adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-[25px] h-64 w-full'}
											/>
											<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>{v.price}USD</h1>
												<p className='text-xs w-full'>{v.description}</p>
												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-[25px] w-1/2'
													style={{ backgroundColor: PRIMARY_COLOR }}
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
										backgroundColor: PRIMARY_COLOR,
										borderColor: PRIMARY_COLOR,
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
											style={{ backgroundColor: PRIMARY_COLOR }}
										>
											{addItems.length}
										</div>
									</span>
								</button>
							</div>
						</div>
					</div>
					<Drawer
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						bg={'#fff'}
						color={PRIMARY_COLOR}
					>
						<div
							style={{ borderColor: PRIMARY_COLOR }}
							className='border rounded-[25px] h-fit w-full flex flex-col items-center m-4 p-4'
						>
							<div className={'mb-2 w-full'}>
								<input
									type='string'
									value={order.customerName}
									name='customerName'
									placeholder={'Full Name'}
									onChange={handleChangeOrder}
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
                                        '
								/>
							</div>
							<button
								className='font-bold rounded-[25px] border-2 bg-white px-4 py-3 w-full mb-2'
								style={{ borderColor: PRIMARY_COLOR }}
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
                                        '
								/>
							</div>
							<div className='mb-2 overflow-y-auto max-h-54 w-full'>
								<div>
									<div className='flex flex-row justify-between shadow-md m-4 p-4 rounded-[25px]'>
										<p className='text-xs'> Item</p>
										<div className='flex justify-between space-x-2'>
											<p className='text-xs'>No of Items</p>
											<p className='text-xs'>Price</p>
											<p className='text-xs'>Total</p>
											<p className='text-xs w-4'></p>
										</div>
									</div>
									{displayedItems.map((v: any) => (
										<div className='flex flex-row justify-between shadow-md m-4 p-4 rounded-[25px]'>
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
                                                '
										/>
									</div>
									<p>Tap your location</p>
									<div>
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
								<div className='flex flex-row items-center text-center px-8 py-4 my-2 shadow-xl rounded-[25px] w-full'>
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
							<div className='flex flex-row items-center text-left px-8 py-4 my-2 shadow-xl rounded-[25px] w-full'>
								<h1 className='text-xl' style={{ color: `${PRIMARY_COLOR}` }}>
									Total Cost: {numberWithCommas(getTotal().toString())} USD
								</h1>
							</div>
							<p
								className='text-xs bg-gray-300'
								onClick={() => {
									alert(DISCLAIMER);
								}}
							>
								Disclaimer
							</p>
							<button
								onClick={() => {
									addOrder();
								}}
								className='
                                        font-bold
                                        w-full
                                        rounded-[25px]
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
									borderColor: PRIMARY_COLOR,
									backgroundColor: PRIMARY_COLOR,
								}}
							>
								Submit Order
							</button>
						</div>
					</Drawer>
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default MarketPlace;
