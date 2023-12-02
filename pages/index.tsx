import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import {
	ENTERPRISE_PACKAGE,
	ENTERPRISE_PACKAGE_PRICE,
	FOODIES_BOOTH_URL,
	FOURTH_COLOR,
	FREE_PACKAGE,
	FREE_PACKAGE_PRICE,
	PRIMARY_COLOR,
	SECONDARY_COLOR,
	SOLO_PACKAGE,
	SOLO_PACKAGE_PRICE,
	TEAM_PACKAGE,
	TEAM_PACKAGE_PRICE,
	THIRD_COLOR,
	WHATSAPP_CONTACT,
} from '../app/constants/constants';
import Header from '../app/components/welcomePage/header/header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { print } from '../app/utils/console';
import Loader from '../app/components/loader';
import WebsiteHandler from '../app/components/website/webHandler';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../app/constants/menuConstants';
import { getDataFromAll } from '../app/api/mainApi';
import { IMeal } from '../app/types/menuTypes';
import ShowImage from '../app/components/showImage';
import { IWebsiteOneInfo } from '../app/types/websiteTypes';
import { WEBSITE_INFO_COLLECTION } from '../app/constants/websiteConstants';
import { Disclosure, Switch } from '@headlessui/react';
import { SocialIcon } from 'react-social-icons';
import DateMethods from '../app/utils/date';
import YouTube from 'react-youtube';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/clientApp';
import { getCookie } from 'react-use-cookie';
import { getCurrency, subscriptionPrice } from '../app/utils/currency';

const Home: NextPage = () => {
	const [trackingId, settrackingId] = useState('AW-11208371394');
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [business, setBusiness] = useState('');
	const [isOtherWebsite, setIsOtherWebsite] = useState(false);
	const [meals, setMeals] = useState<IMeal[]>([]);
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);
	const [services, setServices] = useState<any[]>([
		{
			title: 'Customizable Website',
			description:
				'FoodiesBooth will help you have your own customizable website, with your own unique name, which would allow people to order from your website, place reservations, contact you directly',
		},
		{
			title: 'Order Management',
			description:
				'FoodiesBooth will help you capture orders and their lifecycle to remove any bottle necks and ensure customers are fully satisfied',
		},
		{
			title: 'Menu Management',
			description:
				'FoodiesBooth will help you easily create, edit and manage your Menu.From creating regular Menu, to creating promotions in a simple way',
		},

		{
			title: 'Cash Management',
			description:
				'FoodiesBooth will help you easily record the transactions in your business.Understand your business like never before',
		},

		{
			title: 'Listing on our Market Place',
			description:
				'FoodiesBooth will automatically list your Menu Items and Meals on our Market Place giving you incredible exposure to new customers',
		},
		{
			title: 'Shift Management',
			description:
				'FoodiesBooth will help you arrange staff shift and produce a log book to make payroll very simple',
		},
		{
			title: 'Delivery Management',
			description:
				'FoodiesBooth will handle all your deliveries and you can focus on what matters the most, making every bite memorable',
		},
		{
			title: 'Stock Management',
			description:
				'FoodiesBooth will help you measure stock level, and be able to make data based decisions to ensure you continue to provide the best service to your customers',
		},
	]);
	const [pricing, setPricing] = useState<any[]>([
		{
			title: FREE_PACKAGE,
			pricing: FREE_PACKAGE_PRICE,
			desc: 'For those who just want more visibility for their brand',
			feats: ['Website', 'Hosting'],
		},
		{
			title: SOLO_PACKAGE,
			pricing: SOLO_PACKAGE_PRICE,
			desc: 'For those who are just starting',
			feats: [
				'Editable Website',
				'Hosting',
				'Order Management',
				'Customer Reward Program',
				'Menu Management',
				'Stock Management',
				'Cash Management',
				'Market Place Listing',
				'Delivery Management',
				'1 User',
			],
		},
		{
			title: TEAM_PACKAGE,
			pricing: TEAM_PACKAGE_PRICE,
			desc: 'For those who are growing and have a have a team',
			feats: [
				'Editable Website',
				'Hosting',
				'Order Management',
				'Customer Reward Program',
				'Menu Management',
				'Stock Management',
				'Cash Management',
				'Market Place Listing',
				'Delivery Management',
				'5 users',
				'',
			],
		},
		{
			title: ENTERPRISE_PACKAGE,
			pricing: ENTERPRISE_PACKAGE_PRICE,
			desc: 'For businesses that have an entire team',
			feats: [
				'Editable Website',
				'Hosting',
				'Order Management',
				'Customer Reward Program',
				'Menu Management',
				'Stock Management',
				'Cash Management',
				'Market Place Listing',
				'Delivery Management',
				'Shift Management',
				'Unlimited Number of users',
			],
		},
	]);
	const [enabled, setEnabled] = useState(false);
	const [faqs, setFaqs] = useState<any[]>([
		{
			que: 'What is FoodiesBooth Market Place?',
			answer:
				'FoodiesBooth Market Place is an online place to help you make orders to the best Food Businesses in the country at a click of a button',
		},
		{
			que: 'How does FoodiesBooth work?',
			answer:
				'We serve the best Food Businesses in the country, helping take care of the operations so they can focus on making every bite memorable',
		},
		{
			que: 'Can I use FoodiesBooth for free?',
			answer:
				'FoodiesBooth is a subscription service, but allows for 7 days FREE trial, to allow you to see how much it can change your Food Business',
		},
		{
			que: 'Is FoodiesBooth affiliated to the Food Businesses on the Market Place?',
			answer:
				'FoodiesBooth helps Food Businesses but does not have any affiliation with any Food Business',
		},
		{
			que: 'Is the FoodiesBooth secure and protects my data?',
			answer:
				'Foodies Booth data is encrypted and uses the best standards for protecting data and is not shared with anyone',
		},
		{
			que: 'Does the FoodiesBooth have features that are specific to my type of restaurant?',
			answer: 'Yes, FoodiesBooth caters for all sizes of Food Businesses.',
		},
		{
			que: 'Can FoodiesBooth handle the volume of business I do?',
			answer:
				'FoodiesBooth is built to handle millions of users without problems, built on top of one of the best infrastructures in the world.It can handle volumes of any s',
		},
	]);
	const [socials, setSetsocials] = useState<any[]>([
		'https://www.instagram.com/foodiesboothofficial',
		'https://www.tiktok.com/foodiesboothofficial',
		'https://www.facebook.com/foodiesboothofficial',
		'https://www.twitter.comfoodiesbooth',
	]);
	const [ytV, setYTV] = useState<any[]>([
		'NF1Eu-PHhqU',
		'byJM-b5YtVo',
		'KO0pDE711uM',
		'2U1Ny1Nw9HI',
	]);
	const [price, setPrice] = useState(0);
	const [priceTeam, setPriceTeam] = useState(0);
	const [priceEnt, setPriceEnt] = useState(0);
	const [currency, setCurrency] = useState('US$');

	useEffect(() => {
		let url = window.location.href;
		let buz = '';
		if (url.includes('localhost')) {
			buz = url.slice(7, url.indexOf('.localhost'));
		} else {
			buz = url.slice(8, url.indexOf('.foodiesbooth.com'));
		}

		if (buz !== '' && !buz.includes(':') && buz !== 'www') {
			setIsOtherWebsite(true);
			setBusiness(buz);
			setLoading(false);
		} else {
			getMenuItems();
			logEvent(analytics, 'welcome_page_visit');
			setLoading(false);
		}
	}, []);

	const getMenuItems = async () => {
		let p = await subscriptionPrice(11);
		let priceT = await subscriptionPrice(29);
		let priceE = await subscriptionPrice(49);
		setPrice(p);
		setPriceTeam(priceT);
		setPriceEnt(priceE);
		let currny = await getCurrency();
		setCurrency(currny);

		getDataFromAll(MENU_ITEM_COLLECTION)
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
					});
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});

		getDataFromAll(WEBSITE_INFO_COLLECTION)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						let ifOpen = DateMethods.checkIfOpen(new Date(), d.daysOfWork);
						if (ifOpen) {
							setBooths((booths) => [
								...booths,
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
									address: d.adress,
									phone: d.phone,
									date: d.date,
									dateString: d.dateString,
									deliveryCost: d.deliverycost,
									mapLocation: d.mapLocation,
									daysOfWork: d.daysOfWork,
									radius: d.radius,
									prepTime: d.prepTime,
									socialMedialinks: d.socialMedialinks,
									freeDeliveryAreas: d.freeDeliveryarea,
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

	const onReady = (event: { data?: any; target: any }) => {
		event.target.pauseVideo();
	};

	const getPackagePrice = (packages: number) => {
		if (packages == 0) {
			return 0;
		} else if (packages == 9) {
			return price;
		} else if (packages == 29) {
			return priceTeam;
		} else {
			return priceEnt;
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex items-center content-center w-full h-screen justify-center p-16'>
					<Loader color={''} />
				</div>
			) : (
				<div className='w-full h-full'>
					{isOtherWebsite ? (
						<WebsiteHandler business={business} />
					) : (
						<div className='relative  w-full h-full'>
							<Header />
							<div className='flex flex-col p-4' id='menu'>
								<div className='flex justify-between content-center items-center mb-6'>
									<h1
										className='text-2xl'
										onClick={() => {
											router.push('/market');
										}}
									>
										Open Market Place
									</h1>
									<div
										className='flex flex-row space-x-4 max-w-[800px] overflow-x-auto'
										onClick={() => {
											router.push('/market');
										}}
									>
										<h1 className='underline'>See all</h1>
									</div>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
									{meals.slice(0, 8).map((v) => (
										<div className='flex flex-col justify-between shadow-2xl rounded-[25px]'>
											<div className='flex flex-col'>
												<ShowImage
													src={`/${v.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
													alt={'Meal Item'}
													style={'rounded-[25px] h-64 w-full'}
												/>
												<h1 className='font-bold text-xl px-4'>{v.title}</h1>
											</div>

											<div className='flex flex-row justify-between p-4 items-center'>
												<h1 className='font-bold text-xl'>
													{currency}
													{v.price}
												</h1>
												<button
													onClick={() => {
														router.push('/market');
													}}
													className='py-2 px-5 text-white rounded-[25px] w-1/2'
													style={{ backgroundColor: PRIMARY_COLOR }}
												>
													Order Now
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className='flex flex-col mb-6' id='booths'>
								<h1 className='text-4xl text-center mb-12'>
									The Best Food Businesses in the country
								</h1>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-8'>
									{booths.slice(0, 3).map((v) => (
										<div className='relative shadow-2xl rounded-[25px] p-4 w-full'>
											<div className='p-4'>
												<p className='text-xl'>{v.serviceProviderName}</p>
												<div className='flex flex-col'>
													<div className='w-full'>
														<p className='text-md'>
															{v.aboutUsInfo.slice(0, 52)}...
														</p>
													</div>
													<div className='flex flex-row space-x-2'>
														<button
															onClick={() => {
																router.push(
																	`${v.websiteName}.${FOODIES_BOOTH_URL}`
																);
															}}
															className='relative rounded-full p-2'
															style={{ backgroundColor: PRIMARY_COLOR }}
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
														<button
															onClick={() => {
																router.push(
																	`${v.websiteName}.${FOODIES_BOOTH_URL}`
																);
															}}
															className='relative rounded-full p-2'
															style={{ backgroundColor: PRIMARY_COLOR }}
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
																	d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
																/>
															</svg>
														</button>
													</div>
												</div>
											</div>
											<div className='absolute -top-10 -left-10 right-10 z-10 '>
												<ShowImage
													src={`/${v.websiteName}/logo/${v.logo.thumbnail}`}
													alt={'Logo'}
													style={'rounded-full h-20 w-20 '}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
							<div
								className='flex flex-col justify-center items-center'
								id='services'
							>
								<div className='shadow-xl rounded-[25px] p-4 w-fit h-fit mb-6'>
									<h1 className='text-6xl'>Focus on what matters most</h1>
								</div>
								<p className='m-4'>
									We do all the dirty work and let you focus on making{' '}
									<span style={{ color: PRIMARY_COLOR }}>
										every bite memorable
									</span>
								</p>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 p-8 place-items-center place-content-center'>
									{services.map((v) => (
										<div className='relative shadow-2xl rounded-[25px] p-4 w-5/6 h-42'>
											<div className='p-4'>
												<p className='text-xl'>{v.title}</p>
												<div className='w-full'>
													<p className='text-md'>{v.description}</p>
												</div>
											</div>
											<div className='absolute -top-10 -left-10 right-10 z-10 '>
												<img
													className='rounded-full h-20 w-20 '
													src='images/logo3.png'
												/>
											</div>
										</div>
									))}
								</div>
							</div>
							<h1 className='text-4xl text-center mb-12'>
								Learn to use the system with these overview videos
							</h1>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center mb-6'>
								{ytV.map((v) => (
									<div className='rounded-[20px] shadow-xl w-fit h-fit p-3'>
										<YouTube
											videoId={v}
											opts={{
												height: '200',
												width: '250',
												playerVars: {
													// https://developers.google.com/youtube/player_parameters
													autoplay: 0,
												},
											}}
										/>
									</div>
								))}
							</div>
							<div
								className='flex flex-col justify-center items-center'
								id='pricing'
							>
								<div>
									<h1 className='text-4xl'>Pricing</h1>
								</div>
								<div className='text-2xl'>
									{enabled ? (
										<div className='flex flex-row'>
											<h1>Yearly</h1>/<h1 className='line-through'>Monthly</h1>
										</div>
									) : (
										<div className='flex flex-row'>
											<h1 className='line-through'>Yearly</h1>/<h1>Monthly</h1>
										</div>
									)}
								</div>
								<div className='grid place-items-center'>
									<Switch
										checked={enabled}
										onChange={setEnabled}
										style={{
											backgroundColor: enabled ? PRIMARY_COLOR : FOURTH_COLOR,
										}}
										className={`$
                        					relative inline-flex h-[28px] w-[74px] shrink-0 cursor-pointer rounded-[25px] border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
									>
										<span className='sr-only text-black'>Annual Payment</span>
										<span
											aria-hidden='true'
											className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                      							pointer-events-none inline-block h-[24px] w-[34px] transform rounded-[25px] bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
										/>
									</Switch>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
									{pricing.map((v) => {
										return (
											<div className='shadow-xl w-full flex flex-col justify-between p-4 rounded-[25px]'>
												<div className='flex flex-col'>
													<h1 className='text-4xl'>{v.title}</h1>
													<p>{v.desc}</p>
													<h1 className='text-2xl'>
														{currency}
														{enabled
															? getPackagePrice(v.pricing) * 11
															: getPackagePrice(v.pricing)}
													</h1>
													<p>/{enabled ? 'year' : 'month'}</p>
													<h1 className='text-xl'>Features You will love</h1>
													<div className='p-4'>
														<ul className='list-disc'>
															{v.feats.map((v: string) => {
																return <li className='text-sm'>{v}</li>;
															})}
														</ul>
													</div>
												</div>

												<div className='m-4'>
													<button
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
															color: PRIMARY_COLOR,
														}}
													>
														Try for free
													</button>
												</div>
											</div>
										);
									})}
								</div>
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2 p-8'>
								<div>
									<h1 className='text-2xl'>Frequently Asked Questions</h1>
								</div>
								<div>
									{faqs.map((v) => (
										<Disclosure>
											<Disclosure.Button
												className={
													'w-full flex flex-row space-x-4 items-start shadow-md p-4 rounded-[25px] content-center'
												}
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
														d='M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
													/>
												</svg>

												{v.que}
											</Disclosure.Button>
											<Disclosure.Panel
												className={
													'w-full flex flex-row space-x-4 items-start shadow-md p-4 rounded-[25px]'
												}
											>
												{v.answer}
											</Disclosure.Panel>
										</Disclosure>
									))}
								</div>
							</div>
							<div
								style={{ backgroundColor: PRIMARY_COLOR }}
								className='h-48 grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center'
							>
								<div>
									<a>
										<p className='text-white underline'>Terms and Conditions</p>
									</a>
									<a>
										<p className='text-white underline'>Privacy Policy</p>
									</a>
								</div>
								<div>
									<h1 className='text-2xl text-white'>FoodiesBooth</h1>
									<p className='text-white'>&copy;2023 </p>
								</div>
								<div>
									<div className='grid grid-cols-4 gap-4'>
										{socials.map((v) => (
											<SocialIcon url={v} />
										))}
									</div>
								</div>
							</div>
							<Link href={WHATSAPP_CONTACT}>
								<img
									src='/images/whatsapp.png'
									className={
										'animate-bounce fixed bottom-20  right-10 h-16 w-16'
									}
								/>
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
