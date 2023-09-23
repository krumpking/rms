import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

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




const StockOverview = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [categories, setCategories] = useState<IStockCategory[]>([]);
    const { adminId, userId, access } = useAuthIds();
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [docId, setDocId] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stockItems, setStockItems] = useState<any[]>([]);
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
    const [labels, setLabels] = useState<string[]>(['TITLE', 'DETAILS', 'NUMBER OF ITEMS']);
    const [selectedTrans, setSelectedTrans] = useState<IStockCategory[]>([]);
    const [stockItemsTemp, setStockItemsTemp] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [search, setSearch] = useState("");
    const [kitchenCount, setKitchenCount] = useState(0);
    const [pantryCount, setPantryCount] = useState(0);
    const [servedCount, setServedCount] = useState(0);
    const [binCount, setBinCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);


    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;
        getStockItems();
    }, []);

    const getStockItems = () => {




        getDataFromDBOne(STOCK_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {
                let display: any[] = [];
                let served = 0;
                let kitchen = 0;
                let pantry = 0;
                let bin = 0;
                let total = 0;
                v.data.forEach(element => {
                    let v = element.data();
                    total += parseInt(v.itemNumber);
                    if (v.status === 'Kitchen') {
                        kitchen += parseInt(v.itemNumber);
                    } else if (v.status === 'Pantry') {
                        pantry += parseInt(v.itemNumber);
                    } else if (v.status === 'Served') {
                        served += parseInt(v.itemNumber);
                    } else if (v.status === 'Binned') {

                        bin += parseInt(v.itemNumber);

                    }

                    let count = 0;
                    let index = 0;
                    for (let i = 0; i < display.length; i++) {

                        if (display[i].details === v.details) {
                            count = parseInt(display[i].itemNumber) + parseInt(v.itemNumber);
                            index = i;
                            break;
                        }
                    }

                    if (count > 0) {

                        display[index] = {
                            details: display[index].details,
                            id: display[index].id,
                            title: display[index].title,
                            itemNumber: count
                        };

                    } else {
                        display.push({
                            id: v.id,
                            dateString: v.dateOfUpdate,
                            title: v.title,
                            details: v.details,
                            itemNumber: v.itemNumber
                        })
                    }

                    // setStockItems((prevItems) => [...prevItems, display]);
                    // setStockItemsTemp((prevItems) => [...prevItems, display]);
                    // setStockItems(stockItems => [...stockItems, {
                    //     id: element.id,
                    //     adminId: d.adminId,
                    //     userId: d.userId,
                    //     transactionType: d.transactionType,
                    //     category: d.category,
                    //     title: d.title,
                    //     details: d.details,
                    //     itemNumber: d.itemNumber,
                    //     date: d.date,
                    //     dateString: d.dateString,
                    //     dateOfUpdate: d.dateOdUpdate,
                    //     status: d.status,
                    //     confirmed: d.confirmed
                    // }]);

                    // setStockItemsTemp(stockItems => [...stockItems, {
                    //     id: element.id,
                    //     adminId: d.adminId,
                    //     userId: d.userId,
                    //     transactionType: d.transactionType,
                    //     category: d.category,
                    //     title: d.title,
                    //     details: d.details,
                    //     itemNumber: d.itemNumber,
                    //     date: d.date,
                    //     dateString: d.dateString,
                    //     dateOfUpdate: d.dateOdUpdate,
                    //     status: d.status,
                    //     confirmed: false
                    // }]);


                });
                setStockItems(display);
                setStockItemsTemp(display);
                setKitchenCount(kitchen);
                setPantryCount(pantry);
                setServedCount(served);
                setTotalCount(total);
                setBinCount(bin);
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
        <AppAccess access={access} component={'stock-overview'}>
            <div>
                <div className="bg-white rounded-[30px] p-4 ">
                    {loading ? (
                        <div className="w-full flex flex-col items-center content-center">
                            <Loader color={''} />
                        </div>
                    ) : (
                        <div className="flex flex-col overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
                            <div className='grid grid-cols-5 shadow-lg p-8 rounded-[25px]'>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-2xl'>{totalCount}</h1>
                                    <h1>Stock Items</h1>
                                </div>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-md'>{servedCount}</h1>
                                    <h1>Items Served</h1>
                                </div>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-md'>{binCount}</h1>
                                    <h1>Items Binned</h1>
                                </div>
                                <div className='flex flex-col items-center border-r-2'>
                                    <h1 className='text-md'>{kitchenCount}</h1>
                                    <h1>Items in the Kitchen</h1>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <h1 className='text-md'>{pantryCount}</h1>
                                    <h1>Items in the Pantry</h1>
                                </div>

                            </div>
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
                                        {labels.map((v: any, index) => (
                                            <th key={v.label} className={`text-left`}>{v}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stockItemsTemp.map((value, index) => {
                                            return (
                                                <tr key={index}
                                                    className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                    <td className='text-left' >{value.title}</td>
                                                    <td className='text-left' >{value.details}</td>
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




                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </AppAccess>

    );
};

export default StockOverview;
