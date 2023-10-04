import { FC, useEffect } from 'react';
import { checkPaymentStatus } from '../utils/paymentUtil';
import { useRouter } from 'next/router';

interface MyProps {
	children: any;
	access: string[];
	component: string;
}

const AppAccess: FC<MyProps> = ({ children, access, component }) => {
	let timer: any;
	const router = useRouter();

	// when component mounts, it adds an event listeners to the window
	// each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 10 secs of inactivity resets.
	// However, if none of the event is triggered within 10 secs, that is app is inactive, the app automatically logs out.
	useEffect(() => {
		if (!access.includes(component)) {
			alert('You do not have the required access level for this page');
			window.location.pathname = '/home';
		}
		checkPayment();
	}, []);

	const checkPayment = async () => {
		const paymentStatus = await checkPaymentStatus();

		if (!paymentStatus) {
			alert(
				'It appears your payment is due, please pay up to continue enjoying FoodiesBooth'
			);

			router.push({
				pathname: '/payments',
			});
		}
	};

	return children;
};

export default AppAccess;
