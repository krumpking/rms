import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { IMeal, IMenuItem, IMenuItemPromotions } from '../../types/menuTypes';
import {
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
} from '../../constants/websiteConstants';
import { IOrder } from '../../types/orderTypes';
import { IWebsiteOneInfo } from '../../types/websiteTypes';
import {
	addDocument,
	getDataFromDBOne,
	getDataFromDBThree,
	updateDocument,
} from '../../api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_PROMO_ITEM_COLLECTION,
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
	returnOccurrencesIndexAdmin,
	returnOnlyUnique,
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
import { differenceInHours, isAfter, isEqual } from 'date-fns';
import { sendOrderEmail } from '../../api/emailApi';
import { Disclosure } from '@headlessui/react';
import { IPoints, IPointsRate } from '../../types/loyaltyTypes';
import {
	POINTS_COLLECTION,
	REWARD_PARAMS_COLLECTION,
} from '../../constants/loyaltyConstants';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase/clientApp';

const FoodiesBoothMarketPlace = (props: {
	info: IWebsiteOneInfo[];
	changeIndex: (index: number) => void;
}) => {
	const { info, changeIndex } = props;
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [locationSearch, setLocationSearch] = useState('');
	const [price, setPrice] = useState('');
	const [promos, setPromos] = useState<IMenuItemPromotions[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
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
		confirmed: false,
	});
	const [addItems, setAddItems] = useState<IMenuItem[]>([]);
	const [loadDist, setLoadDist] = useState(false);
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);
	const [category, setCategory] = useState<string[]>(['First Time', 'Regular']);
	const [choosePoints, setChoosePoints] = useState<string[]>([
		'Use Points',
		'DO NOT use points',
	]);
	const [currentNoOfPoints, setCurrentNoOfPoints] = useState(0);
	const [rewards, setRewards] = useState<IPointsRate[]>([]);
	const [points, setPoints] = useState<IPoints[]>([]);
	const [usePoints, setUsePoints] = useState(false);
	const [makePayment, setMakePayment] = useState(false);
	const [prepTime, setPrepTime] = useState(48);
	const [paymentMethods, setPaymentMethods] = useState<string[]>([
		'Ecocash',
		'Innbucks',
	]);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [confirmationMessage, setConfirmationMessage] = useState('');

	useEffect(() => {
		getMeals();
		getPromos();
		getMenuItems();
		logEvent(analytics, 'foodies_booth_market_place_page_visit');
	}, []);

	const handleChangeLocation = (lat: any, lng: any) => {
		setLocation({ lat: lat, lng: lng });
	};

	const getMeals = () => {
		info.forEach((element) => {
			getDataFromDBOne(MEAL_ITEM_COLLECTION, AMDIN_FIELD, element.adminId)
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
							setCategories((categories) => [...categories, d.category]);
						});
					}
				})
				.catch((e) => {
					console.error(e);
					setLoading(true);
				});
		});
	};

	const getMenuItems = () => {
		info.forEach((element) => {
			getDataFromDBOne(MENU_ITEM_COLLECTION, AMDIN_FIELD, element.adminId)
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
							setCategories((categories) => [...categories, d.category]);
						});
					}
				})
				.catch((e) => {
					console.error(e);
					setLoading(true);
				});
		});
	};

	const getPromos = () => {
		info.forEach((element) => {
			getDataFromDBOne(MENU_PROMO_ITEM_COLLECTION, AMDIN_FIELD, element.adminId)
				.then((v) => {
					if (v !== null) {
						v.data.forEach((element) => {
							let d = element.data();

							setPromos((promos) => [
								...promos,
								{
									id: element.id,
									adminId: d.adminId,
									userId: d.userId,
									pic: d.pic,
									title: d.title,
									description: d.description,
									category: d.category,
									date: d.date,
									dateString: d.dateString,
									oldPrice: d.oldPrice,
									newPrice: d.newPrice,
									endDate: d.endDate,
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
		setPromos([]);
		setLoading(true);
		logEvent(analytics, 'foodies_booth_market_place_search');
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

	const handleChangePaymentMethod = (e: any) => {
		setPaymentMethod(e.target.value);
	};

	const handleChange = (e: any) => {
		setPaymentMethod(e.target.value);
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

	const getTotal = (level: number) => {
		let total: number = 0;
		if (addItems.length > 0) {
			let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
			addItems.forEach((el) => {
				total += parseFloat(el.price.toString());
			});

			if (order.deliveryMethod == 'Delivery') {
				let dis = computeDistanceBetween(
					new LatLng(location.lat, location.lng),
					new LatLng(info[index].mapLocation.lat, info[index].mapLocation.lng)
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
		}

		if (total > 1) {
			if (level == 1) {
				return total.toFixed(2);
			} else if (level == 2) {
				return (total * 0.05).toFixed(2);
			} else {
				return (
					parseFloat(total.toFixed(2)) + parseFloat((total * 0.05).toFixed(2))
				);
			}
		} else {
			return total;
		}
	};

	const addToCart = (v: any) => {
		let isDifferentBus = true;
		for (let i = 0; i < addItems.length; i++) {
			logEvent(analytics, 'foodies_booth_market_place_items_added_to_cart');

			if (addItems[i].adminId !== v.adminId) {
				isDifferentBus = false;
				toast.error(
					'Hmmmm looks like you are ordering from a different Food business, you can ADD that in a separate order'
				);
				return;
			}
		}

		if (isDifferentBus) {
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
		let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
		getDataFromDBOne(ORDER_COLLECTION, AMDIN_FIELD, info[index].adminId)
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
					logEvent(analytics, 'foodies_booth_market_place_delivery_order');
					let dis = computeDistanceBetween(
						new LatLng(location.lat, location.lng),
						new LatLng(info[index].mapLocation.lat, info[index].mapLocation.lng)
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
					adminId: order.adminId,
					userId: order.adminId,
					confirmed: false,
				};

				if (!usePoints) {
					const point: IPoints = {
						adminId: info[index].adminId,
						userId: info[index].userId,
						id: 'id',
						dateString: new Date().toDateString(),
						date: new Date(),
						name: order.customerName,
						email: order.customerEmail,
						phone: order.customerPhone,
						order: order,
						orderTotal: total,
						pointsTotal: Math.floor(total),
						used: false,
					};

					addPoints(point);
				}

				addDocument(ORDER_COLLECTION, newOrder)
					.then((v) => {
						sendOrderEmail(info[index].email, newOrder).catch(console.error);
						setLoading(false);
						toast.success('Order Added successfully');
						logEvent(analytics, 'foodies_booth_market_place_orders');
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
				setLoading(false);
			});
	};

	const addOrder = () => {
		let deliveryDate = new Date(order.deliveryDate);
		let deliveryTime = parseInt(order.deliveryTime.split(':')[0]);

		if (deliveryTime < 19) {
			// check prep time
			let hrs = differenceInHours(deliveryDate, new Date());
			let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
			if (hrs >= info[index].prepTime) {
				if (
					order.customerEmail !== '' &&
					order.customerName !== '' &&
					order.customerPhone !== ''
				) {
					setMakePayment(true);
				} else {
					toast.error('Ensure you enter all details');
				}
			} else {
				toast.info(
					`Delivery date can only be after ${info[index].prepTime} hours of Food preparation time`
				);
			}
		} else {
			toast.info('Delivery date can only be before 1900');
			logEvent(analytics, 'foodies_booth_market_place_order_after_1900');
		}
	};

	const getDeliveryCost = () => {
		let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
		let dis = computeDistanceBetween(
			new LatLng(location.lat, location.lng),
			new LatLng(info[index].mapLocation.lat, info[index].mapLocation.lng)
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

	const checkforPoints = () => {
		let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
		if (order.customerPhone !== '') {
			getDataFromDBThree(
				POINTS_COLLECTION,
				AMDIN_FIELD,
				info[index].adminId,
				'phone',
				order.customerPhone,
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
		let index = returnOccurrencesIndexAdmin(info, addItems[0].adminId);
		getDataFromDBOne(REWARD_PARAMS_COLLECTION, AMDIN_FIELD, info[index].adminId)
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
							adminId: info[index].adminId,
							userId: info[index].userId,
							date: info[index].date,
							dateString: info[index].dateString,
							numberOfPoints: 0,
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
			.then((v) => {
				logEvent(analytics, 'foodies_booth_market_place_added_points');
			})
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

	const paymentConfirmed = () => {
		setLoading(true);
		let res = confirmationMessage.substring(
			confirmationMessage.indexOf('Approval Code:') + 17,
			confirmationMessage.indexOf('Approval Code:') + 23
		);
		let today = new Date();
		let str =
			today.getFullYear().toString().substring(2, 4) +
			'' +
			(today.getMonth() + 1) +
			'' +
			today.getDate();

		if (paymentMethod == 'Ecocash') {
			if (
				confirmationMessage.substring(
					confirmationMessage.indexOf('Approval Code:') + 24,
					confirmationMessage.indexOf('Approval Code:') + 28
				).length == 4 &&
				confirmationMessage.substring(
					confirmationMessage.indexOf('Approval Code:') + 29,
					confirmationMessage.indexOf('Approval Code:') + 35
				).length == 6 &&
				res == str
			) {
				let amnt = parseFloat(
					confirmationMessage.substring(
						confirmationMessage.indexOf('USD') + 3,
						confirmationMessage.indexOf('sent')
					)
				);
				let total = parseFloat(getTotal(3).toString());
				if (amnt > 40) {
					if (amnt >= total || amnt >= total * 0.6) {
						setMakePayment(false);
						submitOrder();
					} else {
						toast.error(
							'Looks like you sent in less money than your order, please whatsapp 0713020524 for further assistance'
						);
					}
				} else {
					if (amnt >= total) {
						setMakePayment(false);
						submitOrder();
					} else {
						toast.error(
							'Looks like you sent in less money than your order, please whatsapp 0713020524 for further assistance'
						);
					}
				}
			} else {
				toast.error(
					'Please check your confirmation message again and re-submit'
				);
				setLoading(false);
			}
		} else {
			if (
				confirmationMessage.substring(
					confirmationMessage.indexOf('Reference:') + 11,
					confirmationMessage.length
				).length == 9 &&
				confirmationMessage.includes('InnBucks sent')
			) {
				let paidAmnt = confirmationMessage.substring(
					0,
					confirmationMessage.indexOf('InnBucks')
				);
				let amnt = parseFloat(paidAmnt.substring(1));
				let total = parseFloat(getTotal(3).toString());
				if (amnt > 40) {
					if (amnt >= total || amnt >= total * 0.6) {
						setMakePayment(false);
						submitOrder();
					} else {
						toast.error(
							'Looks like you sent in less money than your order, please whatsapp 0713020524 for further assistance'
						);
					}
				} else {
					if (amnt >= total) {
						setMakePayment(false);
						submitOrder();
					} else {
						toast.error(
							'Looks like you sent in less money than your order, please whatsapp 0713020524 for further assistance'
						);
					}
				}
			} else {
				toast.error(
					'Please check your confirmation message again and re-submit'
				);
				setLoading(false);
			}
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-0 sm:p-4 text-black'>
					<div className='relative'>
						<div className='w-full h-full'>
							<div className='p-2 sm:p-8'>
								<div className='flex justify-center content-center items-center mb-6'>
									<div className='flex flex-row space-x-4 w-full overflow-x-auto'>
										{returnOnlyUnique(categories).map((v) => (
											<h1
												className='hover:cursor-pointer w-full whitespace-nowrap'
												onClick={() => {
													setSearch(v);
													searchFor();
												}}
											>
												{v}
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
								{/* <div className='grid grid-cols-2 gap-4'>
									<input
										type='text'
										value={locationSearch}
										placeholder={'Search by location'}
										onChange={(e) => {
											setLocationSearch(e.target.value);
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
									<input
										type='text'
										value={price}
										placeholder={'Search by price '}
										onChange={(e) => {
											setPrice(e.target.value);
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
								</div> */}
								<div className='flex flex-col mb-6 p-2 md:p-8 mb-6 border-b-2'>
									<div>
										{promos.length > 0 ? (
											<div className='flex justify-center content-center items-center mb-6'>
												<h1
													className='text-2xl'
													style={{ color: PRIMARY_COLOR }}
												>
													PROMOS
												</h1>
											</div>
										) : (
											<p></p>
										)}
									</div>

									{promos.length > 0 ? (
										<div className='carousel carousel-center bg-white bg-white'>
											{promos.map((v) => (
												<div className='carousel-item p-4'>
													<div className='relative shadow-2xl rounded-[25px] w-[200px]'>
														<div className='p-2 md:p-4 flex flex-col space-y-1'>
															<ShowImage
																src={`/${v.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
																alt={'Menu Item'}
																style={'rounded-[25px] h-20 lg:h-40 w-full '}
															/>

															<p className='text-xs md:text-xl'>{v.title}</p>
															<Disclosure>
																<Disclosure.Button
																	className={' underline text-xs text-left'}
																>
																	See Details
																</Disclosure.Button>
																<Disclosure.Panel>
																	<p className='text-xs w-full'>
																		{v.description}
																	</p>
																</Disclosure.Panel>
															</Disclosure>
															<div className='flex flex-row space-x-4 justify-between content-center items-center my-1'>
																<p className='text-xs md:text-md line-through'>
																	{v.oldPrice}USD
																</p>
																<p className='text-xs md:text-md'>
																	{v.newPrice}USD
																</p>
															</div>
															<button
																onClick={() => {
																	let item: IMenuItem = {
																		id: v.id,
																		adminId: v.adminId,
																		userId: v.userId,
																		category: v.category,
																		title: v.title,
																		description: v.description,
																		discount: v.oldPrice - v.newPrice,
																		pic: v.pic,
																		date: v.date,
																		dateString: v.dateString,
																		price: v.newPrice,
																	};
																	addToCart(item);
																}}
																className='py-2 px-5 text-white rounded-[25px] w-full'
																style={{
																	backgroundColor: `${PRIMARY_COLOR}`,
																}}
															>
																Add
															</button>
															<div className='rounded-[25px] font-bold w-full h-fit font-bold text-xs text-center flex flex-row justify-center my-1'>
																<p className='text-gray-400'>
																	{DateMethods.diffDatesDays(
																		new Date().toDateString(),
																		v.endDate
																	)}{' '}
																	days left
																</p>
															</div>
														</div>

														<div
															className='absolute -top-2 -right-2  z-10 rounded-full text-white font-bold w-12 h-12 font-bold text-xs text-center flex items-center'
															style={{ backgroundColor: PRIMARY_COLOR }}
														>
															{100 - (v.newPrice / v.oldPrice) * 100} % OFF
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<p></p>
									)}
								</div>
								<div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
									{menuItems.map((v) => (
										<div className='flex flex-col justify-between shadow-2xl rounded-[25px]'>
											<div className='flex flex-col'>
												<ShowImage
													src={`/${v.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
													alt={'Menu Item'}
													style={'rounded-[25px] h-32 md:h-64 w-full'}
												/>
												<h1 className='font-bold text-xs md:text-xl px-2 md:px-4'>
													{v.title}
												</h1>
												<Disclosure>
													<Disclosure.Button
														className={
															' underline text-xs text-left px-2 md:px-4'
														}
													>
														See Details
													</Disclosure.Button>
													<Disclosure.Panel>
														<p className='text-xs px-2 md:px-4 w-full'>
															{v.description}
														</p>
													</Disclosure.Panel>
												</Disclosure>
											</div>

											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-sm md:text-xl'>
													{v.price}USD
												</h1>

												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-[25px] w-fit '
													style={{ backgroundColor: PRIMARY_COLOR }}
												>
													<p className='hidden lg:flex'>Add</p>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														stroke-width='1.5'
														stroke='currentColor'
														className='w-6 h-6 flex lg:hidden'
													>
														<path
															stroke-linecap='round'
															stroke-linejoin='round'
															d='M12 4.5v15m7.5-7.5h-15'
														/>
													</svg>
												</button>
											</div>
										</div>
									))}
									{meals.map((v) => (
										<div className='flex flex-col justify-between shadow-2xl rounded-[25px]'>
											<div className='flex flex-col'>
												<ShowImage
													src={`/${v.adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
													alt={'Menu Item'}
													style={'rounded-[25px] h-32 md:h-64 w-full'}
												/>
												<h1 className='font-bold text-xs md:text-xl px-2 md:px-4'>
													{v.title}
												</h1>
												<Disclosure>
													<Disclosure.Button
														className={
															' underline text-xs text-left px-2 md:px-4'
														}
													>
														See Details
													</Disclosure.Button>
													<Disclosure.Panel>
														<p className='text-xs px-2 md:px-4 w-full'>
															{v.description}
														</p>
													</Disclosure.Panel>
												</Disclosure>
											</div>

											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-sm md:text-xl'>
													{v.price}USD
												</h1>

												<button
													onClick={() => {
														addToCart(v);
													}}
													className='py-2 px-5 text-white rounded-[25px] w-fit'
													style={{ backgroundColor: PRIMARY_COLOR }}
												>
													<p className='hidden lg:flex'>Add</p>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														stroke-width='1.5'
														stroke='currentColor'
														className='w-6 h-6 flex lg:hidden'
													>
														<path
															stroke-linecap='round'
															stroke-linejoin='round'
															d='M12 4.5v15m7.5-7.5h-15'
														/>
													</svg>
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
										let index = returnOccurrencesIndexAdmin(
											info,
											addItems[0].adminId
										);

										if (typeof info[index].freeDeliveryAreas !== 'undefined') {
											if (info[index].freeDeliveryAreas.length > 0) {
												info[index].freeDeliveryAreas.forEach((el) => {
													setDeliveryMethods((prevDel) => [
														...prevDel,
														`Free Delivery in ${el}`,
													]);
												});
												setPrepTime(info[index].prepTime);
											}
										}

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
						{makePayment ? (
							<div
								style={{ borderColor: PRIMARY_COLOR }}
								className='border rounded-[25px] h-fit w-full flex flex-col items-center m-2 md:m-4 p-2 md:p-4'
							>
								<button
									className='font-bold rounded-[25px] border-2 bg-white px-4 py-3 w-full mb-2'
									style={{ borderColor: PRIMARY_COLOR }}
									onClick={(e) => e.preventDefault()}
								>
									<select
										// value={order.deliveryMethod}
										onChange={handleChangePaymentMethod}
										name='deliveryMethod'
										className='bg-white w-full'
										data-required='1'
										required
									>
										<option value='Delivery' hidden>
											Select Payment Method
										</option>
										{paymentMethods.map((v) => (
											<option value={v}>{v}</option>
										))}
									</select>
								</button>

								<div className='flex flex-col space-y-2'>
									<h1>
										Send payment of {numberWithCommas(getTotal(3).toString())}{' '}
										USD{' '}
										{parseFloat(getTotal(3).toString()) > 40
											? `or ${parseFloat(getTotal(3).toString()) * 0.6}`
											: ''}{' '}
										to 0772263139
									</h1>
									<h1>Name shown is Anele Siwawa</h1>
									<h1>
										Submit the confirmation message into the inbox below(Remove
										your current balance)
									</h1>
									<div className='mb-6 w-full'>
										<textarea
											value={confirmationMessage}
											name='headerText'
											placeholder={'Payment Confirmation message'}
											onChange={(e) => {
												setConfirmationMessage(e.target.value);
											}}
											className='
													w-full
													rounded-[25px]
													border-2
													border-[#8b0e06]
													py-3
													px-5
													h-64
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
								</div>

								<button
									onClick={() => {
										paymentConfirmed();
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
									Confirm order
								</button>
							</div>
						) : (
							<div
								style={{ borderColor: PRIMARY_COLOR }}
								className='border rounded-[25px] h-fit w-full flex flex-col items-center m-2 md:m-4 p-2 md:p-4'
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
										Date of {order.deliveryMethod} NB {prepTime} hours is needed
										for Food preparation
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
								<div className='mb-4 w-full'>
									<button
										className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white py-3 px-4 w-full'
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
								<div className='w-full'>
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
								<div className='flex flex-col items-center text-left px-8 py-4 my-2 shadow-xl rounded-[25px] w-full'>
									<div
										className='flex flex-row justify-between w-full'
										style={{ color: `${PRIMARY_COLOR}` }}
									>
										<p>Price:</p>
										<p>{numberWithCommas(getTotal(1).toString())} USD</p>
									</div>
									<div
										className='flex flex-row justify-between w-full'
										style={{ color: `${PRIMARY_COLOR}` }}
									>
										<p>Processing fee:</p>
										<p>{numberWithCommas(getTotal(2).toString())} USD</p>
									</div>
									<div
										className='flex flex-row justify-between w-full text-xl'
										style={{ color: `${PRIMARY_COLOR}` }}
									>
										<h1>Total Cost:</h1>
										<h1>{numberWithCommas(getTotal(3).toString())} USD</h1>
									</div>
									<p className='my-2 text-xs'>
										On orders above 40USD deposit is 60%
									</p>
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
									Make Payment
								</button>
							</div>
						)}
					</Drawer>
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default FoodiesBoothMarketPlace;
