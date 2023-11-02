import React, { useEffect, useState } from 'react';
import {
	ACCESS,
	ADMIN_ID,
	ENTERPRISE_PACKAGE,
	PRIMARY_COLOR,
	USER_ID,
} from '../app/constants/constants';
import { auth } from '../firebase/clientApp';
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
import { addUser } from '../app/api/usersApi';
import { addDocument } from '../app/api/mainApi';
import { PAYMENTS_COLLECTION } from '../app/constants/paymentConstants';

const SignUp = () => {
	const [phone, setPhone] = useState('+263');
	const [accessCode, setAccessCode] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [checked, setChecked] = useState(false);
	const [accessArray, setAccessArray] = useState<any[]>([
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

	useEffect(() => {
		document.body.style.backgroundColor = PRIMARY_COLOR;
		auth.languageCode = 'en';
		window.recaptchaVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{
				size: 'visible',
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

		return () => {};
	}, []);

	const signUp = () => {
		if (checked) {
			setLoading(true);
			toast.info(
				'Please check the box to ensure your are not a robot,scroll to your bottom left'
			);
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
					toast.error(
						'There was an error please refresh the page and try again'
					);
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
						setLoading(false);
					})
					.catch((e) => {
						setLoading(false);
						console.error(e);
					});
			})
			.catch((err: any) => {
				toast.error(
					'The One Time Password you sent was not correct please retry'
				);
				setLoading(false);
			});
	};

	const handleChange = () => {
		setChecked(true);
	};

	return (
		<div>
			<div
				className='w-full h-full p-4 md:p-8 lg:p-16 '
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
						<div className='grid grid-cols-1 lg:grid-cols-2 place-items-center p-4 '>
							<div className='hidden lg:block'>
								<img
									src={'images/webOneDefaultPicture.jpg'}
									className='h-96 w-full'
								/>
							</div>

							<div className='w-full flex justify-center items-center'>
								<div>
									{sent ? (
										<form
											onSubmit={(e) => {
												e.preventDefault();
												signIn();
											}}
										>
											<div className='flex flex-col justify-center items-center'>
												<img src='images/logo.png' className='w-full h-32' />
											</div>
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
										<form
											onSubmit={(e) => {
												e.preventDefault();
												signUp();
											}}
										>
											<div className='flex flex-col justify-center items-center'>
												<img src='images/logo.png' className='w-full h-32' />
											</div>
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
														if (e.target.value.includes('+263')) {
															setPhone(e.target.value);
														}
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
