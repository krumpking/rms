import React, { useEffect, useState } from 'react';
import { LIGHT_GRAY, TEMPLATES } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { getCookie } from 'react-use-cookie';
import { decrypt, encrypt } from '../app/utils/crypto';
import Link from 'next/link';
import { getForms } from '../app/api/formApi';
import { IForm } from '../app/types/formTypes';
import { ITask } from '../app/types/taskTypes';
import { addDays } from 'date-fns';
import { print } from '../app/utils/console';
import Joyride from 'react-joyride';
import Script from 'next/script';
import AppAccess from '../app/components/accessLevel';
import { Tab } from '@headlessui/react';
import AddSchedule from '../app/components/staff/addSchedule';
import ConfirmSchedule from '../app/components/staff/approveSchedule';
import BasicCalendar from '../app/components/staff/calendar';
import Logs from '../app/components/staff/logs';
import Head from 'next/head';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const Staff = () => {
	const [phone, setPhone] = useState('');
	const [accessCode, setAccessCode] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [previousForms, setPreviousForms] = useState<IForm[]>([]);
	const [numberOfForms, setNumberOfForms] = useState(0);
	const [numberOfDevices, setNumberOfDevices] = useState<any>([]);
	const [diskSpaceUsed, setDiskSpaceUsed] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [paymentD, setpaymentD] = useState<Date>(new Date());
	const [steps, setSteps] = useState<any[]>([
		{
			target: '#tutorials',
			content:
				'Click on any of these to see a video tutorial on the various possibilities of Digital Data Tree',
		},
		{
			target: '#tasks_highlights',
			content:
				'When you created Tasks, they show up here, to remind you to of an any action as it pertains to your CRM(Customer Relationship Management)',
		},
		{
			target: '#custom_reports',
			content:
				'This shows all the custom reports you would have created to capture any information through our mobile application',
		},
		{
			target: '#form_templates',
			content:
				'This shows an example of the different kind of custom reports you can create for your team to capture',
		},

		{
			target: '#nav',
			content:
				'This is the navigation panel, to be able to use other features on the app, click on them to go through to them',
		},
		{
			target: '#payments',
			content: 'This shows you,when your next payment is due',
		},
	]);
	const [tutorialVids, settutorialVids] = useState([
		{
			title: 'Add organization information on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'hYjzHBrUmxk',
		},
		{
			title: 'How to generate a Quotation on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'uNjtbj12MBI',
		},
		{
			title: 'How to generate an Invoice on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'BycELuE3GJs',
		},
		{
			title: 'How to Create a form',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'GCJqe8Rdymk',
		},
		{
			title: 'How to add a client on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'BUd57WkUQ1c',
		},
		{
			title:
				'How to see Client information, update stage, add notes on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'F3C4fIPxOfE',
		},
		{
			title: 'How to search for clients on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: '7FIUetzu9T0',
		},
		{
			title: 'How to sort Clients by Date on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'aezxv_OE6aY',
		},
		{
			title: 'How to add a task on Digital Data Tree',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'LnathUtkUYI',
		},
		{
			title: 'How to see automated reports on client engagement and growth',
			description:
				'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
			id: 'AVTPs8nGUeg',
		},
	]);
	const [tabs, setTabs] = useState([
		'Shifts',
		'Schedule Shifts',
		'Confirm Shifts',
		'Logs',
	]);

	useEffect(() => {
		document.body.style.backgroundColor = LIGHT_GRAY;
	}, []);

	return (
		<div>
			<Head>
				<meta name='viewport' content='width=978'></meta>
			</Head>
			<div className='flex flex-col min-h-screen h-full'>
				<div className='lg:col-span-3' id='nav'>
					<ClientNav organisationName={'FoodiesBooth'} url={'staff'} />
				</div>

				{loading ? (
					<div className='flex flex-col justify-center items-center w-full col-span-9'>
						<Loader color={''} />
					</div>
				) : (
					<div className='bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8'>
						<Tab.Group>
							<Tab.List className='flex space-x-4 rounded-[25px] bg-[#f3f3f3] p-1 overflow-x-auto whitespace-nowrap'>
								{tabs.map((category) => (
									<Tab
										key={category}
										className={({ selected }) =>
											classNames(
												'w-full  py-2.5 text-sm font-medium leading-5 text-black rounded-[25px]',
												'ring-white m-1',
												selected
													? 'bg-white shadow-md focus:outline-none te'
													: 'text-black hover:bg-white/[0.12] hover:text-white focus:outline-none'
											)
										}
									>
										{category}
									</Tab>
								))}
							</Tab.List>
							<Tab.Panels className='mt-2 '>
								<Tab.Panel
									className={classNames(
										'rounded-xl bg-white p-3',
										'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
									)}
								>
									<BasicCalendar />
								</Tab.Panel>
								<Tab.Panel
									className={classNames(
										'rounded-xl bg-white p-3',
										'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
									)}
								>
									<AddSchedule />
								</Tab.Panel>
								<Tab.Panel
									className={classNames(
										'rounded-xl bg-white p-3',
										'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
									)}
								>
									<ConfirmSchedule />
								</Tab.Panel>
								<Tab.Panel
									className={classNames(
										'rounded-xl bg-white p-3',
										'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
									)}
								>
									<Logs />
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
				)}
			</div>

			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default Staff;
