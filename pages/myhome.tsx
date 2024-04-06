import React, { useEffect, useState } from 'react';
import { AMDIN_FIELD, LIGHT_GRAY } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { useAuthIds } from '../app/components/authHook';
import {
	getDataFromAll,
	getDataFromDBOne,
	getDataFromDBTwo,
} from '../app/api/mainApi';
import { ORDER_COLLECTION } from '../app/constants/orderConstants';
import { IMeal, IMenuItem, IMenuItemPromotions } from '../app/types/menuTypes';
import { getOrdersStatus } from '../app/api/orderApi';
import { IOrder } from '../app/types/orderTypes';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Disclosure } from '@headlessui/react';
import { STOCK_ITEM_COLLECTION } from '../app/constants/stockConstants';
import { IStockItem } from '../app/types/stockTypes';
import { ITransaction } from '../app/types/cashbookTypes';
import { CASHBOOOK_COLLECTION } from '../app/constants/cashBookConstants';
import { RESERVATION_COLLECTION } from '../app/constants/reservationConstants';
import { IReservation } from '../app/types/reservationTypes';
import {
	MEAL_ITEM_COLLECTION,
	MENU_ITEM_COLLECTION,
	MENU_PROMO_ITEM_COLLECTION,
} from '../app/constants/menuConstants';
import Head from 'next/head';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/clientApp';
import { getCurrency } from '../app/utils/currency';
import { IPoints } from '../app/types/loyaltyTypes';
import { POINTS_COLLECTION } from '../app/constants/loyaltyConstants';
import DateMethods from '../app/utils/date';

const MyHome = () => {
	const [loading, setLoading] = useState(true);
	const { adminId, userId, access, userType, phone } = useAuthIds();
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [currency, setCurrency] = useState('US$');
	const [points, setPoints] = useState(0);
	const [pointsCol, setPointsCol] = useState<IPoints[]>([]);
	const [promos, setPromos] = useState<IMenuItemPromotions[]>([]);

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
		getPoints();
		getOrders();
		getPromos();
		logEvent(analytics, 'my_home_page_visit');
	}, []);

	const getOrders = async () => {
		let currny = await getCurrency();
		setCurrency(currny);

		getDataFromDBOne(ORDER_COLLECTION, 'customerPhone', phone)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setOrders((orders) => [
							...orders,
							{
								id: element.id,
								adminId: d.adminId,
								clientId: d.clientId,
								deliveryMethod: d.deliveryMethod,
								orderNo: d.orderNo,
								items: d.items,
								status: d.status,
								statusCode: d.statusCode,
								userId: d.userId,
								customerName: d.customerName,
								tableNo: d.tableNO,
								date: d.date,
								dateString: d.dateString,
								totalCost: d.totalCost,
								deliveryLocation: d.deliveryLocation,
								customerAddress: d.customerAddress,
								customerEmail: d.customerEmail,
								customerPhone: d.customerPhone,
								deliveredSignature: d.deliveredSignature,
								deliverer: d.deliverer,
								deliveryDate: d.deliveryDate,
								deliveryDateString: d.deliveryDateString,
								deliveryTime: d.deliveryTime,
								confirmed: d.confirmed,
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

	const getPoints = () => {
		getDataFromDBTwo(POINTS_COLLECTION, 'customerPhone', phone, 'used', false)
			.then((v) => {
				if (v !== null) {
					let pnts: number = 0;
					v.data.forEach((element) => {
						let d = element.data();

						setPointsCol((points) => [
							...points,
							{
								adminId: d.adminId,
								userId: d.userId,
								id: d.id,
								dateString: d.dateString,
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

						pnts += d.pointsTotal;
					});

					setPoints(pnts);
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	const getPromos = () => {
		getDataFromAll(MENU_PROMO_ITEM_COLLECTION)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						if (
							DateMethods.diffDatesDays(new Date().toDateString(), d.endDate) >
							0
						) {
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
						}
					});
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	return (
		<div>
			{/* <Joyride
                steps={steps}
                showProgress={true}
                continuous={true}
                styles={{
                    options: {
                        primaryColor: "#00947a"
                    }
                }}
            /> */}

			<div>
				<div className='flex flex-col min-h-screen h-full'>
					<div className='lg:col-span-3' id='nav'>
						<ClientNav organisationName={'Vision Is Primary'} url={'home'} />
					</div>

					{loading ? (
						<div className='flex flex-col justify-center items-center w-full col-span-9'>
							<Loader color={''} />
						</div>
					) : (
						<div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8 '>
							<div className='mt-5'>Points</div>
							<div className='grid  grid-cols-1  lg:grid-cols-4 shadow-lg p-8 rounded-[25px] place-items-center'>
								<div className='flex flex-col items-center border-none lg:border-r-2'>
									<h1 className='text-2xl'>{points}</h1>
									<h1>Points</h1>
								</div>

								<div className='flex flex-row space-x-1 lg:space-x-0 lg:flex-col justify-center items-center '>
									<h1 className='text-md'>{orders.length}</h1>
									<h1 className='text-xs'>Orders made</h1>
								</div>
							</div>
							<div className='mt-5'>My Recent Orders</div>
							<div className='my-5'>
								{orders.length > 0 ? (
									<div>
										<div className='mt-5'>Recent Orders</div>

										<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4 '>
											{orders.slice(0, 4).map((v) => {
												return (
													<div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
														<h1 className='font-bold text-xl text-[#8b0e06]'>
															Order No: {v.orderNo}
														</h1>
														<h1 className='font-bold text-sm'>
															Due: {currency} {v.totalCost.toFixed(2)}
														</h1>
														<h1 className='font-bold text-sm'>
															{v.customerName}
														</h1>
														<div className='flex flex-row justify-between space-x-2'>
															<div className='w-25 h-25'>
																<CircularProgressbar
																	value={v.status}
																	text={`${v.status}%`}
																	styles={buildStyles({
																		// Rotation of path and trail, in number of turns (0-1)
																		rotation: 0,
																		// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
																		strokeLinecap: 'round',
																		// Text size
																		textSize: '11px',
																		// How long animation takes to go from one percentage to another, in seconds
																		pathTransitionDuration: 0.5,
																		// Can specify path transition in more detail, or remove it entirely
																		// pathTransition: 'none',
																		// Colors
																		pathColor: `#8b0e06`,
																		textColor: '#f88',
																		trailColor: '#d6d6d6',
																		backgroundColor: '#8b0e06',
																	})}
																/>
															</div>
														</div>
														<Disclosure>
															<Disclosure.Button
																className={'-ml-16 underline text-xs'}
															>
																See Order Details
															</Disclosure.Button>
															<Disclosure.Panel>
																{v.items.map((r) => (
																	<div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
																		<h1 className='text-nd'>{r.title}</h1>
																		<p className='text-xs'>{r.description}</p>
																	</div>
																))}
															</Disclosure.Panel>
														</Disclosure>
													</div>
												);
											})}
										</div>
									</div>
								) : (
									<p>Looks like you are yet to receive any orders</p>
								)}
							</div>
							<div className='mt-5'>Latest Promotions</div>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 shadow-lg p-8 rounded-[25px]'></div>
							{/* <div className='mt-5'>My Favorites</div>
							<div className='grid grid-cols-1 md:grid-cols-2 shadow-lg p-8 rounded-[25px]'></div> */}
						</div>
					)}
				</div>

				<ToastContainer position='top-right' autoClose={5000} />
			</div>
		</div>
	);
};

export default MyHome;
