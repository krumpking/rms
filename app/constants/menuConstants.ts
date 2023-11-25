import { collection } from 'firebase/firestore';
import { firestore } from '../../firebase/clientApp';

export const MENU_REF = collection(firestore, 'menu-categories');

export const MENU_CAT_COLLECTION = 'menu-categories';

export const MENU_ITEM_COLLECTION = 'menu-items';

export const MENU_STORAGE_REF = 'menu-item';

export const MEAL_ITEM_COLLECTION = 'meal-items';

export const MEAL_STORAGE_REF = 'meal-item';

export const CATEGORIES = [
	'Burger',
	'Cakes',
	'Chinese',
	'Dessert',
	'Fish',
	'Fried Chicken',
	'Greek',
	'Grill',
	'Halaal',
	'Indian',
	'Italian',
	'Mediterranean',
	'Mexican',
	'Pizza',
	'Savoury Treats',
	'Sushi',
	'Sweet Treats',
	'Thai',
	'Traditional',
];

export const ORDER_JUST_ADDED = 'Sent';
export const ORDER_IN_PREP = 'In Prep';
export const ORDER_READY = 'Ready';
export const ORDER_SHIPPED = 'Order Shipped';
export const ORDER_DELIVERED = 'Delivered';

export const MENU_PROMO_ITEM_COLLECTION = 'menu-items-promotions';

export const CATERING_PLATE_COLLECTION = 'catering-plates';
