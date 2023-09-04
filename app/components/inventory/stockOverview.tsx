import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMenuItem } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, getDataFromDBTwo, updateDocument, uploadFile } from '../../api/mainApi';
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { IStockCategory, IStockItem } from '../../types/stockTypes';
import { STOCK_CATEGORY_REF, STOCK_ITEM_COLLECTION } from '../../constants/stockConstants';
import { containsObject, findOccurrences, findOccurrencesObjectId } from '../../utils/arrayM';




const StockOverview = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [adminId, setAdminId] = useState('adminId');
    const [categories, setCategories] = useState<IStockCategory[]>([]);

    const [webfrontId, setWebfrontId] = useState("");
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [docId, setDocId] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stockItems, setStockItems] = useState<IStockItem[]>([]);
    const [edit, setEdit] = useState(false);
    const [editItem, setEditItem] = useState<any>({
        category: "",
        title: "",
        description: "",
        price: 0
    });
    const [open, setOpen] = useState(false);
    const [stockItem, setStockItem] = useState<IStockItem>({
        id: "id",
        adminId: "adminId",
        userId: "userId",
        transactionType: "Add",
        category: "",
        title: "",
        details: "",
        itemNumber: 0,
        date: new Date(),
        dateString: new Date().toDateString(),
        dateOfUpdate: new Date().toDateString(),
        status: 'Pantry',
        confirmed: false
    });
    const [labels, setLabels] = useState<string[]>(['TRANSACTION DATE', 'TITLE', 'DETAILS', 'TRANSACTION TYPE', 'NUMBER OF ITEMS']);
    const [selectedTrans, setSelectedTrans] = useState<IStockCategory[]>([]);

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        var infoFromCookie = '';
        if (getCookie(ADMIN_ID) == '') {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }
        // setAdminId(decrypt(infoFromCookie, COOKIE_ID));
        setWebfrontId("webfrontId");


        getStockItems();
    }, []);





    const getStockItems = () => {




        getDataFromDBTwo(STOCK_ITEM_COLLECTION, AMDIN_FIELD, adminId, 'status', status).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();
                    setStockItems(stockItems => [...stockItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        transactionType: d.transactionType,
                        category: d.category,
                        title: d.title,
                        details: d.details,
                        itemNumber: d.itemNumber,
                        date: d.date,
                        dateString: d.dateString,
                        dateOfUpdate: d.dateOdUpdate,
                        status: 'Pantry',
                        confirmed: d.confirmed
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }






    const getReadyToUpdate = (v: IStockItem) => {
        setOpen(true);
        setStockItem(v);
        setEdit(true);

    }

    const editArray = (v: IStockItem) => {


        let updateStatus = 'Pantry';
        switch (status) {
            case 'Pantry':
                updateStatus = 'Kitchen';
                break;
            case 'Kitchen':
                updateStatus = 'Served';
                break;
                break;

            default:
                updateStatus = 'Pantry';
                break;
        }

        if (containsObject(v, selectedTrans)) {
            let newArray: IStockCategory[] = [];
            selectedTrans.forEach((el) => {
                if (el.id !== v.id) {
                    newArray.push(el);
                }
            });
            setSelectedTrans(newArray);
        } else {
            let newItem = { ...v, status: updateStatus, dateOfUpdate: new Date().toDateString() }
            setSelectedTrans([...selectedTrans, newItem]);
        }

    }




    const sendStockItems = async () => {


        setLoading(true);
        selectedTrans.forEach((el) => {
            //Logic to delete the item           
            updateDocument(STOCK_ITEM_COLLECTION, el.id, el).then((v) => {
            }).catch((e: any) => {
                console.error(e);
                toast.error('There was an error please try again');
            });
            setTimeout(() => {
                setLoading(false);
            }, 2000);

        });


    }







    return (
        <div>
            <div className="bg-white rounded-[30px] p-4 ">
                {loading ? (
                    <div className="w-full flex flex-col items-center content-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex flex-col overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
                        <table className="table  border-separate space-y-6 text-sm w-full">
                            <thead className="bg-[#8b0e06] text-white font-bold0">

                                <tr>
                                    <th></th>
                                    {labels.map((v: any, index) => (
                                        <th key={v.label} className={`text-left`}>{v}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stockItems.map((value, index) => {
                                        return (
                                            <tr key={index}
                                                onClick={() => { getReadyToUpdate(value) }}
                                                className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        id={value.id}
                                                        name="item"
                                                        value="Item"
                                                        onChange={() => { editArray(value); }}
                                                        className='accent-[#8b0e06]' />
                                                </td>
                                                <td className='text-left' >{value.dateString}</td>
                                                <td className='text-left' >{value.title}</td>
                                                <td className='text-left' >{value.details}</td>
                                                <td className='text-left col-span-3' >{value.transactionType}</td>
                                                <td className='text-left' >{value.itemNumber}</td>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                )}
            </div>
            <div className='fixed bottom-10 left-0 right-10 z-10  flex flex-row-reverse'>

                <button
                    onClick={() => {
                        sendStockItems();
                    }}
                    className="
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
          "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>

                </button>
            </div>


            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default StockOverview;
