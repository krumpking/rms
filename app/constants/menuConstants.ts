import { collection } from 'firebase/firestore';
import { firestore } from '../../firebase/clientApp';

export const MENU_REF = collection(firestore, 'menu-categories');
