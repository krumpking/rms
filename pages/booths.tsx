import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../app/components/loader';
import {
	AMDIN_FIELD,
	PRIMARY_COLOR,
	PRIMARY_URL_LOCAL,
} from '../app/constants/constants';
import { IMeal, IMenuItem } from '../app/types/menuTypes';
import {
	DAYS_OF_THE_WEEK_ARRAY,
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
	WEBSITE_INFO_COLLECTION,
} from '../app/constants/websiteConstants';
import {
	addDocument,
	getDataFromAll,
	getDataFromDBOne,
} from '../app/api/mainApi';
import {
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../app/constants/menuConstants';
import {
	findOccurrencesObjectId,
	searchStringInArray,
} from '../app/utils/arrayM';
import { IOrder } from '../app/types/orderTypes';
import ShowImage from '../app/components/showImage';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';
import { ORDER_COLLECTION } from '../app/constants/orderConstants';
import Drawer from '../app/components/drawer';
import { numberWithCommas } from '../app/utils/stringM';
import MapPicker from 'react-google-map-picker';
import { IWebsiteOneInfo } from '../app/types/websiteTypes';
import MarketPlace from '../app/components/market/marketPlace';
import BoothsComp from '../app/components/booths/boothsComp';
import DateMethods from '../app/utils/date';
import Head from 'next/head';

const Booths = () => {
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
		customerPhone: '',
		customerAddress: '',
		deliveryLocation: null,
		tableNo: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		deliveryDate: new Date(),
		deliveryDateString: '',
		deliveryTime: '',
		deliveredSignature: null,
		deliverer: '',
		confirmed: false,
	});
	const [addItems, setAddItems] = useState<any[]>([]);
	const [websiteName, setWebsiteName] = useState('websitename');
	const [webfrontname, setWebfrontname] = useState('webfrontId');
	const [loadDist, setLoadDist] = useState(false);
	const [booths, setBooths] = useState<IWebsiteOneInfo[]>([]);
	const [index, setIndex] = useState(0);
	const [info, setInfo] = useState<IWebsiteOneInfo>({
		id: '',
		websiteName: '',
		adminId: '',
		userId: '',
		logo: {
			original: '',
			thumbnail: '',
		},
		serviceProviderName: '',
		headerImage: {
			original: '',
			thumbnail: '',
		},
		headerTitle: '',
		headerText: '',
		aboutUsImage: {
			original: '',
			thumbnail: '',
		},
		aboutUsTitle: '',
		aboutUsInfo: '',
		themeMainColor: '#8b0e06',
		themeSecondaryColor: '#8b0e06',

		reservation: true,
		contactUsImage: {
			original: '',
			thumbnail: '',
		},
		email: '',
		address: '',
		phone: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		deliveryCost: 0,
		mapLocation: DEFAULT_LOCATION,
		daysOfWork: DAYS_OF_THE_WEEK_ARRAY,
		radius: 50,
		freeDeliveryAreas: [],
		prepTime: 48,
		socialMedialinks: [],
	});

	useEffect(() => {
		getWebsites();
		// getMeals();
		// getMenuItems();
	}, []);

	const getWebsites = () => {
		getDataFromAll(WEBSITE_INFO_COLLECTION)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						let ifOpen = DateMethods.checkIfOpen(new Date(), d.daysOfWork);
						if (ifOpen) {
							setBooths((meals) => [
								...meals,
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
									address: d.address,
									phone: d.phone,
									date: d.date,
									dateString: d.dateString,
									deliveryCost: d.deliveryCost,
									mapLocation: d.mapLocation,
									daysOfWork: d.daysOfWork,
									radius: d.radius,
									freeDeliveryAreas: d.freeDeliveryAreas,
									prepTime: d.prepTime,
									socialMedialinks: d.socialMedialinks,
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

	const getView = () => {
		switch (index) {
			case 0:
				return (
					<BoothsComp
						changeIndex={(info: IWebsiteOneInfo, index: number) => {
							setIndex(index);
							setInfo(info);
						}}
					/>
				);
			case 1:
				return (
					<MarketPlace
						info={[info]}
						changeIndex={(index: number) => {
							setIndex(index);
						}}
						borderRadius={'rounded-md'}
					/>
				);

			default:
				break;
		}
	};

	return (
		<div className='min-h-screen h-full'>
			{loading ? (
				<div className='flex flex-col items-center content-center min-h-screen h-full'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-4 '>{getView()}</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default Booths;
