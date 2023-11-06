import React, { Fragment, useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { ITransaction } from '../../types/cashbookTypes';
import { getDataFromDBOne } from '../../api/mainApi';
import {
	CASHBOOOK_COLLECTION,
	CASHBOOOK_STORAGE_REF,
} from '../../constants/cashBookConstants';
import { ADMIN_ID, AMDIN_FIELD } from '../../constants/constants';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { searchStringInArray } from '../../utils/arrayM';
import DateMethods from '../../utils/date';
import { print } from '../../utils/console';
import ShowImage from '../showImage';
import OrderedItems from '../order/orderedItems';
import ReactPaginate from 'react-paginate';
import AppAccess from '../accessLevel';
import { useAuthIds } from '../authHook';
import { POINTS_COLLECTION } from '../../constants/loyaltyConstants';
import { IPoints } from '../../types/loyaltyTypes';

const CustomerPoints = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [labels, setLabels] = useState<string[]>([
		'DATE',
		'NAME',
		'PHONE',
		'EMAIL',
		'AMOUNT SPENT',
		'TOTAL POINTS',
		// 'REWARD TYPE',
	]);
	const [transactions, setTransactions] = useState<IPoints[]>([]);
	const [transactionsSto, setTransactionsSto] = useState<IPoints[]>([]);
	const [transactionsStoOther, setTransactionsStoOther] = useState<IPoints[]>(
		[]
	);
	const { adminId, userId, access } = useAuthIds();
	const [totalUSD, setTotalUSD] = useState(0);
	const [totalZWL, setTotalZWL] = useState(0);
	const [totalRecUSD, setTotalRecUSD] = useState(0);
	const [totalRecZWL, setTotalRecZWL] = useState(0);
	const [totalSpentUSD, setTotalSpentUSD] = useState(0);
	const [totalSpentZWL, setTotalSpentZWL] = useState(0);
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [selectedTrans, setSelectedTrans] = useState<any>();
	const [cat, setCat] = useState([
		'All time',
		'Today',
		'This Week',
		'This Month',
		'This Quarter',
		'This Year',
	]);

	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(10);
	const [pages, setPages] = useState(0);
	const [count, setCount] = useState(0);
	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = () => {
		getDataFromDBOne(POINTS_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v != null) {
					v.data.forEach((element) => {
						let d = element.data();

						setTransactions((transactions) => [
							...transactions,
							{
								id: d.id,
								adminId: d.adminId,
								userId: d.userId,
								date: d.date,
								dateString: d.dateString,
								numberOfPoints: d.numberOfPoints,
								dollarAmount: d.dollarAmount,
								rewardType: d.rewardType,
								name: d.name,
								phone: d.phone,
								email: d.email,
								orderTotal: d.orderTotal,
								order: d.order,
								pointsTotal: d.pointsTotal,
								used: d.used,
							},
						]);
						setTransactionsSto((transactions) => [
							...transactions,
							{
								id: d.id,
								adminId: d.adminId,
								userId: d.userId,
								date: d.date,
								dateString: d.dateString,
								numberOfPoints: d.numberOfPoints,
								dollarAmount: d.dollarAmount,
								rewardType: d.rewardType,
								name: d.name,
								phone: d.phone,
								email: d.email,
								orderTotal: d.orderTotal,
								order: d.order,
								pointsTotal: d.pointsTotal,
								used: d.used,
							},
						]);
						setTransactionsStoOther((transactions) => [
							...transactions,
							{
								id: d.id,
								adminId: d.adminId,
								userId: d.userId,
								date: d.date,
								dateString: d.dateString,
								numberOfPoints: d.numberOfPoints,
								dollarAmount: d.dollarAmount,
								rewardType: d.rewardType,
								name: d.name,
								phone: d.phone,
								email: d.email,
								orderTotal: d.orderTotal,
								order: d.order,
								pointsTotal: d.pointsTotal,
								used: d.used,
							},
						]);
					});
					var numOfPages = Math.floor(v.count / 10);
					if (v.count % 10 > 0) {
						numOfPages++;
					}
					setPages(numOfPages);
					setCount(v.count);
				}
			})
			.catch((e: any) => {
				console.error(e);
				toast.error('There was an error getting transactions');
			});
	};

	const handleKeyDown = (event: { key: string }) => {
		if (event.key === 'Enter') {
			searchFor();
		}
	};

	const searchFor = () => {
		setTransactions([]);

		setLoading(true);
		if (search !== '') {
			let res: IPoints[] = searchStringInArray(transactionsSto, search);
			if (res.length > 0) {
				setTimeout(() => {
					setTransactions(res);
					setLoading(false);
				}, 1500);
			} else {
				toast.info(`${search} not found `);
				setTimeout(() => {
					setTransactions(transactionsSto);
					setLoading(false);
				}, 1500);
			}
		} else {
			setTimeout(() => {
				setTransactions(transactionsSto);
				setLoading(false);
			}, 1500);
		}
	};

	const filterResults = (v: string) => {
		setLoading(true);
		setTransactions([]);
		setTransactionsSto([]);
		switch (v) {
			case 'All time':
				filterResultsByDate(100000000);
				break;
			case 'Today':
				filterResultsByDate(2);
				break;
			case 'This Week':
				filterResultsByDate(18);
				break;
			case 'This Month':
				filterResultsByDate(31);
				break;
			case 'This Quarter':
				filterResultsByDate(91);
				break;
			default:
				filterResultsByDate(100000000);
				break;
		}
	};

	const filterResultsByDate = (days: number) => {
		transactionsStoOther.forEach((element) => {
			if (
				DateMethods.diffDatesDays(
					element.dateString,
					new Date().toDateString()
				) < days
			) {
				setTransactions((transactions) => [...transactions, element]);
				setTransactionsSto((transactions) => [...transactions, element]);
			}
		});

		setLoading(false);
	};

	const handlePageClick = (event: { selected: number }) => {
		let val = event.selected + 1;
		if (count / 10 + 1 === val) {
			setStart(count - (count % 10));
			setEnd(count);
		} else {
			setStart(Math.ceil(val * 10 - 10));
			setEnd(val * 10);
		}
	};

	return (
		<AppAccess access={access} component={'cash-report'}>
			<div>
				{loading ? (
					<div className='flex flex-col items-center content-center'>
						<Loader color={''} />
					</div>
				) : (
					<div className='bg-white rounded-[30px] p-4 flex flex-col'>
						{/* <div className='grid grid-cols-2 shadow-lg p-8 rounded-[25px]'>
							<div className='grid grid-cols-2 border-r-2'>
								<div className='flex flex-col items-center'>
									<h1 className='text-md'>{getAvail('USD')} USD</h1>
									<h1>Available </h1>
								</div>
							</div>
							<div className='grid grid-cols-2'>
								<div className='flex flex-col items-center'>
									<h1 className='text-md'>{getAvail('ZWL')} ZWL</h1>
									<h1>Available</h1>
								</div>
							</div>
						</div> */}
						{/* <div className='flex flex-row space-x-4 m-6'>
							{cat.map((v) => (
								<button
									onClick={() => {
										filterResults(v);
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
						</div> */}

						<div>
							<div className='overflow-auto lg:overflow-visible h-screen shadow-lg p-8 rounded-[25px]'>
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
								<div>
									<table className='table  border-separate space-y-6 text-sm w-full'>
										<thead className='bg-[#8b0e06] text-white font-bold0'>
											<tr>
												{labels.map((v: any, index) => (
													<th key={v.label} className={`text-left`}>
														{v}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{transactions.slice(start, end).map((value, index) => {
												return (
													<tr
														key={index}
														onClick={() => {
															setSelectedTrans(value);
															setOpen(true);
														}}
														className={
															'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'
														}
													>
														<td className='text-left'>{value.dateString}</td>
														<td className='text-left'>{value.name}</td>
														<td className='text-left'>{value.phone}</td>
														<td className='text-left col-span-3'>
															{value.email}
														</td>
														<td className='text-left'>
															{value.orderTotal.toFixed(2)}
														</td>
														<td className='text-left'>{value.pointsTotal}</td>
														{/* <td className='text-left'>DISCOUNT</td> */}
													</tr>
												);
											})}
										</tbody>
									</table>
									<div>
										{transactions.length > 0 ? (
											<div className='flex w-full'>
												<ReactPaginate
													pageClassName='border-2 border-[#8b0e06] px-2 py-1 rounded-full'
													previousLinkClassName='border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold'
													nextLinkClassName='border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold'
													breakLabel='...'
													breakClassName=''
													containerClassName='flex flex-row space-x-4 content-center items-center '
													activeClassName='bg-[#8b0e06] text-white'
													nextLabel='next'
													onPageChange={handlePageClick}
													pageRangeDisplayed={1}
													pageCount={pages}
													previousLabel='previous'
													renderOnZeroPageCount={() => null}
												/>
											</div>
										) : (
											<p></p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<ToastContainer position='top-right' autoClose={5000} />
			</div>
		</AppAccess>
	);
};

export default CustomerPoints;
