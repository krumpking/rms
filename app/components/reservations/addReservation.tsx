import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { createId } from '../../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { AMDIN_FIELD } from '../../constants/constants';
import Loader from '../loader';
import { ToastContainer, toast } from 'react-toastify';
import { print } from '../../utils/console';
import { useRouter } from 'next/router';
import { IReservation } from '../../types/reservationTypes';
import { RESERVATION_COLLECTION } from '../../constants/reservationConstants';
import {
	addDocument,
	deleteDocument,
	getDataFromDBOne,
	updateDocument,
} from '../../api/mainApi';
import { Disclosure } from '@headlessui/react';
import { useAuthIds } from '../authHook';

const AddReservation = () => {
	const [addedInfo, setAddedInfo] = useState('');
	const [loading, setLoading] = useState(true);
	const [docId, setDocId] = useState('');
	const router = useRouter();
	const [reservation, setReservation] = useState<IReservation>({
		id: '',
		adminId: '',
		userId: '',
		name: '',
		phoneNumber: 0,
		email: '',
		date: new Date(),
		time: '',
		peopleNumber: 0,
		notes: '',
		category: '',
		dateAdded: new Date(),
		dateOfUpdate: new Date(),
		dateAddedString: new Date().toDateString(),
	});
	const [reservations, setReservations] = useState<IReservation[]>([]);
	const [isEditRes, setIsEditRes] = useState(false);
	const { adminId, userId, access } = useAuthIds();

	useEffect(() => {
		getReservations();
	}, []);

	const getReservations = () => {
		getDataFromDBOne(RESERVATION_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();
						setReservations((prevRes) => [
							...prevRes,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								name: d.name,
								phoneNumber: d.phoneNumber,
								email: d.email,
								date: d.date,
								time: d.time,
								peopleNumber: d.peopleNumber,
								notes: d.notes,
								category: d.category,
								dateAdded: d.dateAdded,
								dateOfUpdate: d.dateOfUpdate,
								dateAddedString: d.dateAddedString,
							},
						]);
					});
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const handleChange = (e: any) => {
		setReservation({ ...reservation, [e.target.name]: e.target.value });
	};

	const addReservationDatabase = () => {
		setLoading(true);
		setReservations([]);
		if (isEditRes) {
			updateDocument(RESERVATION_COLLECTION, reservation.id, reservation)
				.then((v) => {
					setLoading(false);
					getReservations();
					toast.success('Reservation updated successfully');
				})
				.catch((e) => {
					setLoading(false);
					toast.error('There was an error, please try again');
				});
		} else {
			let newRes = {
				...reservation,
				adminId: adminId,
				userId: userId,
			};
			addDocument(RESERVATION_COLLECTION, newRes)
				.then((v) => {
					getReservations();
					toast.success('Reservation added successfully');
				})
				.catch((e) => {
					getReservations();
					toast.error('There was an error, please try again');
				});
		}
	};

	const deleteItem = (id: string) => {
		var result = confirm('Are you sure you want to delete?');
		if (result) {
			//Logic to delete the item
			setLoading(true);
			setReservations([]);
			deleteDocument(RESERVATION_COLLECTION, id)
				.then(() => {
					getReservations();
				})
				.catch((e: any) => {
					console.error(e);
				});
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader color={''} />
				</div>
			) : (
				<div className='grid grid-cols-2 gap-4'>
					<div className='flex flex-col'>
						<div className='mb-6'>
							<input
								type='text'
								name='name'
								value={reservation.name}
								placeholder={'Full Name'}
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
							/>
						</div>
						<div className='mb-6'>
							<p className='text-xs text-gray-400 text-center'>Phone Number</p>
							<input
								type='text'
								name='phoneNumber'
								value={reservation.phoneNumber}
								placeholder={'Phone Number'}
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
							/>
						</div>
						<div className='mb-6'>
							<p className='text-xs text-gray-400 text-center'>
								Date of reservation
							</p>
							<input
								type='date'
								// value={reservation.date}
								name='date'
								placeholder={'Date'}
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
							/>
						</div>
						<div className='mb-6'>
							<p className='text-xs text-gray-400 text-center'>
								Time of Reservation
							</p>
							<input
								type='time'
								name='time'
								value={reservation.time}
								placeholder={'Time'}
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
							/>
						</div>
						<div className='mb-6'>
							<p className='text-xs text-gray-400 text-center'>
								Number of people for the reservation
							</p>
							<input
								type='number'
								name='peopleNumber'
								value={reservation.peopleNumber}
								placeholder={'Number of People'}
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
							/>
						</div>
						<div className='mb-6'>
							<textarea
								name='notes'
								value={reservation.notes}
								placeholder={'Notes'}
								onChange={handleChange}
								className='
                  w-full
                  rounded-[20px]
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
							/>
						</div>
						<div className='mb-6 w-full'>
							<button
								className=' w-full
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
                  focus:border-primary'
								onClick={(e) => e.preventDefault()}
							>
								<select
									value={reservation.category}
									name='category'
									onChange={handleChange}
									className='bg-white w-full'
									required
								>
									<option value='Category' hidden>
										Category
									</option>
									<option value='Inside'>Inside</option>
									<option value='Outside'>Outside</option>
								</select>
							</button>
						</div>
						<div className='mb-6'>
							<button
								onClick={() => {
									addReservationDatabase();
								}}
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
							>
								{isEditRes ? 'Update Reservation' : 'Add Reservation'}
							</button>
						</div>
					</div>
					<div className='flex flex-col max-h-[700px] overflow-y-auto'>
						{reservations.map((v) => (
							<div>
								<div className='flex flex-col shadow-xl rounded-[25px] p-8 w-full '>
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
												setIsEditRes(true);
												setReservation(v);
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
									<h1 className='font-bold text-xl text-[#8b0e06]'>
										Reservation Name: {v.name}
									</h1>
									<h1 className='font-bold text-sm'>
										Date: {v.dateAddedString}
									</h1>
									<h1 className='font-bold text-sm'>
										Time: {v.dateAddedString}
									</h1>
									<h1 className='font-bold text-sm'>
										Number of people: {v.peopleNumber}
									</h1>
									<h1 className='font-bold text-sm'>{v.category}</h1>
									<Disclosure>
										<Disclosure.Button className={'-ml-16 underline text-xs'}>
											See Order Details
										</Disclosure.Button>
										<Disclosure.Panel>
											<div className='flex flex-col shadow-xl p-4 rounded-[25px]'>
												<p className='text-xs'>{v.notes}</p>
											</div>
										</Disclosure.Panel>
									</Disclosure>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default AddReservation;
