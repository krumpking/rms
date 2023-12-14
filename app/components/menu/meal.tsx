import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMeal, IMenuItem } from '../../types/menuTypes';
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
	MEAL_ITEM_COLLECTION,
	MEAL_STORAGE_REF,
	MENU_CAT_COLLECTION,
	MENU_ITEM_COLLECTION,
	MENU_STORAGE_REF,
} from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthIds } from '../authHook';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase/clientApp';
import { getCurrency } from '../../utils/currency';

const Meal = () => {
	const { adminId, userId, access } = useAuthIds();
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [title, setTitle] = useState('');
	const [files, setFiles] = useState<any[]>([]);
	const [docId, setDocId] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [category, setCategory] = useState('');
	const [meals, setMeals] = useState<IMeal[]>([]);
	const [edit, setEdit] = useState(false);
	const [editItem, setEditItem] = useState<any>({
		category: '',
		title: '',
		description: '',
		price: 0,
	});
	const [open, setOpen] = useState(false);
	const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
	const [discount, setDiscount] = useState(0);
	const [currency, setCurrency] = useState('US$');

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
		logEvent(analytics, 'meal_page_visit');
		getMeals();
	}, []);

	const getMeals = async () => {
		let currny = await getCurrency();
		setCurrency(currny);
		getDataFromDBOne(MEAL_ITEM_COLLECTION, AMDIN_FIELD, adminId)
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
	};

	const getReadyToUpdate = (v: IMeal) => {
		setOpen(true);
		setEditItem(v);
		setMenuItems(v.menuItems);
		setEdit(true);
		setTitle(v.title);
		setDescription(v.description);
		setPrice(v.price);
	};

	const updateMeal = async () => {
		setOpen(false);

		setLoading(true);
		let meal: any = {};
		if (files.length > 0) {
			const name = files[0].name;
			try {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
				};

				const compressedFile = await imageCompression(files[0], options);

				await uploadFile(`${adminId}/${MEAL_STORAGE_REF}/${name}`, files[0]);
				const info = name.split('_');

				// Thumbnail
				await uploadFile(
					`${adminId}/${MEAL_STORAGE_REF}/thumbnail_${name}`,
					compressedFile
				);
			} catch (e) {
				console.error(e);
			}

			meal = {
				title: title,
				description: description,
				menuItems: menuItems,
				discount: discount,
				pic: {
					original: name,
					thumbnail: `thumbnail_${name}`,
				},
				price: price,
			};
		} else {
			meal = {
				title: title,
				description: description,
				menuItems: menuItems,
				discount: discount,
				price: price,
			};
		}

		setMeals([]);
		updateDocument(MEAL_ITEM_COLLECTION, editItem.id, meal)
			.then((v) => {
				setFiles([]);
				getMeals();
				setOpen(false);
				logEvent(analytics, 'edited_meal_item');
			})
			.catch((e: any) => {
				setFiles([]);
				getMeals();
				setOpen(false);
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const deleteItem = (id: string) => {
		var result = confirm('Are you sure you want to delete?');
		if (result) {
			//Logic to delete the item
			setLoading(true);
			setMeals([]);
			deleteDocument(MEAL_ITEM_COLLECTION, id)
				.then(() => {
					getMeals();
					logEvent(analytics, 'deleted_meal');
				})
				.catch((e: any) => {
					getMeals();
					console.error(e);
				});
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

	const removeItem = (v: any) => {
		let aItems: any[] = [];
		menuItems.forEach((e) => {
			if (v.id !== e.id) {
				aItems.push(e);
			}
		});
		setMenuItems(aItems);
	};

	return (
		<div>
			<div className='bg-white rounded-[30px] p-4 '>
				{loading ? (
					<div className='w-full flex flex-col items-center content-center'>
						<Loader color={''} />
					</div>
				) : (
					<div className='w-full'>
						{meals.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-scroll max-h-[700px] w-full gap-4 p-4'>
								{meals.map((v) => {
									return (
										<div className='flex flex-col shadow-xl rounded-[25px] p-8 w-full md:w-[250px] '>
											<div className='flex flex-row-reverse'>
												<button
													onClick={() => {
														deleteItem(v.id);
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
												src={`/${adminId}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`}
												alt={'Meal Item'}
												style={'rounded-[25px] h-20 w-full'}
											/>
											<div className='flex flex-row justify-between'>
												<h1 className='font-bold text-sm'>{v.title}</h1>
												<h1 className='font-bold text-sm'>
													{currency}
													{v.price}
												</h1>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<h1 className='col-span-2'>
								Looks like you are yet to add any Meals
							</h1>
						)}
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
								<div className='flex flex-col  space-y-2 w-full'>
									<div>
										<div
											className='flex flex-col border-dashed border-2 border-[#8b0e06] place-items-center p-2 rounded-[20px] my-4'
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
										<p className='bg-green-600 text-white w-full rounded-[25px] p-4'>
											{files.length} Image{files.length > 1 ? 's' : ''} Added
										</p>
									) : (
										<p></p>
									)}
									<div className='max-h-[150px] overflow-y-scroll'>
										{menuItems.map((v: any) => (
											<div className='flex flex-row justify-between shadow-sm m-4 p-4'>
												<h1>{v.title}</h1>
												<div className='flex justify-between space-x-4'>
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

									<div className='flex flex-row justify-between'>
										<div className='mb-6 w-full'>
											<input
												type='text'
												value={title}
												placeholder={'Meal title'}
												onChange={(e) => {
													setTitle(e.target.value);
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
									</div>
									<div className='flex flex-row justify-between'>
										<div className='mb-6 w-full'>
											<textarea
												value={description}
												placeholder={'Meal Description'}
												onChange={(e) => {
													setDescription(e.target.value);
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
									</div>
									<div className='flex flex-row justify-between'>
										<div className='mb-6 w-full'>
											<p className='text-xs text-gray-400 text-center'>
												Discount in percentage
											</p>
											<input
												type='number'
												value={discount}
												placeholder={'Discount'}
												onChange={(e) => {
													setDiscount(parseInt(e.target.value));
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
									</div>

									<div className='flex flex-row justify-between'>
										<div className='mb-6 w-full'>
											<p className='text-xs text-gray-400 text-center'>
												Final Total Price
											</p>
											<input
												type='number'
												step='0.01'
												min='0'
												max='1000000'
												value={price}
												placeholder={'Final total'}
												onChange={(e) => {
													setPrice(parseFloat(e.target.value));
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
									</div>
									<button
										onClick={() => {
											updateMeal();
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
										Update Meal
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

export default Meal;
