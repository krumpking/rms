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
import { IPointsRate } from '../../types/loyaltyTypes';
import { REWARD_PARAMS_COLLECTION } from '../../constants/loyaltyConstants';

const AddLoyalty = () => {
	const [addedInfo, setAddedInfo] = useState('');
	const [loading, setLoading] = useState(true);
	const [docId, setDocId] = useState('');
	const router = useRouter();
	const [pointsRate, setPointsrate] = useState<IPointsRate>({
		id: '',
		adminId: '',
		userId: '',
		date: new Date(),
		dateString: new Date().toDateString(),
		numberOfPoints: 0,
		dollarAmount: 0,
		rewardType: 'Discount',
	});
	const [rewards, setRewards] = useState<IPointsRate[]>([]);
	const [isEditRes, setIsEditRes] = useState(false);
	const { adminId, userId, access } = useAuthIds();

	useEffect(() => {
		getRewardsParams();
	}, []);

	const getRewardsParams = () => {
		getDataFromDBOne(REWARD_PARAMS_COLLECTION, AMDIN_FIELD, adminId)
			.then((v) => {
				if (v !== null) {
					v.data.forEach((element) => {
						let d = element.data();
						setRewards((prevRes) => [
							...prevRes,
							{
								id: element.id,
								adminId: d.adminId,
								userId: d.userId,
								date: d.date,
								dateString: d.dateString,
								numberOfPoints: d.numberOfPoints,
								dollarAmount: d.dollarAmount,
								rewardType: d.rewardType,
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
		setPointsrate({ ...pointsRate, [e.target.name]: e.target.value });
	};

	const addRewardDatabase = () => {
		setLoading(true);
		setRewards([]);
		if (isEditRes) {
			updateDocument(REWARD_PARAMS_COLLECTION, pointsRate.id, pointsRate)
				.then((v) => {
					setLoading(false);
					getRewardsParams();
					toast.success('Reward updated successfully');
				})
				.catch((e) => {
					setLoading(false);
					toast.error('There was an error, please try again');
				});
		} else {
			let newRes = {
				...pointsRate,
				adminId: adminId,
				userId: userId,
			};
			addDocument(REWARD_PARAMS_COLLECTION, newRes)
				.then((v) => {
					getRewardsParams();
					toast.success('Reward added successfully');
				})
				.catch((e) => {
					getRewardsParams();
					toast.error('There was an error, please try again');
				});
		}
	};

	const deleteItem = (id: string) => {
		var result = confirm('Are you sure you want to delete?');
		if (result) {
			//Logic to delete the item
			setLoading(true);
			setRewards([]);
			deleteDocument(REWARD_PARAMS_COLLECTION, id)
				.then(() => {
					getRewardsParams();
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
						<p className='gray-text-400 text-xs text-center'>
							Number of points
						</p>
						<div className='mb-6'>
							<input
								type='text'
								name='numberOfPoints'
								value={pointsRate.numberOfPoints}
								placeholder={'Number of points'}
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
								Dollar Equivalent
							</p>
							<input
								type='text'
								name='dollarAmount'
								value={pointsRate.dollarAmount}
								placeholder={'Dollar Amount'}
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
							<button
								onClick={() => {
									addRewardDatabase();
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
								{isEditRes ? 'Update Reward' : 'Add Reward'}
							</button>
						</div>
					</div>
					<div className='flex flex-col max-h-[700px] overflow-y-auto'>
						{rewards.map((v) => (
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
												setPointsrate(v);
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

									<h1 className='font-bold text-sm'>Date: {v.dateString}</h1>
									<h1 className='font-bold text-xl text-[#8b0e06]'>
										Dollar Amount: {v.dollarAmount}
									</h1>
									<h1 className='font-bold text-sm'>
										Number of points: {v.numberOfPoints}
									</h1>
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

export default AddLoyalty;
