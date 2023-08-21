import { addDoc } from 'firebase/firestore';
import { ICategory } from '../types/menuTypes';
import { MENU_REF } from '../constants/menuConstants';

export const addCategory = async (category: ICategory) => {
  // Create a query against the collection.

  return addDoc(MENU_REF, category);
};
