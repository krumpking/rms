import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { Dialog, Transition } from '@headlessui/react';
import ReactPaginate from 'react-paginate';
import { IUser } from '../app/types/userTypes';
import { AMDIN_FIELD, LIGHT_GRAY } from '../app/constants/constants';
import {
	addDocument,
	deleteDocument,
	getDataFromDBOne,
	updateDocument,
} from '../app/api/mainApi';
import { USER_COLLECTION } from '../app/constants/userConstants';
import { searchStringInArray } from '../app/utils/arrayM';
import Loader from '../app/components/loader';
import ClientNav from '../app/components/clientNav';
import { print } from '../app/utils/console';
import AppAccess from '../app/components/accessLevel';
import { useAuthIds } from '../app/components/authHook';
import { createId } from '../app/utils/stringM';
import Head from 'next/head';

const ManageUsers = () => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [categories, setCategories] = useState<IUser[]>([]);
	const [webfrontId, setWebfrontId] = useState('');
	const [title, setTitle] = useState('');
	const [files, setFiles] = useState<any[]>([]);
	const [docId, setDocId] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [category, setCategory] = useState('');
	const [users, setUsers] = useState<IUser[]>([]);
	const [usersTemp, setUsersTemp] = useState<IUser[]>([]);
	const [edit, setEdit] = useState(false);
	const [editItem, setEditItem] = useState<any>({
		category: '',
		title: '',
		description: '',
		price: 0,
	});
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState<IUser>({
		id: 'id',
		userId: '',
		adminId: 'adminId',
		access: [],
		contact: '',
		name: '',
		email: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		dateOfUpdate: new Date(),
	});
	const [labels, setLabels] = useState<string[]>([
		'ADDED DATE',
		'NAME',
		'CONTACT',
		'EMAIL',
		'ACCESS LEVEL',
	]);
	const [count, setCount] = useState(0);
	const [pages, setPages] = useState(0);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(10);
	const [search, setSearch] = useState('');
	const [selectedAccessArray, setselectedAccessArray] = useState<any[]>([]);
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
	const { adminId, userId, access } = useAuthIds();

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;

		getUsers();
	}, []);

	const getUsers = () => {
		getDataFromDBOne(USER_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();

						setUsers((users) => [
							...users,
							{
								id: element.id,
								userId: d.id,
								adminId: d.adminId,
								contact: d.contact,
								name: d.name,
								email: d.email,
								access: d.access,
								date: new Date(),
								dateString: new Date().toDateString(),
								dateOfUpdate: new Date(),
							},
						]);
						setUsersTemp((users) => [
							...users,
							{
								id: element.id,
								userId: d.id,
								adminId: d.adminId,
								contact: d.contact,
								name: d.name,
								email: d.email,
								access: d.access,
								date: new Date(),
								dateString: new Date().toDateString(),
								dateOfUpdate: new Date(),
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

	const addUser = async () => {
		let newUser = {
			...user,
			adminId: adminId,
			userId: userId,
			id: createId(),
		};

		setOpen(false);
		setLoading(true);
		setUsers([]);
		addDocument(USER_COLLECTION, newUser)
			.then((v) => {
				getUsers();
			})
			.catch((e: any) => {
				getUsers();
				console.error(e);
				toast.error('There was an error please try again');
			});
	};

	const getReadyToUpdate = (v: IUser) => {
		setOpen(true);
		setUser(v);
		setEdit(true);
	};

	const editUser = async () => {
		let newItem = { ...user, dateOfUpdate: new Date().toDateString() };

		setOpen(false);
		setLoading(true);
		setUsersTemp([]);

		updateDocument(USER_COLLECTION, user.id, newItem)
			.then((v) => {
				setFiles([]);
				getUsers();
				setOpen(false);
			})
			.catch((e: any) => {
				setFiles([]);
				getUsers();
				setOpen(false);
				console.error(e);
				toast.error('There was an error please try again');
			});
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

	const handleChange = (e: any) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleKeyDown = (event: { key: string }) => {
		if (event.key === 'Enter') {
			searchFor();
		}
	};

	const searchFor = () => {
		setUsersTemp([]);

		setLoading(true);
		if (search !== '') {
			let res: IUser[] = searchStringInArray(users, search);

			if (res.length > 0) {
				setTimeout(() => {
					setUsersTemp(res);
					setLoading(false);
				}, 1500);
			} else {
				toast.info(`${search} not found `);
				setTimeout(() => {
					setUsersTemp(users);
					setLoading(false);
				}, 1500);
			}
		} else {
			setTimeout(() => {
				setUsersTemp(users);
				setLoading(false);
			}, 1500);
		}
	};

	const editArray = (v: string) => {
		if (user.access.includes(v)) {
			let newArray: any[] = [];
			user.access.forEach((el) => {
				if (el !== v) {
					newArray.push(el);
				}
			});

			setUser({ ...user, access: newArray });
		} else {
			let newArray: any[] = user.access;
			newArray.push(v);
			setUser({ ...user, access: newArray });
		}
	};

	const deleteUser = () => {
		deleteDocument(USER_COLLECTION, user.id)
			.then((v) => {
				if (v !== null) {
					getUsers();
					toast.success('Account successfully deleted');
				}
			})
			.catch((e) => {
				toast.error('Oooops looks like there was an error deleting the user');
				setLoading(false);
				console.error(e);
			});
	};

	return (
		<div>
			<Head>
				<meta name='viewport' content='width=978'></meta>
			</Head>
			<AppAccess access={accessArray} component={'admin'}>
				<div>
					<div className='flex flex-col'>
						<div className='col-span-3'>
							<ClientNav organisationName={'Vision Is Primary'} url={'users'} />
						</div>

						<div className='w-full m-2 px-2 py-8 sm:px-0 col-span-9 '>
							<div>
								<div className='bg-white rounded-[30px] p-4 relative'>
									{loading ? (
										<div className='w-full flex flex-col items-center content-center'>
											<Loader color={''} />
										</div>
									) : (
										<div className='w-full'>
											{usersTemp.length > 0 ? (
												<div>
													<div className='flex flex-col overflow-y-scroll max-h-[700px] w-full gap-4 p-4'>
														<div className=''>
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
																{usersTemp
																	.slice(start, end)
																	.map((value, index) => {
																		return (
																			<tr
																				key={index}
																				onClick={() => {
																					getReadyToUpdate(value);
																				}}
																				className={
																					'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'
																				}
																			>
																				<td className='text-left'>
																					{value.dateString}
																				</td>
																				<td className='text-left'>
																					{value.name}
																				</td>
																				<td className='text-left'>
																					{value.contact}
																				</td>
																				<td className='text-left col-span-3'>
																					{value.email}
																				</td>
																				<td className='text-left col-span-3'>
																					{value.access.slice(0, 4).toString()}
																					...
																				</td>
																			</tr>
																		);
																	})}
															</tbody>
														</table>
														<div>
															{usersTemp.length > 0 ? (
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
											) : (
												<h1>Looks like you are yet to add any users</h1>
											)}
										</div>
									)}
								</div>
								<div className='fixed bottom-10 left-0 right-10 z-10  flex flex-row-reverse'>
									<button
										onClick={() => {
											setEdit(false);
											setUser({
												id: '',
												userId: userId,
												adminId: adminId,
												access: [],
												contact: '',
												name: '',
												email: '',
												date: new Date(),
												dateString: new Date().toDateString(),
												dateOfUpdate: new Date(),
											});

											setOpen(true);
										}}
										className='
                                    font-bold
                                    rounded-full
                                    border-2
                                    border-[#8b0e06]
                                    border-primary
                                    p-5
                                    bg-[#8b0e06]
                                    text-base 
                                    text-white
                                    cursor-pointer
                                    hover:bg-opacity-90
                                    transition
                                '
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
												d='M12 4.5v15m7.5-7.5h-15'
											/>
										</svg>
									</button>
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
														{edit ? 'Edit User' : 'Add User'}
													</Dialog.Title>
													<div className='flex flex-col items-center space-y-2 w-full'>
														<div className='w-full'>
															<input
																type='text'
																value={user.name}
																placeholder={'Full Name'}
																onChange={handleChange}
																name='name'
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
																name='contact'
																value={user.contact}
																placeholder={'Phone Number'}
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
															<input
																type='text'
																name='email'
																value={user.email}
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
														{edit ? (
															<div className='w-full px-4'>
																<p>Current access </p>
																<div className='max-h-[200px] overflow-y-scroll'>
																	{user.access.map((v) => (
																		<p>{v}</p>
																	))}
																</div>
															</div>
														) : (
															<p></p>
														)}
														<div className='flex flex-col justify-left w-full px-4'>
															{accessArray.map((v: any) => (
																<div className='flex flex-row space-x-4 text-left'>
																	<input
																		type='checkbox'
																		id={v}
																		name={v}
																		value='Item'
																		onChange={() => {
																			editArray(v);
																		}}
																		className='accent-[#8b0e06]'
																	/>
																	<p>{v}</p>
																</div>
															))}
														</div>
														<button
															onClick={() => {
																edit ? editUser() : addUser();
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
															{edit ? 'Update User' : 'Add User'}
														</button>
														{edit ? (
															<button
																onClick={() => {
																	setOpen(false);
																	setLoading(true);
																	deleteUser();
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
																Delete
															</button>
														) : (
															<p></p>
														)}
													</div>
												</div>
											</Transition.Child>
										</div>
									</Dialog>
								</Transition>

								<ToastContainer position='top-right' autoClose={5000} />
							</div>
						</div>
					</div>

					<ToastContainer position='top-right' autoClose={5000} />
				</div>
			</AppAccess>
		</div>
	);
};

export default ManageUsers;
