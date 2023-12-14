import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import {
	ADMIN_ID,
	AMDIN_FIELD,
	LIGHT_GRAY,
	PRIMARY_COLOR,
} from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import {
	ICategory,
	IMenuItem,
	IMenuItemPromotions,
} from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import {
	addDocument,
	deleteDocument,
	getDataFromDBOne,
	updateDocument,
	uploadFile,
} from '../../api/mainApi';
import {
	CATEGORIES,
	MENU_CAT_COLLECTION,
	MENU_ITEM_COLLECTION,
	MENU_PROMO_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthIds } from '../authHook';
import { addDays } from 'date-fns';
import DateMethods from '../../utils/date';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase/clientApp';
import { getCurrency } from '../../utils/currency';

const AddPromotion = () => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { adminId, userId, access } = useAuthIds();
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [title, setTitle] = useState('');
	const [files, setFiles] = useState<any[]>([]);
	const [docId, setDocId] = useState('');
	const [description, setDescription] = useState('');
	const [promo, setPromo] = useState({
		id: '',
		adminId: '',
		userId: '',
		category: '',
		title: '',
		description: '',
		oldPrice: 0,
		pic: 0,
		date: new Date(),
		dateString: new Date().toDateString(),
		newPrice: 0,
		endDate: new Date().toDateString(),
	});
	const [oldPrice, setOldPrice] = useState(0);
	const [category, setCategory] = useState('');
	const [duration, setDuration] = useState(0);
	const [menuItems, setMenuItems] = useState<IMenuItemPromotions[]>([]);
	const [edit, setEdit] = useState(false);
	const [editItem, setEditItem] = useState<any>({
		category: '',
		title: '',
		description: '',
		price: 0,
		duration: 0,
	});
	const [open, setOpen] = useState(false);
	const [currency, setCurrency] = useState('US$');

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
		logEvent(analytics, 'promo_page_visit');
		getMenuItems();
	}, []);

	const getMenuItems = async () => {
		let currny = await getCurrency();
		setCurrency(currny);
		getDataFromDBOne(MENU_PROMO_ITEM_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						if (
							DateMethods.diffDatesDays(new Date().toDateString(), d.endDate) >
							0
						) {
							setMenuItems((menuItems) => [
								...menuItems,
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

	const handleChange = (e: any) => {
		setPromo({
			...promo,
			[e.target.name]: e.target.value,
		});
	};

	const addMenuItem = async () => {
		if (files.length > 0) {
			setOpen(false);
			setLoading(true);
			const name = files[0].name;
			try {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
				};

				await uploadFile(`${adminId}/${MENU_STORAGE_REF}/${name}`, files[0]);
				const info = name.split('_');

				try {
					const compressedFile = await imageCompression(files[0], options);

					// Thumbnail
					await uploadFile(
						`${adminId}/${MENU_STORAGE_REF}/thumbnail_${name}`,
						compressedFile
					);

					let menuItem: IMenuItemPromotions = {
						...promo,
						id: userId,
						adminId: adminId,
						pic: {
							original: name,
							thumbnail: `thumbnail_${name}`,
						},
						date: new Date(),
						dateString: new Date().toDateString(),
						userId: userId,
						endDate: addDays(new Date(), duration).toDateString(),
					};

					setMenuItems([]);
					addDocument(MENU_PROMO_ITEM_COLLECTION, menuItem)
						.then((v) => {
							setFiles([]);
							getMenuItems();
							logEvent(analytics, 'added_promos');
						})
						.catch((e: any) => {
							setFiles([]);
							getMenuItems();

							console.error(e);
							toast.error('There was an error please try again');
						});
				} catch (error) {
					console.log(error);
				}
			} catch (e) {
				console.error(e);
			}
		} else {
			toast.error("Hmmm looks like you did not add the menu item's image.");
			setLoading(false);
		}
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (files.length > 0) {
			let currFiles = files;

			currFiles.concat(acceptedFiles);
			setFiles(currFiles);
		} else {
			setFiles(acceptedFiles);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const getReadyToUpdate = (v: IMenuItemPromotions) => {
		setOpen(true);
		setEditItem(v);
		setEdit(true);
		setPromo(v);
	};

	const editMenuItem = async () => {
		setOpen(false);

		setLoading(true);
		let menuItem: any = {};
		if (files.length > 0) {
			const name = files[0].name;
			try {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
				};

				const compressedFile = await imageCompression(files[0], options);

				await uploadFile(`${adminId}/${MENU_STORAGE_REF}/${name}`, files[0]);
				const info = name.split('_');

				// Thumbnail
				await uploadFile(
					`${adminId}/${MENU_STORAGE_REF}/thumbnail_${name}`,
					compressedFile
				);
			} catch (e) {
				console.error(e);
			}

			menuItem = {
				...promo,
				pic: {
					thumbnail: `thumbnail_${name}`,
					original: name,
				},
			};
		} else {
			menuItem = promo;
		}

		setMenuItems([]);
		updateDocument(MENU_PROMO_ITEM_COLLECTION, editItem.id, menuItem)
			.then((v) => {
				setEdit(false);
				setFiles([]);
				getMenuItems();
				setOpen(false);
			})
			.catch((e: any) => {
				setEdit(false);
				setFiles([]);
				getMenuItems();
				setOpen(false);
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const deleteItem = (id: string, pic: any) => {
		var result = confirm('Are you sure you want to delete?');
		if (result) {
			//Logic to delete the item
			setLoading(true);
			deleteDocument(MENU_ITEM_COLLECTION, id)
				.then(() => {
					setMenuItems([]);
					getMenuItems();
					logEvent(analytics, 'deleted_promos');
				})
				.catch((e: any) => {
					console.error(e);
				});
		}
	};

	return (
		<div>
			<div className='bg-white rounded-[30px] p-4 '>
				{loading ? (
					<div className='w-full flex flex-col items-center content-center'>
						<Loader color={''} />
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  h-full w-full gap-4 p-4'>
						<div
							className='flex shadow-xl rounded-[25px] p-8 w-[250px]  items-center justify-center'
							onClick={() => {
								setOpen(true);
							}}
						>
							<div className='flex flex-col items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke-width='1'
									stroke='currentColor'
									className='w-16 h-16'
								>
									<path
										stroke-linecap='round'
										stroke-linejoin='round'
										d='M12 4.5v15m7.5-7.5h-15'
									/>
								</svg>
								Add Promotion Item
							</div>
						</div>
						{menuItems.map((v) => {
							return (
								<div className='relative shadow-2xl p-4 w-full md:w-[250px]  rounded-[25px]'>
									<div className='p-4 flex flex-col'>
										<div className='flex flex-row-reverse'>
											<button
												onClick={() => {
													deleteItem(v.id, v.pic);
												}}
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													stroke-width='1.5'
													stroke='currentColor'
													className='w-6 h-6 m-1'
												>
													<path
														stroke-linecap='round'
														stroke-linejoin='round'
														d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
													/>
												</svg>
											</button>
											<button
												onClick={() => {
													getReadyToUpdate(v);
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
														d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
													/>
												</svg>
											</button>
										</div>
										<ShowImage
											src={`/${v.adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`}
											alt={'Menu Item'}
											style={'rounded-[25px] h-20 w-full '}
										/>
										<p className='text-xl'>{v.title}</p>
										<div className='flex flex-row space-x-4 justify-end content-center items-center'>
											<p className='text-xs line-through'>
												{currency}
												{v.oldPrice}
											</p>
											<p className='text-md'>
												{currency}
												{v.newPrice}
											</p>
										</div>
										<div className='rounded-[25px] font-bold w-full h-fit font-bold text-xs text-center flex flex-row justify-end'>
											<p className=''>
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
										{Math.ceil(100 - (v.newPrice / v.oldPrice) * 100)} % OFF
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<Transition appear show={open} as={Fragment}>
				<Dialog
					as='div'
					className='fixed inset-0 z-10 overflow-y-auto'
					onClose={() => setOpen(false)}
				>
					<div className='min-h-screen px-4 text-center backdrop-blur-sm '>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Dialog.Overlay className='fixed inset-0' />
						</Transition.Child>

						<span
							className='inline-block h-screen align-middle'
							aria-hidden='true'
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div className='bg-white my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='text-sm font-medium leading-6 text-gray-900 m-4'
								>
									{files.length > 0 ? (
										<div className='grid grid-cols-2 gap-4'>
											<p>Adding Menu Item</p>
											<p>
												{files.length} Picture{files.length > 1 ? 's' : ''}{' '}
												Added
											</p>
										</div>
									) : (
										'Adding Menu Item'
									)}
								</Dialog.Title>
								<div className='flex flex-col items-center space-y-2 w-full'>
									<div className='w-full'>
										<div
											className='flex flex-col border-dashed border-2 border-[#8b0e06] place-items-center p-8'
											{...getRootProps()}
										>
											<input className='hidden' {...getInputProps()} />

											<div className='mt-4'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													stroke-width='1.5'
													stroke='currentColor'
													className='w-6 h-6'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														d='M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'
													/>
												</svg>
											</div>
											<p>Drop picture here</p>
											<p>or</p>
											<p>Click here to select</p>
										</div>
									</div>
									{files.length > 0 ? (
										<p
											className='text-white w-full rounded-[25px] p-4'
											style={{ backgroundColor: PRIMARY_COLOR }}
										>
											{files.length} Image{files.length > 1 ? 's' : ''} Added
										</p>
									) : (
										<p></p>
									)}
									<div className='mb-6 w-full'>
										<input
											type='text'
											name='title'
											value={promo.title}
											placeholder={'Title'}
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
										<textarea
											value={promo.description}
											name='description'
											placeholder={'Promotion Description'}
											onChange={handleChange}
											className='
                                                h-25
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
										<button
											className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
											onClick={(e) => e.preventDefault()}
										>
											<select
												value={promo.category}
												name='category'
												onChange={handleChange}
												className='bg-white w-full'
												data-required='1'
												required
											>
												<option value='Chapter' hidden>
													Select Menu Category
												</option>
												{CATEGORIES.map((v) => (
													<option value={v}>{v}</option>
												))}
											</select>
										</button>
									</div>
									<div className='mb-6 w-full'>
										<p className='text-xs text-gray-400 text-center'>
											Old Price in {currency}
										</p>
										<input
											type='number'
											min={0}
											step={0}
											name='oldPrice'
											value={promo.oldPrice}
											placeholder={`Old Price in ${currency}`}
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
										<p className='text-xs text-gray-400 text-center'>
											New Price in {currency}
										</p>
										<input
											type='number'
											min={0}
											step={0}
											name='newPrice'
											value={promo.newPrice}
											placeholder={`New Price in ${currency}`}
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
										<p className='text-xs text-gray-400 text-center'>
											Duration of promotion
										</p>
										<input
											type='number'
											min={0}
											step={0}
											value={duration}
											placeholder={'Duration of promotion'}
											onChange={(e) => {
												setDuration(parseFloat(e.target.value));
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
									<button
										onClick={() => {
											edit ? editMenuItem() : addMenuItem();
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
										{edit ? 'Update Promotion Item' : 'Add Promotion Item'}
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>

			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default AddPromotion;
