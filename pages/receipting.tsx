import React, { Fragment, useEffect, useState } from 'react';
import {
	ADMIN_ID,
	AMDIN_FIELD,
	CURRENCIES,
	LIGHT_GRAY,
	PRIMARY_COLOR,
} from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { Dialog, Disclosure, Tab, Transition } from '@headlessui/react';
import { addDocument, getDataFromDBTwo } from '../app/api/mainApi';
import { ORDER_COLLECTION } from '../app/constants/orderConstants';
import { IOrder } from '../app/types/orderTypes';
import { searchStringInArray } from '../app/utils/arrayM';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { getResInfo } from '../app/api/infoApi';
import { numberWithCommas } from '../app/utils/stringM';
import { CASHBOOOK_COLLECTION } from '../app/constants/cashBookConstants';
import { ITransaction } from '../app/types/cashbookTypes';
import { print } from '../app/utils/console';
import AppAccess from '../app/components/accessLevel';
import { useAuthIds } from '../app/components/authHook';
import Head from 'next/head';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const Accounting = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [ordersSto, setOrdersSto] = useState<IOrder[]>([]);
	const [search, setSearch] = useState('');
	const { adminId, userId, access } = useAuthIds();
	const [selectedOrder, setSelectedOrder] = useState<IOrder>({
		id: '',
		adminId: '',
		userId: '',
		orderNo: 0,
		items: [],
		status: 0,
		statusCode: '',
		totalCost: 0,
		deliveryMethod: '',
		clientId: '',
		customerName: '',
		tableNo: '',
		date: new Date(),
		dateString: '',
		customerEmail: '',
		customerPhone: '',
		customerAddress: '',
		deliveryLocation: null,
		deliveredSignature: null,
		deliverer: '',
		deliveryDate: new Date(),
		deliveryDateString: new Date().toDateString(),
		deliveryTime: '',
		confirmed: true,
	});
	const [open, setOpen] = useState(false);

	const [currency, setCurrency] = useState('USD');
	const [zwlRate, setZwlRate] = useState('');
	const [categories, setCategories] = useState<string[]>([
		'cash',
		'online',
		'debit card',
		'credit card',
		'cheque',
	]);
	const [category, setCategory] = useState('');
	const [originalCost, setOriginalCost] = useState(0);
	const [changeToZWL, setChangeToZWL] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;

		getOrders();
	}, []);

	const getOrders = () => {
		getDataFromDBTwo(
			ORDER_COLLECTION,
			AMDIN_FIELD,
			adminId,
			'statusCode',
			'Delivered'
		)
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
								customerEmail: d.customerEmail,
								customerPhone: d.customerPhone,
								customerAddress: d.cusotmerAddress,
								deliveryLocation: d.deliveryLocation,
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

	const handleKeyDown = (event: { key: string }) => {
		if (event.key === 'Enter') {
			if (changeToZWL) {
				toast.info('Currency Updated');
				update('ZWL');
			} else {
				searchFor();
			}
		}
	};

	const searchFor = () => {
		setOrders([]);

		setLoading(true);
		if (search !== '') {
			let res: IOrder[] = searchStringInArray(ordersSto, search);

			if (res.length > 0) {
				setTimeout(() => {
					setOrders(res);
					setLoading(false);
				}, 1500);
			} else {
				toast.info(`${search} not found `);
				setTimeout(() => {
					setOrders(ordersSto);
					setLoading(false);
				}, 1500);
			}
		} else {
			setTimeout(() => {
				setOrders(ordersSto);
				setLoading(false);
			}, 1500);
		}
	};

	const createReceipt = () => {
		setOpen(true);
	};

	const addOrder = (v: any) => {
		setOriginalCost(v.totalCost);
		setSelectedOrder(v);
	};

	const update = (to: string) => {
		let d = selectedOrder;

		if (parseFloat(zwlRate) > 0) {
			let cost = 0;
			if (to === 'USD') {
				cost = originalCost;
			} else {
				cost = originalCost * parseFloat(zwlRate);
			}
			setCurrency(to);

			let sOrder = {
				id: d.id,
				adminId: d.adminId,
				clientId: d.clientId,
				deliveryMethod: d.deliveryMethod,
				orderNo: d.orderNo,
				items: d.items,
				status: d.status,
				statusCode: d.statusCode,
				userId: d.userId,
				customerName: d.customerName,
				tableNo: d.tableNo,
				date: d.date,
				dateString: d.dateString,
				totalCost: cost,
				customerPhone: d.customerName,
				customerEmail: d.customerEmail,
				customerAddress: d.customerAddress,
				deliveryLocation: d.deliveryLocation,
				deliveredSignature: d.deliveredSignature,
				deliverer: d.deliverer,
				deliveryDate: d.deliveryDate,
				deliveryDateString: d.deliveryDateString,
				deliveryTime: d.deliveryTime,
				confirmed: d.confirmed,
			};
			setSelectedOrder(sOrder);
		} else {
			toast.error("Looks like you are yet to put in today's rate");
		}
	};

	const SaveAsPDFHandler = () => {
		const dom = document.getElementById('print');
		if (dom !== null) {
			toPng(dom)
				.then((dataUrl) => {
					const img = new Image();
					img.crossOrigin = 'annoymous';
					img.src = dataUrl;
					img.onload = () => {
						// Initialize the PDF.
						const pdf = new jsPDF('p', 'mm', 'a6');

						// Define reused data
						const imgProps = pdf.getImageProperties(img);
						const imageType = imgProps.fileType;
						const pdfWidth = pdf.internal.pageSize.getWidth();

						// Calculate the number of pages.
						const pxFullHeight = imgProps.height;
						const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
						const nPages = Math.ceil(pxFullHeight / pxPageHeight);

						// Define pageHeight separately so it can be trimmed on the final page.
						let pageHeight = pdf.internal.pageSize.getHeight();

						// Create a one-page canvas to split up the full image.
						const pageCanvas = document.createElement('canvas');
						const pageCtx = pageCanvas.getContext('2d');
						pageCanvas.width = imgProps.width;
						pageCanvas.height = pxPageHeight;

						for (let page = 0; page < nPages; page++) {
							// Trim the final page to reduce file size.
							// if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
							//   pageCanvas.height = pxFullHeight % pxPageHeight;
							//   pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
							// }
							// Display the page.
							const w = pageCanvas.width;
							const h = pageCanvas.height;
							if (pageCtx !== null) {
								pageCtx.fillStyle = 'white';
								pageCtx.fillRect(0, 0, w, h);
								pageCtx.drawImage(
									img,
									0,
									page * pxPageHeight,
									w,
									h,
									0,
									0,
									w,
									h
								);

								// Add the page to the PDF.
								if (page) pdf.addPage();
							}

							const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
							pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
						}
						// Output / Save
						pdf.save(
							`${selectedOrder.customerName}-${selectedOrder.orderNo}.pdf`
						);
					};
				})
				.catch((error) => {
					console.error('oops, something went wrong!', error);
				});
		}

		let transaction: ITransaction = {
			id: 'id',
			adminId: adminId,
			userId: userId,
			transactionType: 'Cash In',
			currency: currency,
			paymentMode: category,
			title: `Order No ${selectedOrder.orderNo}`,
			details: selectedOrder.id,
			amount: selectedOrder.totalCost,
			customer: selectedOrder.customerName,
			date: new Date(),
			dateString: new Date().toDateString(),
			file: null,
		};

		addDocument(CASHBOOOK_COLLECTION, transaction)
			.then((r) => {
				toast.success('Transaction Added');
			})
			.catch((e) => {
				toast.error('There was an error adding transaction, please try again');
				console.error(e);
			});
	};

	return (
		<div>
			<Head>
				<meta name='viewport' content='width=978'></meta>
			</Head>
			<AppAccess access={access} component={'receipting'}>
				<div>
					<div className='flex flex-col'>
						<div className='lg:col-span-3'>
							<ClientNav
								organisationName={'Vision Is Primary'}
								url={'receipting'}
							/>
						</div>

						<div className='w-full m-2 px-2 py-8 sm:px-0 col-span-9 bg-white rounded-[30px] p-4 '>
							{loading ? (
								<div className='w-full flex flex-col items-center content-center'>
									<Loader color={''} />
								</div>
							) : (
								<div className='grid grid-cols-12'>
									<div className='col-span-9   overflow-y-scroll max-h-[700px] w-full gap-4 p-4'>
										<div className='mb-6'>
											<input
												type='text'
												value={search}
												placeholder={'Search'}
												onChange={(e) => {
													setSearch(e.target.value);
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
												onKeyDown={handleKeyDown}
											/>
										</div>

										<div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
											{orders.map((v) => {
												return (
													<div
														className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '
														onClick={() => {
															addOrder(v);
														}}
													>
														<h1 className='font-bold text-xl text-[#8b0e06]'>
															Order No: {v.orderNo}
														</h1>
														<h1 className='font-bold text-sm'>
															Due: {v.totalCost.toFixed(2)}USD
														</h1>
														<h1 className='font-bold text-sm'>
															{v.customerName}
														</h1>
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
									<div className='col-span-3 flex flex-col p-4 '>
										<div className='flex flex-row mb-6'>
											{CURRENCIES.map((v) => (
												<button
													onClick={() => {
														if (selectedOrder.totalCost > 0) {
															if (currency === 'ZWL' && v === 'USD') {
																setChangeToZWL(false);
																update('USD');
															} else {
																setChangeToZWL(true);
															}
														} else {
															toast.error('Ensure you select the order first');
														}
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
													{v}
												</button>
											))}
										</div>
										<div
											className={changeToZWL ? 'mb-6 flex flex-col' : 'hidden'}
										>
											<input
												type='string'
												value={zwlRate}
												placeholder={"Today's rate"}
												onChange={(e) => {
													setZwlRate(e.target.value);
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
												onKeyDown={handleKeyDown}
											/>
											<p className='text-gray-500 text-xs w-full px-4 py-2'>
												Click enter after typing to change the currency
											</p>
										</div>

										<div className='mb-6'>
											<h1>Order No: {selectedOrder.orderNo}</h1>
										</div>
										<div className='mb-6'>
											<h1>Customer Name: {selectedOrder.customerName}</h1>
										</div>
										<div className='mb-6'>
											<p className='text-xs'>{selectedOrder.dateString}</p>
										</div>
										<div className='mb-6'>
											<h1>
												{selectedOrder.items.map((r) => (
													<div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
														<h1 className='text-nd'>{r.title}</h1>
														<p className='text-xs'>{r.description}</p>
													</div>
												))}
											</h1>
										</div>
										<div className='mb-6 w-full'>
											<button
												className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
												onClick={(e) => e.preventDefault()}
											>
												<select
													value={category}
													onChange={(e) => {
														setCategory(e.target.value);
													}}
													className='bg-white w-full'
													data-required='1'
													required
												>
													<option value='Chapter' hidden>
														Payment Method
													</option>
													{categories.map((v) => (
														<option value={v}>{v}</option>
													))}
												</select>
											</button>
										</div>
										<div className='flex flex-row items-center text-center px-8 py-4 my-6 shadow-xl rounded-[25px]'>
											<h1 className='text-xl text-[#8b0e06]'>
												Total Cost:{' '}
												{numberWithCommas(
													selectedOrder.totalCost.toFixed(2).toString()
												)}{' '}
												{currency}
											</h1>
										</div>

										<button
											onClick={() => {
												createReceipt();
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
											Print Receipt
										</button>
									</div>
								</div>
							)}
						</div>
						<Transition appear show={open} as={Fragment}>
							<Dialog
								as='div'
								className='fixed inset-0 z-10 overflow-y-auto'
								onClose={() => setOpen(false)}
								onClick={() => {
									setOpen(false);
								}}
							>
								<div className='min-h-screen px-4 text-center'>
									<Transition.Child
										as={Fragment}
										enter='ease-out duration-300'
										enterFrom='opacity-0'
										enterTo='opacity-100'
										leave='ease-in duration-200'
										leaveFrom='opacity-100'
										leaveTo='opacity-0'
									>
										<Dialog.Overlay className='fixed inset-0 bg-black/50' />
									</Transition.Child>

									{/* This element is to trick the browser into centering the modal contents. */}
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
										<div>
											<div
												id='print'
												className='font-open text-lg my-8 inline-block w-fit h-fit transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all'
											>
												<div className='bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8'>
													<h1 className='text-lg font-bold text-center'>
														Receipt
													</h1>
													{/* <h1 className="font-bold text-2xl my-4 text-center text-[#8b0e06]">{title}</h1>
                                                <p className="font-bold text-xs my-4 text-center text-[#8b0e06]">{address}</p>
                                                <p className="font-bold text-xs my-4 text-center text-[#8b0e06]">{email}</p>
                                                <p className="font-bold text-xs my-4 text-center text-[#8b0e06]">{phone}</p> */}
													<div className='mb-2 border-y-2  border-dotted border-black py-2'>
														<div className='flex flex-col mb-6'>
															<div>Order No #: {selectedOrder.orderNo}</div>
															<div className='text-xs'>
																Date: {selectedOrder.dateString}
															</div>
														</div>
														<div className='mb-8'>
															<h2 className='text-lg font-bold'>Bill To:</h2>
															<div className='text-gray-700 mb-2'>
																{selectedOrder.customerName}
															</div>
															{/* <div className="text-gray-700 mb-2">123 Main St.</div>
                                                    <div className="text-gray-700 mb-2">Anytown, USA 12345</div>
                                                    <div className="text-gray-700">johndoe@example.com</div> */}
														</div>
														<table className='w-full mb-8'>
															<thead>
																<tr>
																	<th className='text-left font-bold text-gray-700'>
																		Description
																	</th>
																	<th className='text-right font-bold text-gray-700'>
																		Amount
																	</th>
																</tr>
															</thead>
															<tbody>
																{selectedOrder.items.map((v) => (
																	<tr>
																		<td className='text-left text-gray-700'>
																			{v.title}
																		</td>
																		<td className='text-right text-gray-700'>
																			{v.price}USD
																		</td>
																	</tr>
																))}
															</tbody>
															<tfoot className=''>
																<tr>
																	<td className='text-2xl text-left font-bold text-gray-700'>
																		Total
																	</td>
																	<td className='text-2xl text-right font-bold text-gray-700'>
																		{selectedOrder.totalCost.toFixed(2)}
																		{currency}
																	</td>
																</tr>
															</tfoot>
														</table>
													</div>
													<div className='text-gray-700 mb-2'>
														Thank you for your business!
													</div>
													{/* <div className="text-gray-700 text-sm">Please remit payment within 30 days.</div> */}
												</div>
											</div>
											<div className='w-full mb-6'>
												<button
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
													onClick={SaveAsPDFHandler}
												>
													<span>Download</span>
												</button>
											</div>
										</div>
									</Transition.Child>
								</div>
							</Dialog>
						</Transition>
					</div>

					<ToastContainer position='top-right' autoClose={5000} />
				</div>
			</AppAccess>
		</div>
	);
};

export default Accounting;
