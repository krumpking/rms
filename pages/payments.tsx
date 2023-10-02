import React, { useEffect, useState } from 'react';
import {
	ADMIN_ID,
	AMDIN_FIELD,
	COOKIE_PHONE,
	LIGHT_GRAY,
	PRIMARY_COLOR,
	PRODUCTION_CLIENT_ID,
} from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import PaypalCheckoutButton from '../app/components/paypalButton';
import ReactPaginate from 'react-paginate';
import { getCookie } from 'react-use-cookie';
import DateMethods from '../app/utils/date';
import Random from '../app/utils/random';
import { decrypt } from '../app/utils/crypto';
import { IPayments } from '../app/types/paymentTypes';
import { getPayments, getPromo } from '../app/api/paymentApi';
import { print } from '../app/utils/console';
import AppAccess from '../app/components/accessLevel';
import { addDocument, getDataFromDBOne } from '../app/api/mainApi';
import { PAYMENTS_COLLECTION } from '../app/constants/paymentConstants';
import { useAuthIds } from '../app/components/authHook';
import { addDays } from 'date-fns';

const Payments = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [{ isPending }] = usePayPalScriptReducer();
	const [payments, setPayments] = useState<IPayments[]>([]);
	const [payment, setPayment] = useState<IPayments>({
		id: '',
		adminId: '',
		userId: '',
		dateAdded: new Date(),
		dateAddedString: new Date().toDateString(),
		paymentDate: new Date(),
		paymentDateString: new Date().toDateString(),
		amount: 0,
		duration: 30,
		refCode: '',
		package: 'Solo',
		date: new Date(),
	});
	const [pages, setPages] = useState(0);
	const [paymentsStart, setPaymentStart] = useState(0);
	const [paymentsEnd, setPaymentEnd] = useState(10);
	const [lastPaymentDate, setLastPaymentDate] = useState('');
	const [nextPaymentDate, setNextPaymentDate] = useState('');
	const [promoCode, setPromoCode] = useState('');
	const [category, setCategory] = useState([
		'Solo',
		'Small Team',
		'Enterprise',
	]);
	const [duration, setDuration] = useState([30, 90, 365]);
	const { adminId, userId, access } = useAuthIds();
	const [labels, setLabels] = useState([
		'DATE OF PAYMENT',
		'PAYMENT ID',
		'DURATION',
		'AMOUNT',
	]);

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
		getPayments();
	}, []);

	const getPayments = () => {
		getDataFromDBOne(PAYMENTS_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();
						setPayments((prevPay) => [
							...prevPay,
							{
								id: d.id,
								adminId: d.adminId,
								userId: d.userId,
								dateAdded: d.dateAdded,
								dateAddedString: d.dateAddedString,
								paymentDate: d.paymentDate,
								paymentDateString: d.paymentDateString,
								amount: d.amount,
								duration: d.duration,
								refCode: d.refCode,
								package: d.package,
								date: d.date,
							},
						]);

						setLastPaymentDate(d.dateAddedString);
						setNextPaymentDate(
							addDays(new Date(d.dateAddedString), d.duration).toDateString()
						);
					});
				}
			})
			.catch((e: any) => {
				console.error(e);
			});
	};

	const handlePageClick = (event: { selected: number }) => {
		let val = event.selected + 1;
		if (payments.length / 10 + 1 === val) {
			setPaymentStart(payments.length - (payments.length % 10));
			setPaymentEnd(payments.length);
		} else {
			setPaymentStart(Math.ceil(val * 10 - 10));
			setPaymentEnd(val * 10);
		}
	};

	const checkPromoCode = async () => {
		getPromo(promoCode)
			.then((value) => {
				if (value) {
					toast.success('Promo code accepted');

					const newPayment: IPayments = {
						...payment,
						id: Random.randomString(13, 'abcdefghijkhlmnopqrstuvwxz123456789'),
						userId: userId,
						adminId: adminId,
						dateAdded: new Date(),
						dateAddedString: new Date().toDateString(),
						paymentDate: new Date(),
						paymentDateString: new Date().toDateString(),
						amount: 0,
						refCode: 'Promo Code',
					};

					addDocument(PAYMENTS_COLLECTION, newPayment)
						.then((v) => {
							toast.success('Promo Successfully submitted');
						})
						.catch((er) => {
							console.error(er);
						});
				} else {
					toast.warn(
						'Your Promo code was not accepted, please check and try again, or contact support'
					);
				}
				setLoading(false);
			})
			.catch((er) => {
				console.error(er);
				setLoading(false);
			});
	};

	const handleChange = (e: any) => {
		setPayment({
			...payment,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<AppAccess access={access} component={'payments'}>
			<div>
				<div className='flex flex-col'>
					<div className='lg:col-span-3'>
						<ClientNav
							organisationName={'Vision Is Primary'}
							url={'payments'}
						/>
					</div>
					<div className='col-span-9 m-8 '>
						{loading ? (
							<div className='flex flex-col justify-center items-center w-full col-span-8'>
								<Loader color={''} />
							</div>
						) : (
							<div className='lg:grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<div className='flex flex-col  w-full col-span-1  space-y-4'>
									<div className='flex flex-col justify-center items-center w-full bg-white rounded-[30px] h-84 p-4'>
										<button
											className='font-bold rounded-[25px] border-2 bg-white px-4 py-3 w-full mb-2'
											style={{ borderColor: PRIMARY_COLOR }}
											onClick={(e) => e.preventDefault()}
										>
											<select
												onChange={handleChange}
												name='package'
												className='bg-white w-full'
												data-required='1'
												required
											>
												<option value='Delivery' hidden>
													Select Package
												</option>
												{category.map((v) => (
													<option value={v}>{v}</option>
												))}
											</select>
										</button>
										<button
											className='font-bold rounded-[25px] border-2 bg-white px-4 py-3 w-full mb-2 text-center'
											style={{ borderColor: PRIMARY_COLOR }}
											onClick={(e) => e.preventDefault()}
										>
											<select
												// value={order.deliveryMethod}
												onChange={handleChange}
												name='duration'
												className='bg-white w-full'
												data-required='1'
												required
											>
												<option value='Delivery' hidden>
													Select Duration
												</option>
												{duration.map((v) => (
													<option value={v}>{v}</option>
												))}
											</select>
										</button>
										<input
											type='text'
											value={payment.refCode}
											placeholder={'Refferial Code(If Available)'}
											name='refCode'
											onChange={handleChange}
											style={{
												borderColor: PRIMARY_COLOR,
											}}
											className='
                                                text-center
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
                                                mb-4
                                            '
											required
										/>
										<h1 className='col-span-3 m-4'>Make Payment</h1>
										{isPending ? (
											<Loader color={''} />
										) : (
											<PaypalCheckoutButton
												payment={payment}
												isReservationPayment={false}
												reservation={{
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
												}}
												color={''}
											/>
										)}
										<h1 className='col-span-3 m-4'>or</h1>
										<input
											type='text'
											value={promoCode}
											placeholder={'Promo Code'}
											onChange={(e) => {
												setPromoCode(e.target.value);
											}}
											style={{
												borderColor: PRIMARY_COLOR,
											}}
											className='
                                                text-center
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
                                                mb-4
                                            '
											required
										/>
										<button
											onClick={() => {
												setLoading(true);
												checkPromoCode();
											}}
											style={{
												backgroundColor: PRIMARY_COLOR,
												borderColor: PRIMARY_COLOR,
											}}
											className='
                                                font-bold
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-primary
                                                py-3
                                                px-5
                                                text-base
                                                text-white
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition
                                            '
										>
											Submit Promo Code
										</button>
									</div>
									<div
										className='p-5 h-64 rounded-[30px]'
										style={{ backgroundColor: PRIMARY_COLOR }}
									>
										<h1 className='text-white'>
											Last payment date: {lastPaymentDate}
										</h1>
										<h1 className='text-white'>
											Next payment date: {nextPaymentDate}
										</h1>
										<div className='h-3'></div>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											stroke-width='0.5'
											stroke='currentColor'
											className='col-span-1 w-48 h-48 text-white justify-self-center mb-2'
										>
											<path
												stroke-linecap='round'
												stroke-linejoin='round'
												d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'
											/>
										</svg>
									</div>
								</div>
								<div className='col-span-1 bg-white rounded-[30px] p-4'>
									<p>Payment History</p>
									{payments.length > 0 ? (
										<div>
											<table className='table-auto w-full'>
												<thead className='text-xs font-semibold uppercase text-gray-400 bg-gray-50'>
													<tr>
														{labels.map((v) => {
															return (
																<th className='p-2 whitespace-nowrap'>
																	<div className='font-semibold text-left'>
																		{v}
																	</div>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className='text-sm divide-y divide-gray-100'>
													{payments
														.slice(paymentsStart, paymentsEnd)
														.map((v) => (
															<tr key={v.id}>
																<td className='p-2 whitespace-nowrap'>
																	{v.paymentDateString}
																</td>
																<td className='p-2 whitespace-nowrap'>
																	<p className='text-left font-medium '>
																		{v.id}
																	</p>
																</td>
																<td className='p-2 whitespace-nowrap'>
																	<p className='text-sm text-center'>
																		{v.duration}
																	</p>
																</td>
																<td className='p-2 whitespace-nowrap'>
																	<p className='text-sm text-center'>
																		{v.amount}
																	</p>
																</td>
															</tr>
														))}
													<tr></tr>
												</tbody>
											</table>
											<div className='flex flex-row-reverse'>
												<ReactPaginate
													pageClassName='border-2 border-[#00947a] px-2 py-1 rounded-[30px]'
													previousLinkClassName='border-2 border-[#00947a] px-2 py-2 rounded-[25px] bg-[#00947a] text-white font-bold'
													nextLinkClassName='border-2 border-[#00947a] px-2 py-2 rounded-[25px] bg-[#00947a] text-white font-bold'
													breakLabel='...'
													breakClassName=''
													containerClassName='flex flex-row space-x-4 content-center items-center '
													activeClassName='bg-[#00947a] text-white'
													nextLabel='next'
													onPageChange={handlePageClick}
													pageRangeDisplayed={1}
													pageCount={pages}
													previousLabel='previous'
													renderOnZeroPageCount={() => null}
												/>
											</div>
										</div>
									) : (
										<p>No Payment History</p>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<ToastContainer position='top-right' autoClose={5000} />
			</div>
		</AppAccess>
	);
};

export default Payments;
