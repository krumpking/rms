import React, { useCallback, useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { IWebsite, IWebsiteOneInfo } from '../../../types/websiteTypes';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import ShowImage from '../../showImage';
import {
	addDocument,
	getDataFromDBOne,
	updateDocument,
	uploadFile,
} from '../../../api/mainApi';
import { checkForWebsiteName } from '../../../api/infoApi';
import imageCompression from 'browser-image-compression';
import {
	DAYS_OF_THE_WEEK_ARRAY,
	DEFAULT_LOCATION,
	DEFAULT_ZOOM,
	MAP_API,
	WEBSITE_COLLECTION,
	WEBSITE_INFO_COLLECTION,
} from '../../../constants/websiteConstants';
import { AMDIN_FIELD, PRIMARY_COLOR } from '../../../constants/constants';
import { print } from '../../../utils/console';
import { createId } from '../../../utils/stringM';
import MapPicker from 'react-google-map-picker';
import { useAuthIds } from '../../authHook';
import Multiselect from 'multiselect-react-dropdown';
import geofire from 'geofire-common';

const WebOneWebsiteInfo = () => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
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
		prepTime: 48,
		socialMedialinks: [],
		freeDeliveryAreas: [],
	});
	const [logoImageAdded, setLogoImageAdded] = useState(false);
	const [files, setFiles] = useState<any[]>([]);
	const [logoImage, setLogoImage] = useState<any>();
	const [aboutUsImage, setAboutUsImage] = useState<any>();
	const [aboutImageAdded, setAboutImageAdded] = useState(false);
	const [headerImage, setHeaderImage] = useState<any>();
	const [headerImageAdded, setHeaderImageAdded] = useState(false);
	const [aboutUsImageFile, setAboutUsImageFile] = useState<any>();
	const [headerImageFile, setHeaderImageFile] = useState<any>();
	const [contactUsImage, setContactUsImage] = useState<any>();
	const [contactImageAdded, setContactImageAdded] = useState(false);
	const [contactImageFile, setContactImageFile] = useState<any>();
	const [colorPrimary, setColorPrimary] = useState('#aabbcc');
	const [colorSec, setColorSecondary] = useState('#aabbcc');
	const [reservation, setReservation] = useState(false);
	const { adminId, userId, access } = useAuthIds();
	const [location, setLocation] = useState(DEFAULT_LOCATION);
	const [selectedDaysOfTheWeek, setSelectedDaysOfTheWeek] = useState(
		DAYS_OF_THE_WEEK_ARRAY
	);
	const [areas, setAreas] = useState('');
	const [freeDeliveryAreas, setFreeDeliveryAreas] = useState('');
	const [socialMedialinksState, setSocialMedialinks] = useState<string[]>([]);
	const [fb, setFB] = useState('');
	const [ig, setIG] = useState('');
	const [tiktok, setTiktok] = useState('');
	const [twitter, setTwitter] = useState('');
	const [websiteAdded, setWebsiteAdded] = useState(false);

	useEffect(() => {
		getWebsiteInfo();
	}, []);

	const handleChangeLocation = (lat: any, lng: any) => {
		setLocation({ lat: lat, lng: lng });
	};

	const getWebsiteInfo = () => {
		getDataFromDBOne(WEBSITE_INFO_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setInfo({
							id: element.id,
							websiteName: d.websiteName,
							adminId: d.adminId,
							userId: d.userId,
							logo: d.logo,
							serviceProviderName: d.serviceProviderName,
							headerImage: d.headerImage,
							headerTitle: d.headerTitle,
							headerText: d.headerText,
							aboutUsImage: d.aboutUsImage,
							aboutUsTitle: d.aboutUsTitle,
							aboutUsInfo: d.aboutUsInfo,
							themeMainColor: d.themMainColor,
							themeSecondaryColor: d.themeSecondaryColor,
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
							prepTime: d.prepTime,
							socialMedialinks: d.socialMedialinks,
							freeDeliveryAreas: d.freeDeliveryarea,
						});
						setSelectedDaysOfTheWeek(d.daysOfWork);
					});
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setLoading(true);
			});
	};

	const handleChange = (e: any) => {
		if (e.target.name === 'customerPhone') {
			setInfo({
				...info,
				[e.target.name]: e.target.value,
			});
		} else if (e.target.name === 'websiteName') {
			setInfo({
				...info,
				[e.target.name]: e.target.value.replace(/\s/g, '').toLowerCase(),
			});
		} else {
			setInfo({
				...info,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleChangeAreas = (e: any) => {
		setAreas(e.target.value);
	};

	const handleChangeFreeDelivery = (e: any) => {
		setFreeDeliveryAreas(e.target.value);
	};

	const onDrop = useCallback((acceptedFiles: any[]) => {
		var reader = new FileReader();
		reader.readAsDataURL(acceptedFiles[0]);
		reader.onload = function () {
			if (reader.result !== null) {
				setLogoImage(reader.result);
				setLogoImageAdded(true);
			}
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
		// Do something with the files
		if (files.length > 0) {
			let currFiles = files;

			currFiles.concat(acceptedFiles);
			setFiles(currFiles);
		} else {
			setFiles(acceptedFiles);
		}
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const addWebsiteInfo = async () => {
		if (
			(files.length > 0 &&
				typeof aboutUsImageFile !== 'undefined' &&
				typeof headerImageFile !== 'undefined') ||
			info.id !== ''
		) {
			setLoading(true);

			try {
				let res = await checkForWebsiteName(info.websiteName);
				if (res) {
					const options = {
						maxSizeMB: 1,
						maxWidthOrHeight: 1920,
						useWebWorker: true,
					};

					let deliveryAreas: any[] = [];

					if (typeof info.freeDeliveryAreas !== 'undefined') {
						if (info.freeDeliveryAreas.length > 0) {
							deliveryAreas = info.freeDeliveryAreas;
						}
					}

					let newDeliveryAreas = freeDeliveryAreas.split(',');
					newDeliveryAreas = newDeliveryAreas.concat(deliveryAreas);

					let newSocialMedialinks: string[] = [fb, ig, tiktok, twitter];

					let newInfo: IWebsiteOneInfo = {
						...info,
						adminId: adminId,
						userId: userId,
						themeMainColor: colorPrimary,
						themeSecondaryColor: colorSec,
						reservation: reservation,
						mapLocation: location,
						daysOfWork: selectedDaysOfTheWeek,
						socialMedialinks: newSocialMedialinks,
						freeDeliveryAreas: newDeliveryAreas,
					};
					if (logoImageAdded) {
						if (files.length > 0) {
							const name = files[0].name;
							// Upload Logo
							await uploadFile(`${info.websiteName}/logo/${name}`, files[0]);

							const compressedLogoFile = await imageCompression(
								files[0],
								options
							);
							// Thumbnail
							await uploadFile(
								`${info.websiteName}/logo/thumbnail_${name}`,
								compressedLogoFile
							);

							newInfo.logo = {
								original: name,
								thumbnail: `thumbnail_${name}`,
							};
						}
					}

					if (typeof aboutUsImageFile !== 'undefined') {
						// Upload Header
						await uploadFile(
							`${info.websiteName}/header/${headerImageFile.name}`,
							headerImageFile
						);

						const compressedHeaderFile = await imageCompression(
							headerImageFile,
							options
						);

						// Thumbnail
						await uploadFile(
							`${info.websiteName}/header/thumbnail_${headerImageFile.name}`,
							compressedHeaderFile
						);

						newInfo.headerImage = {
							original: headerImageFile.name,
							thumbnail: `thumbnail_${headerImageFile.name}`,
						};
					}

					if (typeof aboutUsImageFile !== 'undefined') {
						// Upload About Us
						await uploadFile(
							`${info.websiteName}/about/${aboutUsImageFile.name}`,
							aboutUsImageFile
						);

						const compressedAboutUsImageFileFile = await imageCompression(
							aboutUsImageFile,
							options
						);
						// Thumbnail
						await uploadFile(
							`${info.websiteName}/about/thumbnail_${aboutUsImageFile.name}`,
							compressedAboutUsImageFileFile
						);

						newInfo.aboutUsImage = {
							original: aboutUsImageFile.name,
							thumbnail: `thumbnail_${aboutUsImageFile.name}`,
						};
					}

					if (typeof aboutUsImageFile !== 'undefined') {
						// Upload Contact Us
						await uploadFile(
							`${info.websiteName}/contact/${contactImageFile.name}`,
							contactImageFile
						);

						const compressedContactUsImageFileFile = await imageCompression(
							contactImageFile,
							options
						);
						// Thumbnail
						await uploadFile(
							`${info.websiteName}/contact/thumbnail_${contactImageFile.name}`,
							compressedContactUsImageFileFile
						);

						newInfo.contactUsImage = {
							original: contactImageFile.name,
							thumbnail: `thumbnail_${contactImageFile.name}`,
						};
					}

					if (info.id === '') {
						addDocument(WEBSITE_INFO_COLLECTION, newInfo)
							.then((v) => {
								setFiles([]);
								getWebsiteInfo();
								setWebsiteAdded(true);
								let website: IWebsite = {
									id: createId(),
									websiteId: createId(),
									adminId: adminId,
									userId: userId,
									websiteName: info.websiteName,
									chosenWebsiteNo: 1,
									src: 'images/webOne.png',
									date: new Date(),
									dateString: new Date().toDateString(),
								};

								addDocument(WEBSITE_COLLECTION, website)
									.then((v) => {})
									.catch((e) => {
										console.error(e);
									});
							})
							.catch((e: any) => {
								setFiles([]);
								getWebsiteInfo();
								console.error(e);
								toast.error('There was an error please try again');
							});
					} else {
						updateDocument(WEBSITE_INFO_COLLECTION, info.id, newInfo)
							.then((v) => {
								setFiles([]);
								getWebsiteInfo();
							})
							.catch((e: any) => {
								setFiles([]);
								getWebsiteInfo();
								console.error(e);
								toast.error('There was an error please try again');
							});
					}
				} else {
					toast.error(
						'Website Name already taken please choose another website name'
					);
				}
			} catch (e) {
				console.error(e);
			}
		} else {
			toast.error('Ooops looks like you left out your logo');
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='bg-white rounded-[25px] p-4  flex flex-col'>
					{websiteAdded ? (
						<div className='flex flex-col items-center space-y-2 w-full text-center'>
							<p className='text-center text-xs text-gray-300 mb-4 font-bold w-full'>
								Your Basic Info
							</p>
							{info.id !== '' ? (
								<ShowImage
									src={`${info.websiteName}/logo/${info.logo.thumbnail}`}
									alt={'logo'}
									style={'rounded-[25px] shadow-md w-full h-48'}
								/>
							) : (
								<img
									src={logoImageAdded ? logoImage : `${logoImage}`}
									className='rounded-[25px] shadow-md w-full h-48'
								/>
							)}
							<h1 className='mb-6 w-full'>
								Website URL:{' '}
								<a href={`https://${info.websiteName}.foodiesbooth.com`}>
									{info.websiteName}.foodiesbooth.com
								</a>
							</h1>
							<h1 className='mb-6 w-full'>
								Trading Name: {info.serviceProviderName}
							</h1>
							<h1 className='mb-6 w-full'>
								Days Open:{' '}
								{selectedDaysOfTheWeek.map((v) => (
									<p>{v}</p>
								))}
							</h1>
							{info.id !== '' ? (
								<ShowImage
									src={`${info.websiteName}/header/${info.headerImage.thumbnail}`}
									alt={'logo'}
									style={'rounded-[25px] shadow-md w-full h-48'}
								/>
							) : (
								<img
									src={logoImageAdded ? headerImage : `${headerImage}`}
									className='rounded-[25px] shadow-md w-full h-48'
								/>
							)}
							<h1 className='mb-6 w-full'>{info.headerTitle}</h1>
							<p className='mb-6 w-full'>{info.headerText}</p>
							{info.id !== '' ? (
								<ShowImage
									src={`${info.websiteName}/about/${info.aboutUsImage.thumbnail}`}
									alt={'logo'}
									style={'rounded-[25px] shadow-md w-full h-48'}
								/>
							) : (
								<img
									src={logoImageAdded ? aboutUsImage : `${aboutUsImage}`}
									className='rounded-[25px] shadow-md w-48 h-48'
								/>
							)}
							<h1 className='mb-6 w-full'>{info.aboutUsTitle}</h1>
							<h1 className='mb-6 w-full'>{info.aboutUsInfo}</h1>
							{info.id !== '' ? (
								<ShowImage
									src={`${info.websiteName}/contact/${info.contactUsImage.thumbnail}`}
									alt={'logo'}
									style={'rounded-[25px] shadow-md w-48 h-48'}
								/>
							) : (
								<img
									src={logoImageAdded ? contactUsImage : `${contactUsImage}`}
									className='rounded-[25px] shadow-md w-48 h-48'
								/>
							)}
							<p className='mb-6 w-full'>{info.email}</p>
							<h1 className='mb-6 w-full'>{info.phone}</h1>
							<h1 className='mb-6 w-full'>{info.address}</h1>
						</div>
					) : (
						<div>
							<div
								{...getRootProps()}
								className='border-dashed h-48 rounded-[25px] w-full border-2 p-8 flex content-center items-center text-center '
							>
								<input {...getInputProps()} />
								<>
									{logoImageAdded || info.id !== '' ? (
										<div className='w-full'>
											{info.id !== '' ? (
												<ShowImage
													src={`${info.websiteName}/logo/${info.logo.thumbnail}`}
													alt={'logo'}
													style={
														'rounded-[25px] shadow-md w-full h-48 object-cover'
													}
												/>
											) : (
												<img
													src={logoImageAdded ? logoImage : `${logoImage}`}
													className='rounded-[25px] shadow-md w-full h-48 object-cover'
												/>
											)}
										</div>
									) : (
										<>
											{isDragActive ? (
												<p className='text-center'>Drop the logo here ...</p>
											) : (
												<p className='text-center'>
													{' '}
													Drag &lsquo;n&lsquo; drop some logo here, or click to
													select logo image
												</p>
											)}
										</>
									)}
								</>
							</div>
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Enter your unique website name
								</p>
								<input
									type='text'
									value={info.websiteName}
									placeholder={'Website Name'}
									name='websiteName'
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Enter your business name
								</p>
								<input
									type='text'
									value={info.serviceProviderName}
									placeholder={'Service Provider Name'}
									name='serviceProviderName'
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								{info.id !== '' || headerImageAdded ? (
									<div>
										{info.id !== '' ? (
											<ShowImage
												src={`${info.websiteName}/header/${info.headerImage.thumbnail}`}
												alt={'logo'}
												style={
													'rounded-[25px] shadow-md w-full h-48 object-cover'
												}
											/>
										) : (
											<img
												src={headerImageAdded ? headerImage : `${headerImage}`}
												className='rounded-[25px] shadow-md w-full h-48 object-cover'
											/>
										)}
									</div>
								) : (
									<p></p>
								)}
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Select header image
								</p>

								<input
									type='file'
									// value={info.headerTitle}
									name='headerTitle'
									placeholder={'Header Title'}
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											const img = e.target.files[0];
											var reader = new FileReader();
											reader.readAsDataURL(img);
											reader.onload = function () {
												if (reader.result !== null) {
													setHeaderImage(reader.result);
													setHeaderImageAdded(true);
													setHeaderImageFile(img);
												}
											};
											reader.onerror = function (error) {
												console.log('Error: ', error);
											};
										}
									}}
									accept='.png,.jpeg,.jpg'
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Select header title
								</p>
								<input
									type='text'
									value={info.headerTitle}
									name='headerTitle'
									placeholder={'Header Title'}
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Enter header text
								</p>
								<textarea
									value={info.headerText}
									name='headerText'
									placeholder={'Header Text'}
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								{info.id !== '' || aboutImageAdded ? (
									<div>
										{' '}
										{info.id !== '' ? (
											<ShowImage
												src={`${info.websiteName}/about/${info.aboutUsImage.thumbnail}`}
												alt={'logo'}
												style={
													'rounded-[25px] shadow-md w-full h-48 object-cover'
												}
											/>
										) : (
											<img
												src={aboutImageAdded ? aboutUsImage : `${aboutUsImage}`}
												className='rounded-[25px] shadow-md w-full h-48 object-cover'
											/>
										)}{' '}
									</div>
								) : (
									<p></p>
								)}
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Select about image
								</p>
								<input
									type='file'
									// value={info.headerTitle}
									name='headerTitle'
									placeholder={'Header Title'}
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											const img = e.target.files[0];
											var reader = new FileReader();
											reader.readAsDataURL(img);
											reader.onload = function () {
												if (reader.result !== null) {
													setAboutUsImage(reader.result);
													setAboutImageAdded(true);
													setAboutUsImageFile(img);
												}
											};
											reader.onerror = function (error) {
												console.log('Error: ', error);
											};
										}
									}}
									accept='.png,.jpeg,.jpg'
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									About us title
								</p>
								<input
									type='text'
									value={info.aboutUsTitle}
									name='aboutUsTitle'
									placeholder={'About Us Title'}
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Enter about us info
								</p>
								<textarea
									value={info.aboutUsInfo}
									placeholder={'About Us Description'}
									onChange={handleChange}
									name='aboutUsInfo'
									className='
                                        w-full
                                        h-64
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
							<div className='mb-6 w-full'>
								{info.id !== '' || contactImageAdded ? (
									<div>
										{info.id !== '' ? (
											<ShowImage
												src={`${info.websiteName}/contact/${info.contactUsImage.thumbnail}`}
												alt={'logo'}
												style={
													'rounded-[25px] shadow-md w-full h-48 object-cover'
												}
											/>
										) : (
											<img
												src={
													contactImageAdded
														? contactUsImage
														: `${contactUsImage}`
												}
												className='rounded-[25px] shadow-md w-full h-48 object-cover'
											/>
										)}
									</div>
								) : (
									<p></p>
								)}

								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Select contact us image
								</p>
								<input
									type='file'
									// value={info.headerTitle}
									name='contactUsImage'
									placeholder={'Contact Us image'}
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											const img = e.target.files[0];
											var reader = new FileReader();
											reader.readAsDataURL(img);
											reader.onload = function () {
												if (reader.result !== null) {
													setContactUsImage(reader.result);
													setContactImageAdded(true);
													setContactImageFile(img);
												}
											};
											reader.onerror = function (error) {
												console.log('Error: ', error);
											};
										}
									}}
									accept='.png,.jpeg,.jpg'
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Enter your address
								</p>
								<input
									type='text'
									name='address'
									value={info.address}
									placeholder={'Address'}
									onChange={handleChange}
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
							<p>Click to select your location</p>
							<div className='mb-6 w-full'>
								<MapPicker
									defaultLocation={DEFAULT_LOCATION}
									zoom={DEFAULT_ZOOM}
									// mapTypeId={createId()}
									style={{ height: '200px', width: '100%' }}
									onChangeLocation={handleChangeLocation}
									apiKey={MAP_API}
								/>
							</div>
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Radius of area you work from your location in KM
								</p>
								<input
									type='number'
									name='radius'
									value={info.radius}
									placeholder={'Radius'}
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Areas(cities) you delivery for FREE(separate each by a comma)
								</p>
								<input
									type='text'
									name='areas'
									// value={info.areas}
									placeholder={'Free delivery areas'}
									onChange={handleChangeFreeDelivery}
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

							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Select days open
								</p>
								<Multiselect
									isObject={false}
									onRemove={(selectedItem: any) => {
										setSelectedDaysOfTheWeek(
											selectedDaysOfTheWeek.filter((element) => {
												return element !== selectedItem;
											})
										);
									}}
									onSelect={(selectedList) => {
										setSelectedDaysOfTheWeek(selectedList);
									}}
									options={DAYS_OF_THE_WEEK_ARRAY}
									displayValue='Sunday'
									placeholder='Select days open'
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
											'border-bottom': '2px solid ' + PRIMARY_COLOR,
											'border-top': '2px solid ' + PRIMARY_COLOR,
											'border-radius': '25px',
											padding: '4px',
											color: PRIMARY_COLOR,
											':hover': PRIMARY_COLOR,
										},
									}}
								/>
							</div>
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Email
								</p>
								<input
									type='text'
									value={info.email}
									name='email'
									placeholder={'Email'}
									onChange={handleChange}
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Facebook Page Link
								</p>
								<input
									type='text'
									value={fb}
									name='facebook'
									placeholder={'Facebook link'}
									onChange={(e: any) => {
										setFB(e.target.value);
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Instagram Link
								</p>
								<input
									type='text'
									value={ig}
									name='ig'
									placeholder={'Instagram Link'}
									onChange={(e: any) => {
										setIG(e.target.value);
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									Tiktok Link
								</p>
								<input
									type='text'
									value={tiktok}
									name='tiktok'
									placeholder={'TikTok Link'}
									onChange={(e: any) => {
										setTiktok(e.target.value);
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
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									X Link
								</p>
								<input
									type='text'
									// value={info.email}
									name='twitter'
									placeholder={'X Link'}
									onChange={(e: any) => {
										setTwitter(e.target.value);
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
							<div className='mb-6 w-full'>
								<input
									type='text'
									value={info.phone}
									placeholder={'Main Phone'}
									name='phone'
									onChange={handleChange}
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
							<div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center'>
								<div>
									<p className='text-xs text-gray-300 mb-4 font-bold  w-full'>
										Pick primary color
									</p>
									<HexColorPicker
										color={info.themeMainColor}
										onChange={setColorPrimary}
									/>
								</div>
								<div>
									<p className='text-xs text-gray-300 mb-4 font-bold  w-full'>
										Pick secondary color
									</p>
									<HexColorPicker
										color={info.themeSecondaryColor}
										onChange={setColorSecondary}
									/>
								</div>
							</div>
							<div className=' mb-6 w-full'>
								<input
									onChange={() => {
										setReservation(!reservation);
									}}
									type='checkbox'
									id='terms'
									name='terms'
									value='reservation'
									className='accent-[#8b0e06] text-white bg-whites'
								/>
								<label htmlFor='terms'>
									{' '}
									Allow people to make reservations
								</label>
								<br></br>
							</div>
							<div className='mb-6 w-full'>
								<p className='text-center text-xs text-gray-300 mb-4 font-bold  w-full'>
									How much time do you require for Food Preparation(hours)
								</p>
								<input
									type='number'
									name='prepTime'
									value={info.prepTime}
									placeholder={'Food preparation time in hours'}
									onChange={handleChange}
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
							<button
								onClick={() => {
									addWebsiteInfo();
								}}
								className='
                                        font-bold
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
                                        transition
                                    '
							>
								{info.id === '' ? 'Add Website Info' : 'Update Website Info'}
							</button>
						</div>
					)}
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default WebOneWebsiteInfo;
