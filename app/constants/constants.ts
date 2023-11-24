import { collection } from 'firebase/firestore';
import { firestore } from '../../firebase/clientApp';
import { createId } from '../utils/stringM';

export const AMDIN_FIELD = 'adminId';

export const CURRENCIES = ['ZWL', 'USD'];

export const FOODIES_BOOTH_URL = 'https://foodiesbooth.com';

// Main
export const API_ROUTE = 'https://meganb-backend.herokuapp.com'; //'http://localhost:3146'//

export const WHATSAPP_CONTACT =
	'https://wa.me/263713020524?text=Hello%20I%20want%20to%20know%20more%20about%20Foodiesbooth%20I%20got%20your%20number%20from%20your%20website';

export const DOWNLOAD_APP =
	'https://play.google.com/store/apps/details?id=com.visionisprimary.digitaldatatree';

export const PRIMARY_COLOR = '#8b0e06';

export const SECONDARY_COLOR = '#fc0109';

export const THIRD_COLOR = '#ce513b';

export const FOURTH_COLOR = '#ffcf00';

export const FIFTH_COLOR = '#f0a300';

export const LIGHT_GRAY = '#ECECEC';

export const DISCLAIMER = `The products and services listed on this marketplace platform are provided by third-party sellers. FoodiesBooth does not endorse or guarantee the quality, safety, or accuracy of any product or service listed on this platform. FoodiesBooth is not responsible for any damages or losses caused by any product or service listed on this platform.

FoodiesBooth is not responsible for any damages or losses caused by the products or services of third-party sellers. FoodiesBooth does not endorse or guarantee the quality, safety, or accuracy of any product or service listed on this platform.


By using this marketplace platform, you agree to release FoodiesBooth from any and all liability arising from the use of any product or service listed on this platform.`;

export const ADMINS_DB_REF = collection(firestore, 'admins');
export const PRIMARY_URL_LOCAL = 'localhost:3000';

export const COOKIE_NAME = 'gMh88OSfz';
export const COOKIE_PHONE = 'jZmDw9V3i';
export const COOKIE_ORGANISATION = '6a7ZP6ZtJ';

export const COOKIE_EMAIL = '1OU2lbIQK';
export const USER_ID = 'y5Kgz3qY';
export const ADMIN_ID = '34y98u75b2j';
export const ACCESS = 'f7853r4d9872';
export const URL_LOCK_ID = 'AaM2a1VHtTXZWjcVw7hjrsM7aR8SJ6L5OL00rYUdf';
export const FREE_PACKAGE = 'Free';
export const SOLO_PACKAGE = 'Solo';
export const TEAM_PACKAGE = 'Team';
export const ENTERPRISE_PACKAGE = 'Enterprise';
export const FREE_PACKAGE_PRICE = 0;
export const SOLO_PACKAGE_PRICE = 9;
export const TEAM_PACKAGE_PRICE = 29;
export const ENTERPRISE_PACKAGE_PRICE = 49;

export const TEMPLATES = [
	{
		id: 'vistorslog',
		title: 'Visitors Log Form',
		description: 'Helps record all entrance and depatures into the building',
		elements: [
			{
				id: createId(),
				elementId: 10,
				label: 'Date',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 7,
				label: 'Time In',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Name of visitor',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 1,
				label: 'Reason for visit',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Person Visiting',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 7,
				label: 'Time Out',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Nation ID No',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 17,
				label: 'Signature',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Security Initials',
				arg1: '',
				arg2: '',
				arg3: '',
			},
		],
		ipAddress: 'string',
		areasLocked: 'string',
		dateCreated: 'string',
	},
	{
		id: 'inventorytracking',
		title: 'Inventory Tracking',
		description: 'Helps record all entrance and depatures into the building',
		elements: [
			{
				id: createId(),
				elementId: 2,
				label: 'Item Number',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Description',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Quantity',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 10,
				label: 'Last Date Updated',
				arg1: '',
				arg2: '',
				arg3: '',
			},
		],
		ipAddress: 'string',
		areasLocked: 'string',
		dateCreated: 'string',
	},
	{
		id: 'employeetimesheet',
		title: 'Employee Timesheet',
		description: 'Record Employee time spent at work',
		elements: [
			{
				id: createId(),
				elementId: 0,
				label: 'Employee Title',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Employee Identification Number',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Employee Type',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Department / Team',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Active Supervisor',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 10,
				label: 'Date',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 7,
				label: 'Start Time',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 7,
				label: 'End Time',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Regular hours',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Overtime',
				arg1: '',
				arg2: '',
				arg3: '',
			},
		],
		ipAddress: 'string',
		areasLocked: 'string',
		dateCreated: 'string',
	},
	{
		id: 'employeebasicinfo',
		title: 'Employee Basic Info',
		description: 'Record Employee Basic Information',
		elements: [
			{
				id: createId(),
				elementId: 0,
				label: 'Employee Full Name',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 1,
				label: 'Address',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Home Phone',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Cell Phone',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 3,
				label: 'Email',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'National ID',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 10,
				label: 'Date of Birth',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 5,
				label: 'Marital Status',
				arg1: ['Married', 'Single'],
				arg2: ['Married', 'Single'],
				arg3: ['Married', 'Single'],
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Next of Kin Name',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Next of Kin Phone Number',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Next of Kin Address',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Next of Kin relationship',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Job Title',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Supervisor',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 0,
				label: 'Work Location',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 3,
				label: 'Email Address',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Work Phone',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 10,
				label: 'Start Date',
				arg1: '',
				arg2: '',
				arg3: '',
			},
			{
				id: createId(),
				elementId: 2,
				label: 'Salary',
				arg1: '',
				arg2: '',
				arg3: '',
			},
		],
		ipAddress: 'string',
		areasLocked: 'string',
		dateCreated: 'string',
	},
];

export const PRODUCTION_CLIENT_ID =
	'AaM2a1VHtTXZWjcVw7hjrsM7aR8SJ6L5OL00rYUdf_3BeTONzf7FvQrFvRwLq4T0X-9xaliSbRRwRTKX';

export const NEXT_PUBLIC_GOOGLE_ANALYTICS = 'G-EG2R1271VF';

export const MAPS_KEY = 'AIzaSyB2h_YmVxQIVMQyiIhV2qPypa7YmoGoqlQ';
