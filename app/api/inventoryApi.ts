import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebase/clientApp';
import { IConfirm } from '../types/confirmTypes';
import Inventory from './../../pages/inventory';

export const AddInventory = async (Inventory: IConfirm) => {
  const INVENTORY_DB_REF = collection(firestore, `foodiesbooth`);

  return await addDoc(INVENTORY_DB_REF, Inventory);
};

const getInventory = async () => {
  const q = query(collection(db, 'foodiesbooth'));
  const querySnapshot = await getDocs(q);
};

export const UpdateInventory = async (id: string) => {
  return await updateDoc(doc(firestore, 'foodiesbooth', id), {});
};
