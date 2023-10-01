import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
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
import { containsObject, findOccurrences, findOccurrencesObjectId, searchStringInArray } from '../../utils/arrayM';
import ReactPaginate from 'react-paginate';
import AppAccess from '../accessLevel';
import { useAuthIds } from '../authHook';




const ConfirmInventory = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
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
    const [labels, setLabels] = useState<string[]>(['TRANSACTION DATE', 'TITLE', 'DETAILS', 'CATEGORY', 'NUMBER OF ITEMS']);
    const [selectedTrans, setSelectedTrans] = useState<IStockCategory[]>([]);
    const [stockItemsTemp, setStockItemsTemp] = useState<IStockItem[]>([]);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [search, setSearch] = useState("");



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;

        getStockItems();
    }, []);

    const getStockItems = () => {

        getDataFromDBTwo(STOCK_ITEM_COLLECTION, AMDIN_FIELD, adminId, 'confirmed', false).then((v) => {

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

                    setStockItemsTemp(stockItems => [...stockItems, {
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
                        confirmed: false
                    }]);

                });
                var numOfPages = Math.floor(v.count / 10);
                if (v.count % 10 > 0) {
                    numOfPages++;
                }
                setPages(numOfPages);
                setCount(v.count);



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

        if (containsObject(v, selectedTrans)) {
            let newArray: IStockCategory[] = [];
            selectedTrans.forEach((el) => {
                if (el.id !== v.id) {
                    newArray.push(el);
                }
            });
            setSelectedTrans(newArray);
        } else {
            let newItem = { ...v, confirmed: true, dateOfUpdate: new Date().toDateString() }
            setSelectedTrans([...selectedTrans, newItem]);
        }

    }

    const confirmStockItems = async () => {


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


    const deleteItems = () => {
        var result = confirm("Are you sure you want to delete?");
        if (result) {
            setLoading(true);
            selectedTrans.forEach((el) => {
                //Logic to delete the item           
                deleteDocument(STOCK_ITEM_COLLECTION, el.id).then(() => {

                }).catch((e: any) => {
                    console.error(e);
                });
            });

        }
    }


    const handlePageClick = (event: { selected: number; }) => {
        let val = event.selected + 1;
        if (count / 10 + 1 === val) {
            setStart(count - (count % 10));
            setEnd(count);
        } else {
            setStart(Math.ceil((val * 10) - 10));
            setEnd(val * 10);
        }
    };

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            searchFor();
        }
    };

    const searchFor = () => {
        setStockItemsTemp([]);

        setLoading(true);
        if (search !== '') {

            let res: IStockItem[] = searchStringInArray(stockItems, search);

            if (res.length > 0) {
                setTimeout(() => {
                    setStockItemsTemp(res);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setStockItemsTemp(stockItems);
                    setLoading(false);
                }, 1500);


            }


        } else {

            setTimeout(() => {
                setStockItemsTemp(stockItems);
                setLoading(false);
            }, 1500);

        }
    }


    return (
        <AppAccess access={access} component={'confirm-stock'}>
            <div className='relative'>
                <div className="bg-white rounded-[30px] p-4  ">
                    <div>
                        {loading ? (
                            <div className="w-full flex flex-col items-center content-center">
                                <Loader color={''} />
                            </div>
                        ) : (
                            <div className="flex flex-col overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
                                <div className=''>
                                    <input
                                        type="text"
                                        value={search}
                                        placeholder={"Search"}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                        }}
                                        className="
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
                                        "
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
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
                                            stockItemsTemp.slice(start, end).map((value, index) => {
                                                return (
                                                    <tr key={index}
                                                        onClick={() => { getReadyToUpdate(value) }}
                                                        className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                        <td className='w-1'>
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
                                                        <td className='text-left' >{value.category}</td>
                                                        <td className='text-left' >{value.itemNumber}</td>

                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                    <tfoot>
                                        {stockItemsTemp.length > 0 ? <div className='flex w-full'>
                                            <ReactPaginate
                                                pageClassName="border-2 border-[#8b0e06] px-2 py-1 rounded-full"
                                                previousLinkClassName="border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold"
                                                nextLinkClassName="border-2 border-[#8b0e06] px-2 py-2 rounded-[25px] bg-[#8b0e06] text-white font-bold"
                                                breakLabel="..."
                                                breakClassName=""
                                                containerClassName="flex flex-row space-x-4 content-center items-center "
                                                activeClassName="bg-[#8b0e06] text-white"
                                                nextLabel="next"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={1}
                                                pageCount={pages}
                                                previousLabel="previous"
                                                renderOnZeroPageCount={() => null}
                                            />
                                        </div> : <p></p>}
                                    </tfoot>
                                </table>

                            </div>
                        )}
                    </div>

                </div>
                <div className='fixed bottom-10 left-0 right-10 z-10'>
                    <div className='flex flex-row-reverse space-x-4'>
                        <button
                            onClick={() => {

                                confirmStockItems();
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
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                        </button>
                        <button
                            onClick={() => {

                                deleteItems();
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
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>

                        </button>

                    </div>
                </div>



                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </AppAccess>

    );
};

export default ConfirmInventory;
