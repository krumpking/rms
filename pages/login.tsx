import React, { useEffect, useState } from 'react';
import {
	ACCESS,
	ADMIN_ID,
	COOKIE_EMAIL,
	COOKIE_NAME,
	COOKIE_ORGANISATION,
	COOKIE_PHONE,
	PRIMARY_COLOR,
	USER_ID,
} from '../app/constants/constants';
import { auth } from '../firebase/clientApp';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getCookie, setCookie } from 'react-use-cookie';
import { decrypt, encrypt } from '../app/utils/crypto';

import { COOKIE_AFFILIATE_NUMBER } from '../app/constants/affilliateConstants';
import { ADMIN_COLLECTION } from '../app/constants/userConstants';
import { getDataFromDBOne } from '../app/api/mainApi';
import { DELIVERERS_COLLECTION } from '../app/constants/deliveryConstants';
import { print } from '../app/utils/console';

const Login = (props: {
	changeIndex: (index: number, userId: string) => void;
	isDeliveryService: boolean;
}) => {
	const { changeIndex, isDeliveryService } = props;
	const [phone, setPhone] = useState('+263');
	const [accessCode, setAccessCode] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [userId, setUserId] = useState('');

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
	}, []);

	const login = () => {
		setLoading(true);
		if (sent) {
			window.confirmationResult
				.confirm(accessCode)
				.then((result: { user: any }) => {
					const user = result.user;
					const userId = user.uid;

					if (isDeliveryService) {
						getDataFromDBOne(DELIVERERS_COLLECTION, 'contact', phone)
							.then(async (v) => {
								if (v == null) {
									toast.error('You are not approved to access this page');
								} else {
									v.data.forEach((doc) => {
										let d = doc.data();
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
									});

									changeIndex(1, userId);
								}
							})
							.catch((e) => {
								toast.error(
									'There was an error getting your profile, please try again'
								);
								console.error(e);
							});
					} else {
						getDataFromDBOne(ADMIN_COLLECTION, 'contact', phone)
							.then(async (v) => {
								if (v == null) {
									toast.warn('User not found, please Sign Up');
									router.push({
										pathname: '/signup',
									});
								} else {
									v.data.forEach((doc) => {
										let d = doc.data();
										setCookie(USER_ID, encrypt(userId, ADMIN_ID), {
											days: 1,
											SameSite: 'Strict',
											Secure: true,
										});
										setCookie(ADMIN_ID, encrypt(d.adminId, ADMIN_ID), {
											days: 1,
											SameSite: 'Strict',
											Secure: true,
										});
										let accessKeys: string[] = [];

										d.access.forEach((element: any) => {
											accessKeys.push(encrypt(element, ADMIN_ID));
										});
										setCookie(ACCESS, accessKeys.toString(), {
											days: 1,
											SameSite: 'Strict',
											Secure: true,
										});
									});

									router.push({
										pathname: '/home',
									});
									setLoading(false);
								}
							})
							.catch((e) => {
								toast.error(
									'There was an error getting your profile, please try again'
								);
								console.error(e);
							});
					}

					// success
				})
				.catch((err: any) => {
					alert('The One Time Password you sent was not correct please retry');
					setLoading(false);
					console.error(err);
					toast.error(
						'There was an error with the One Time Password, please try again'
					);
				});
		} else {
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
		}
	};

	const shownSlides = [
		{
			image: '/images/bg-swurl.png',
		},
		{
			image: '/images/bg-swurl.png',
		},
		{
			image: '/images/bg-swurl.png',
		},
	];

	const slide = (image: string) => {
		return (
			<div className='w-full h-96 rounded-lg'>
				<img src={image} className='w-full h-full' />
			</div>
		);
	};

	return (
		<div
			className=' w-full h-screen p-4 md:p-8 2xl:p-16 '
			style={{ backgroundColor: PRIMARY_COLOR }}
		>
			<div className='bg-white h-full rounded-[25px] p-8'>
				{loading ? (
					<div className='w-full flex flex-col items-center content-center'>
						<Loader color={''} />
					</div>
				) : (
					<div>
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
						<div className='grid grid-cols-1 lg:grid-cols-2 place-items-center p-4 h-full'>
							<div className='hidden lg:block'>
								<img
									src={'images/webOneDefaultPicture.jpg'}
									className='h-96 w-full'
								/>
							</div>

							<div className=''>
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
													if (e.target.value.includes('+263')) {
														setPhone(e.target.value);
													}
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
                                        focus:border-primary
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
                                        border-primary
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
							</div>
						</div>
					</div>
				)}
			</div>
			<div id='recaptcha-container'></div>
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default Login;
