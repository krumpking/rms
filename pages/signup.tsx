import React, { useEffect, useState } from 'react';
import {
	ACCESS,
	ADMIN_ID,
	ENTERPRISE_PACKAGE,
	PRIMARY_COLOR,
	USER_ID,
} from '../app/constants/constants';
import { analytics, auth } from '../firebase/clientApp';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { setCookie } from 'react-use-cookie';
import { encrypt } from '../app/utils/crypto';
import Link from 'next/link';
import { subDays } from 'date-fns';
import Random from '../app/utils/random';
import { IUser } from '../app/types/userTypes';
import { createId } from '../app/utils/stringM';
import { IPayments } from '../app/types/paymentTypes';
import { addCustomer, addUser } from '../app/api/usersApi';
import { addDocument } from '../app/api/mainApi';
import { PAYMENTS_COLLECTION } from '../app/constants/paymentConstants';
import { logEvent } from 'firebase/analytics';
import { ICustomer } from '../app/types/customerTypes';
import { Tab } from '@headlessui/react';
import { CATEGORIES } from '../app/constants/menuConstants';
import Multiselect from 'multiselect-react-dropdown';
import MapPicker from 'react-google-map-picker';
import {
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
} from '../app/constants/websiteConstants';
import { PHONE_COOKIE, USER_TYPE } from '../app/constants/userConstants';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const SignUp = () => {
	const [phone, setPhone] = useState('');
	const [accessCode, setAccessCode] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [checked, setChecked] = useState(false);
	const [accessArray, setAccessArray] = useState<any[]>([
		'customer-loyalty',
		'menu',
		'orders',
		'move-from-pantry',
		'move-from-kitchen',
		'cash-in',
		'cash-out',
		'cash-report',
		'add-stock',
		'confirm-stock',
		'move-to-served',
		'add-reservation',
		'available-reservations',
		'staff-scheduling',
		'approve-schedule',
		'website',
		'payments',
		'stock-overview',
		'admin',
		'receipting',
		'staff-logs',
	]);
	const [tabs, setTabs] = useState(['Customer', 'Food Business']);
	const [customer, setCustomer] = useState<ICustomer>({
		userId: '',
		id: '',
		dateString: '',
		date: new Date(),
		customerName: '',
		customerPhone: '',
		customerEmail: '',
		address: '',
		location: '',
		prefferedCuisine: [],
	});
	const [selectedCuisine, setSelectedCuisine] = useState(CATEGORIES);
	const [latlong, setLatLng] = useState<any>();

	useEffect(() => {
		document.body.style.backgroundColor = PRIMARY_COLOR;
		auth.languageCode = 'en';
		window.recaptchaVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{
				size: 'invisible',
				callback: (response: any) => {
					// reCAPTCHA solved, allow signInWithPhoneNumber.
					// ...
				},
				'expired-callback': () => {
					// Response expired. Ask user to solve reCAPTCHA again.
					// ...
					window.location.reload();
				},
			},
			auth
		);
		logEvent(analytics, 'sign_up_page_visit');

		return () => {};
	}, []);

	const signUp = () => {
		if (checked) {
			setLoading(true);
			const appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(auth, phone, appVerifier)
				.then((confirmationResult) => {
					// SMS sent. Prompt user to type the code from the message, then sign the
					// user in with confirmationResult.confirm(code).
					toast.success('Passcode sent');
					setSent(true);
					window.confirmationResult = confirmationResult;

					setLoading(false);
					// ...
				})
				.catch((error) => {
					// Error; SMS not sent
					// ...
					console.error(error);
					setLoading(false);
					toast.error(error.message);
				});
		} else {
			toast.error(
				'It appears you are yet to agree to our Terms and Conditions'
			);
		}
	};

	const signIn = () => {
		setLoading(true);
		window.confirmationResult
			.confirm(accessCode)
			.then((result: { user: any }) => {
				const user = result.user;
				const userId = user.uid;

				if (customer.customerName !== '') {
					let newC = {
						...customer,
						userId: userId,
						location: latlong,
						prefferedCuisine: selectedCuisine,
					};

					addCustomer(newC)
						.then((v) => {
							setCookie(USER_ID, encrypt(userId, ADMIN_ID), {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});
							setCookie(USER_TYPE, '2', {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});
							setCookie(PHONE_COOKIE, encrypt(phone, ADMIN_ID), {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});

							router.push({
								pathname: '/myhome',
							});

							logEvent(analytics, 'customer_signups');
						})
						.catch((e) => {
							toast.error(e.message);
							setLoading(false);
							console.error(e);
						});
				} else {
					// success
					const admin: IUser = {
						id: createId(),
						userId: userId,
						adminId: userId,
						access: accessArray,
						date: new Date(),
						dateOfUpdate: new Date(),
						dateString: new Date().toDateString(),
						name: fullName,
						contact: phone,
						email: email,
					};

					addUser(admin)
						.then((v) => {
							const payment: IPayments = {
								id: Random.randomString(
									13,
									'abcdefghijkhlmnopqrstuvwxz123456789'
								),
								adminId: userId,
								duration: 30,
								userId: userId,
								dateAdded: new Date(),
								dateAddedString: new Date().toDateString(),
								paymentDate: subDays(new Date(), 23),
								paymentDateString: subDays(new Date(), 23).toDateString(),
								package: ENTERPRISE_PACKAGE,
								date: new Date(),
								amount: 0,
								refCode: '',
							};

							addDocument(PAYMENTS_COLLECTION, payment)
								.then((v: any) => {
									toast.success('7 day trial activated!!!');
								})
								.catch((er: any) => {
									console.error(er);
								});
							setCookie(USER_TYPE, '1', {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});

							setCookie(USER_ID, encrypt(userId, ADMIN_ID), {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});
							setCookie(ADMIN_ID, encrypt(userId, ADMIN_ID), {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});
							let accessKeys: string[] = [];

							accessArray.forEach((element) => {
								accessKeys.push(encrypt(element, ADMIN_ID));
							});
							setCookie(ACCESS, accessKeys.toString(), {
								days: 1,
								SameSite: 'Strict',
								Secure: true,
							});
							router.push({
								pathname: '/home',
							});

							logEvent(analytics, 'food_business_signups');
						})
						.catch((e) => {
							setLoading(false);
							console.error(e);
						});
				}
			})
			.catch((err: any) => {
				toast.error(err.message);
				setLoading(false);
			});
	};

	const handleChange = () => {
		setChecked(true);
	};

	const handleChangeCustomer = (e: any) => {
		if (e.target.name === 'customerPhone') {
			setPhone(e.target.value);
		}
		setCustomer({
			...customer,
			[e.target.name]: e.target.value,
		});
	};

	const handleChangeLocation = (lat: any, lng: any) => {
		setLatLng({ lat: lat, lng: lng });
	};

	return (
		<div>
			<div
				className='w-full min-h-screen h-full p-4 md:p-8 lg:p-16 '
				style={{ backgroundColor: PRIMARY_COLOR }}
			>
				<div className='bg-white h-full rounded-[25px]  flex flex-col p-8 '>
					<div className='h-16'>
						<a href='/'>
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
									d='M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75'
								/>
							</svg>
						</a>
					</div>
					{loading ? (
						<Loader color={''} />
					) : (
						<div className='flex flex-col justify-center items-center content-center p-1 	md:p-4 '>
							<div className='hidden lg:block'>
								<img
									src={'images/webOneDefaultPicture.jpg'}
									className='h-96 w-full'
								/>
							</div>

							<div className='w-full flex flex-col justify-center items-center'>
								<div className='flex flex-col justify-center items-center'>
									<img src='images/logo.png' className='w-full h-32' />
								</div>
								<div className='w-full'>
									{sent ? (
										<form
											onSubmit={(e) => {
												e.preventDefault();
												signIn();
											}}
										>
											<div className='mb-6'>
												<input
													type='text'
													value={accessCode}
													placeholder={'Please enter the One Time Password'}
													onChange={(e) => {
														setAccessCode(e.target.value);
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
                                                '
													required
												/>
											</div>

											<div className='mb-10'>
												<input
													type='submit'
													value={'Login'}
													className='
                                                    text-white
                                                        font-bold
                                                        w-full
                                                        rounded-[25px]
                                                        border-2
                                                        border-primary
                                                        py-3
                                                        px-5
                                                        text-base 
                                                        text-[white
                                                        cursor-pointer
                                                        hover:bg-opacity-90
                                                        transition
                                            '
													style={{ backgroundColor: PRIMARY_COLOR }}
												/>
											</div>
										</form>
									) : (
										<Tab.Group>
											<Tab.List className='flex space-x-4 rounded-[25px] bg-[#f3f3f3] p-1 overflow-x-auto whitespace-nowrap'>
												{tabs.map((category) => (
													<Tab
														key={category}
														className={({ selected }) =>
															classNames(
																'w-full  py-2.5 text-sm font-medium leading-5 text-black rounded-[25px]',
																'ring-white m-1',
																selected
																	? 'bg-white shadow-md focus:outline-none p-4'
																	: 'text-black hover:bg-white/[0.12] hover:text-white focus:outline-none'
															)
														}
													>
														{category}
													</Tab>
												))}
											</Tab.List>
											<Tab.Panels className='mt-2 '>
												<Tab.Panel
													className={classNames(
														'rounded-xl bg-white p-1 md:p-3',
														'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
													)}
												>
													<form
														onSubmit={(e) => {
															e.preventDefault();
															signUp();
														}}
													>
														<p className='text-center text-xl text-black-300 mb-4 font-bold'>
															Register for FREE
														</p>
														<div className='mb-6'>
															<input
																type='text'
																value={customer.customerName}
																placeholder={'Full Name'}
																name='customerName'
																onChange={handleChangeCustomer}
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
																value={customer.customerPhone}
																placeholder={
																	'Phone (include country your code )'
																}
																onChange={handleChangeCustomer}
																name='customerPhone'
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
																value={customer.customerEmail}
																name='customerEmail'
																placeholder={'Email'}
																onChange={handleChangeCustomer}
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
															<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
																Select Favorite Cuisine
															</p>
															<Multiselect
																isObject={false}
																onRemove={(selectedItem: any) => {
																	setSelectedCuisine(
																		selectedCuisine.filter((element) => {
																			return element !== selectedItem;
																		})
																	);
																}}
																onSelect={(
																	selectedList: React.SetStateAction<string[]>
																) => {
																	setSelectedCuisine(selectedList);
																}}
																options={CATEGORIES}
																displayValue='Sunday'
																placeholder='Select Favorite Cuisine'
																style={{
																	chips: {
																		background: PRIMARY_COLOR,
																		'border-radius': '25px',
																	},
																	multiselectContainer: {
																		color: PRIMARY_COLOR,
																	},
																	searchBox: {
																		border: 'display',
																		// height: '0px',
																		'border-bottom':
																			'2px solid ' + PRIMARY_COLOR,
																		'border-top': '2px solid ' + PRIMARY_COLOR,
																		'border-radius': '25px',
																		padding: '4px',
																		color: PRIMARY_COLOR,
																		':hover': PRIMARY_COLOR,
																	},
																}}
															/>
														</div>
														<div className='mb-6'>
															<input
																type='text'
																value={customer.address}
																name='address'
																placeholder={'Address'}
																onChange={handleChangeCustomer}
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
															<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full rounded-[25px]'>
																Click to select your location
															</p>
															<div className='mb-6 w-full'>
																<MapPicker
																	defaultLocation={DEFAULT_LOCATION}
																	zoom={DEFAULT_ZOOM}
																	// mapTypeId={createId()}
																	style={{ height: '300px', width: '100%' }}
																	onChangeLocation={handleChangeLocation}
																	apiKey={MAP_API}
																/>
															</div>
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
												</Tab.Panel>
												<Tab.Panel
													className={classNames(
														'rounded-xl bg-white p-1 md:p-3',
														'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
													)}
												>
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
																placeholder={
																	'Phone (include country your code )'
																}
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
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
				<div id='recaptcha-container'></div>
				<ToastContainer position='top-right' autoClose={5000} />
			</div>
		</div>
	);
};

export default SignUp;
