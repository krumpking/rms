import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMeal, IMenuItem } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import {
	addDocument,
	deleteDocument,
	deleteFile,
	getDataFromDBOne,
	getDataFromDBThree,
	getDataFromDBTwo,
	updateDocument,
	uploadFile,
} from '../../api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_CAT_COLLECTION,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
	ORDER_JUST_ADDED,
} from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import {
	findOccurrences,
	findOccurrencesObjectId,
	returnOnlyUnique,
	searchStringInArray,
} from '../../utils/arrayM';
import { createId } from '../../utils/stringM';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { IOrder } from '../../types/orderTypes';
import { useAuthIds } from '../authHook';
import { IPoints, IPointsRate } from '../../types/loyaltyTypes';
import {
	POINTS_COLLECTION,
	REWARD_PARAMS_COLLECTION,
} from '../../constants/loyaltyConstants';
import { getCurrency } from '../../utils/currency';

const CreateOrder = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { adminId, userId, access } = useAuthIds();
	const [categories, setCategories] = useState<string[]>([]);
	const [meals, setMeals] = useState<IMeal[]>([]);
	const [mealsSto, setMealsSto] = useState<IMeal[]>([]);
	const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
	const [menuItemsSto, setMenuItemsSto] = useState<IMenuItem[]>([]);
	const [edit, setEdit] = useState(false);
	const [editItem, setEditItem] = useState<any>({
		category: '',
		title: '',
		description: '',
		price: 0,
	});
	const [addItems, setAddItems] = useState<any[]>([]);
	const [search, setSearch] = useState('');
	const [displayedItems, setDisplayedItems] = useState<any>([]);
	const [customerName, setCustomerName] = useState('');
	const [tableNo, setTableNo] = useState('');
	const [orderNo, setOrderNo] = useState(1);
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [category, setCategory] = useState<string[]>(['First Time', 'Regular']);
	const [choosePoints, setChoosePoints] = useState<string[]>([
		'Use Points',
		'DO NOT use points',
	]);
	const [currentNoOfPoints, setCurrentNoOfPoints] = useState(0);
	const [rewards, setRewards] = useState<IPointsRate[]>([]);
	const [points, setPoints] = useState<IPoints[]>([]);
	const [usePoints, setUsePoints] = useState(false);
	const [currency, setCurrency] = useState('US$');

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;

		getMeals();
		getMenuItems();
		getOrders();
	}, []);

	const getMeals = async () => {
		let currny = await getCurrency();
		setCurrency(currny);
		getDataFromDBOne(MEAL_ITEM_COLLECTION, AMDIN_FIELD, adminId)
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
		getDataFromDBOne(MENU_ITEM_COLLECTION, AMDIN_FIELD, adminId)
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

	const getOrders = () => {
		getDataFromDBTwo(ORDER_COLLECTION, AMDIN_FIELD, adminId, 'confirmed', true)
			.then((v) => {
				let oN = 1;
				if (v !== null) {
					oN = v.count + 1;
				}
				setOrderNo(oN);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	const getTotal = () => {
		let total = 0;

		addItems.forEach((el) => {
			total += el.price;
		});
		// setFinalTotal(total);
		return total.toFixed(2);
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

	const checkIfItOccurs = (id: string) => {
		let count = findOccurrencesObjectId(addItems, id);
		if (count > 0) {
			return 'ring-2 ring-[#8b0e06]';
		} else {
			return '';
		}
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

	const addItemsToMeal = (v: any) => {
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

		setDisplayedItems(display);
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

	const addOrder = () => {
		setLoading(true);
		let total = 0;

		addItems.forEach((el) => {
			total += el.price;
		});

		// use points and update
		if (usePoints) {
			let discount =
				(currentNoOfPoints / rewards[0].numberOfPoints) *
				rewards[0].dollarAmount;
			if (discount > total) {
				updatePoints(
					Math.floor((discount - total) * rewards[0].numberOfPoints)
				);
				total = 0;
			} else {
				total -= discount;
				updatePoints(0);
			}
			setCurrentNoOfPoints(0);
		}

		const order: IOrder = {
			id: 'id',
			orderNo: orderNo,
			adminId: adminId,
			userId: userId,
			items: addItems,
			status: 5,
			statusCode: ORDER_JUST_ADDED,
			totalCost: total,
			deliveryMethod: 'Dine In',
			clientId: 'clientId',
			customerName: customerName,
			tableNo: tableNo,
			date: new Date(),
			dateString: new Date().toDateString(),
			customerEmail: '',
			customerPhone: '',
			customerAddress: '',
			deliveryDate: new Date(),
			deliveryDateString: new Date().toDateString(),
			deliveryLocation: null,
			deliveryTime: '',
			deliverer: '',
			deliveredSignature: null,
			confirmed: true,
		};

		if (!usePoints) {
			const point: IPoints = {
				adminId: adminId,
				userId: userId,
				id: 'id',
				dateString: new Date().toDateString(),
				date: new Date(),
				name: customerName,
				email: email,
				phone: phone,
				order: order,
				orderTotal: total,
				pointsTotal: Math.floor(total),
				used: false,
			};

			addPoints(point);
		}

		// Send Order
		addDocument(ORDER_COLLECTION, order)
			.then((v) => {
				toast.success('Order added successfully');
				setDisplayedItems([]);
				setAddItems([]);
				setCustomerName('');
				setPhone('');
				setEmail('');
				setTableNo('');
				setLoading(false);
				getOrders();
			})
			.catch((e: any) => {
				setLoading(false);

				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const checkforPoints = () => {
		if (phone !== '') {
			getDataFromDBThree(
				POINTS_COLLECTION,
				AMDIN_FIELD,
				adminId,
				'phone',
				phone,
				'used',
				false
			)
				.then((v) => {
					if (v !== null) {
						let pnts = 0;
						v.data.forEach((element) => {
							let d = element.data();
							pnts += d.pointsTotal;

							setPoints((prevPoints) => [
								...prevPoints,
								{
									adminId: d.adminId,
									userId: d.userId,
									id: element.id,
									dateString: d.datestring,
									date: d.date,
									name: d.name,
									phone: d.phone,
									order: d.order,
									email: d.email,
									orderTotal: d.orderTotal,
									pointsTotal: d.pointsTotal,
									used: d.used,
								},
							]);
						});
						setCurrentNoOfPoints(pnts);
						getRewardsParams();
					}
				})
				.catch((e) => {
					console.error(e);
				});
		}
	};

	const getRewardsParams = () => {
		getDataFromDBOne(REWARD_PARAMS_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();
						setRewards((prevRes) => [
							...prevRes,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								date: d.date,
								dateString: d.dateString,
								numberOfPoints: d.numberOfPoints,
								dollarAmount: d.dollarAmount,
								rewardType: d.rewardType,
							},
						]);
					});
				} else {
					setRewards((prevRes) => [
						...prevRes,
						{
							id: 'id',
							adminId: adminId,
							userId: userId,
							date: new Date(),
							dateString: new Date().toDateString(),
							numberOfPoints: 10,
							dollarAmount: 1,
							rewardType: 'Discount',
						},
					]);
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const addPoints = (points: IPoints) => {
		// Add points
		addDocument(POINTS_COLLECTION, points)
			.then((v) => {})
			.catch((e: any) => {
				setLoading(false);
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const updatePoints = (extraPoints: number) => {
		points.forEach((e) => {
			updateDocument(POINTS_COLLECTION, e.id, { used: true });
		});
		if (extraPoints > 0) {
			updateDocument(POINTS_COLLECTION, points[points.length - 1].id, {
				used: false,
				pointsTotal: extraPoints,
			});
		}
	};

	return (
		<div>
			<div className='bg-white rounded-[30px]'>
				{loading ? (
					<div className='w-full flex flex-col items-center content-center'>
						<Loader color={''} />
					</div>
				) : (
					<div className='grid grid-cols-1 lg:grid-cols-2'>
						<div className='overflow-y-scroll max-h-[300px] lg:max-h-[700px] w-full gap-4 p-4'>
							<div className='flex flex-row items-center  overflow-x-scroll space-x-2 m-2'>
								{returnOnlyUnique(categories).map((v) => (
									<button
										onClick={() => {
											setSearch(v);
											searchFor();
										}}
										className='font-bold
                                            w-full
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
                                            transition'
									>
										{/* <div>
                                            <ShowImage src={`/${webfrontId}/${MENU_CAT_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Category'} style={'rounded-full h-6'} />
                                        </div> */}
										<h1 className='whitespace-nowrap'>{v}</h1>
									</button>
								))}
							</div>
							<div className='mb-6'>
								<input
									type='text'
									value={search}
									placeholder={'Search'}
									onChange={(e) => {
										setSearch(e.target.value);
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
									onKeyDown={handleKeyDown}
								/>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
								{meals.map((v) => {
									return (
										<div
											className={
												'flex flex-col shadow-xl rounded-[25px] p-8 w-full md:w-[250px] lg:w-[200px] ' +
												checkIfItOccurs(v.id)
											}
											onClick={() => {
												addItemsToMeal(v);
											}}
										>
											<ShowImage
												src={`/${adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-[25px] h-20 w-full'}
											/>
											<div className='flex flex-row justify-between'>
												<h1 className='font-bold text-sm'>{v.title}</h1>
												<h1 className='font-bold text-sm'>
													{currency}
													{v.price}
												</h1>
											</div>
										</div>
									);
								})}
								{menuItems.map((v) => {
									return (
										<div
											className={
												'flex flex-col shadow-xl rounded-[25px] p-8 w-full md:w-[250px] lg:w-[200px] ' +
												checkIfItOccurs(v.id)
											}
											onClick={() => {
												addItemsToMeal(v);
											}}
										>
											<ShowImage
												src={`/${adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Menu Item'}
												style={'rounded-[25px] h-20 w-full'}
											/>
											<div className='flex flex-row justify-between'>
												<h1 className='font-bold text-sm'>{v.title}</h1>
												<h1 className='font-bold text-sm'>
													{currency}
													{v.price}
												</h1>
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className='flex flex-col p-4 '>
							<div className='shadow-xl rounded-[25px]  px-2 py-8'>
								<h1 className='my-2'>Order Number: {orderNo}</h1>
								<div className='mb-4'>
									<input
										type='text'
										value={customerName}
										placeholder={'Customer Name'}
										onChange={(e) => {
											setCustomerName(e.target.value);
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
									/>
								</div>
								<div className='mb-4'>
									<input
										type='text'
										value={phone}
										placeholder={'Phone number'}
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
									/>
								</div>
								<div className='mb-4'>
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
									/>
								</div>
								<div className='mb-4'>
									<input
										type='text'
										value={tableNo}
										placeholder={'Table Number'}
										onChange={(e) => {
											setTableNo(e.target.value);
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
										onKeyDown={handleKeyDown}
									/>
								</div>
								<div className='mb-4'>
									<button
										className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
										onClick={(e) => e.preventDefault()}
									>
										<select
											// value={category}
											onChange={(e) => {
												if (e.target.value == 'Regular') {
													checkforPoints();
												}
											}}
											className='bg-white w-full'
											data-required='1'
											required
										>
											<option value='Regular' hidden>
												Regular Customer / First Time
											</option>
											{category.map((v) => (
												<option value={v}>{v}</option>
											))}
										</select>
									</button>
								</div>
								<div>
									{currentNoOfPoints > 0 ? (
										<div className='flex flex-col'>
											<div className='mb-4  px-4'>
												<h1>
													Points:
													{currentNoOfPoints}
												</h1>
											</div>
											<div className='mb-4'>
												<button
													className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
													onClick={(e) => e.preventDefault()}
												>
													<select
														// value={category}
														onChange={(e) => {
															if (e.target.value == 'Use Points') {
																setUsePoints(true);
															} else {
																setUsePoints(false);
															}
														}}
														className='bg-white w-full'
														data-required='1'
														required
													>
														<option value='Regular' hidden>
															Use points / Do not use points
														</option>
														{choosePoints.map((v) => (
															<option value={v}>{v}</option>
														))}
													</select>
												</button>
											</div>
										</div>
									) : (
										<p></p>
									)}
								</div>
								<div className='flex flex-row justify-between shadow-md m-4 p-4 rounded-[25px]'>
									<p className='text-xs'> Item</p>
									<div className='flex justify-between space-x-2'>
										<p className='text-xs'>No of Items</p>
										<p className='text-xs'>Price</p>
										<p className='text-xs'>Total</p>
										<p className='text-xs w-4'></p>
									</div>
								</div>

								<div className='overflow-y-scroll'>
									{displayedItems.map((v: any) => (
										<div className='flex flex-row justify-between shadow-sm m-4 p-4 rounded-[25px]'>
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

								<div className='flex flex-row justify-between px-8'>
									<h1 className='text-xl'>Combined Total</h1>
									<h1 className='text-xl'>
										{currency}
										{getTotal()}
									</h1>
								</div>

								<button
									onClick={() => {
										addOrder();
									}}
									className='font-bold
                                            w-full
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
                                            transition'
								>
									{/* <div>
                                            <ShowImage src={`/${webfrontId}/${MENU_CAT_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Category'} style={'rounded-full h-6'} />
                                        </div> */}
									<h1 className=''>Add Order</h1>
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default CreateOrder;
