import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { decrypt } from '../../utils/crypto';
import { ICategory, IMeal, IMenuItem } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, updateDocument, uploadFile } from '../../api/mainApi';
import { MEAL_ITEM_COLLECTION, MEAL_STORAGE_REF, MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { findOccurrences, findOccurrencesObjectId, searchStringInArray } from '../../utils/arrayM';
import { createId } from '../../utils/stringM';
import { useAuthIds } from '../authHook';

const CreateMeal = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [docId, setDocId] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [menuItemsSto, setMenuItemsSto] = useState<IMenuItem[]>([]);
    const [edit, setEdit] = useState(false);
    const [editItem, setEditItem] = useState<any>({
        category: "",
        title: "",
        description: "",
        price: 0
    });
    const [open, setOpen] = useState(false);
    const [addItems, setAddItems] = useState<IMenuItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [search, setSearch] = useState("");
    const [finalTotal, setFinalTotal] = useState(0);
    const [displayedItems, setDisplayedItems] = useState<any>([]);


    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;



        getCategories();
        getMenuItems();
    }, []);

    const getCategories = () => {

        getDataFromDBOne(MENU_CAT_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    setCategories(categories => [...categories, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        pic: d.pic,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }


    const getMenuItems = () => {

        getDataFromDBOne(MENU_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    setMenuItems(menuItems => [...menuItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        pic: d.pic,
                        title: d.title,
                        discount: d.discount,
                        description: d.description,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString,
                        price: d.price
                    }]);

                    setMenuItemsSto(menuItems => [...menuItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        pic: d.pic,
                        title: d.title,
                        discount: d.discount,
                        description: d.description,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString,
                        price: d.price
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }


    const getTotal = () => {
        let total = 0;

        addItems.forEach((el) => {
            total += el.price;
        });
        return total;
    }

    const removeItem = (v: any) => {
        let items: any[] = [];
        displayedItems.forEach((e: any) => {
            if (v.id !== e.id) {
                items.push(e);
            }
        });
        setDisplayedItems(items);
        let aItems: any[] = [];
        addItems.forEach((e) => {
            if (v.id !== e.id) {
                aItems.push(e);
            }
        });
        setAddItems(aItems);
    }


    const addMeal = async () => {


        if (files.length > 0) {
            const name = files[0].name;
            setLoading(true);

            try {


                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }



                await uploadFile(`${adminId}/${MEAL_STORAGE_REF}/${name}`, files[0]);
                const info = name.split('_');


                try {
                    const compressedFile = await imageCompression(files[0], options);

                    // Thumbnail
                    await uploadFile(`${adminId}/${MEAL_STORAGE_REF}/thumbnail_${name}`, compressedFile);
                    let meal: IMeal = {
                        id: 'id',
                        adminId: adminId,
                        title: title,
                        description: description,
                        menuItems: addItems,
                        discount: discount,
                        pic: {
                            original: name,
                            thumbnail: `thumbnail_${name}`
                        },
                        category: category,
                        date: new Date(),
                        dateString: new Date().toDateString(),
                        userId: userId,
                        price: price
                    }


                    addDocument(MEAL_ITEM_COLLECTION, meal).then((v) => {
                        setLoading(false);
                        toast.success("Meal Added Successfully");

                    }).catch((e: any) => {
                        setLoading(false);

                        console.error(e);
                        toast.error('There was an error please try again');
                    });

                }
                catch (error) {
                    console.log(error);
                }




            } catch (e) {
                console.error(e);
            }
        } else {
            toast.error('Oooops looks like you missed the meal image');
        }

    }


    const checkIfItOccurs = (id: string) => {
        let count = findOccurrencesObjectId(addItems, id);
        if (count > 0) {
            return 'ring-2 ring-[#8b0e06]';
        } else {
            return '';
        }
    }

    const getCount = (id: string) => {
        let total = 0;

        addItems.forEach((el: any) => {
            if (el.id == id) {
                total++;
            }
        });
        return total;
    }

    const addItemsToMeal = (v: any) => {
        setAddItems(categories => [...categories, v]);
        let display = displayedItems;

        let count = 0;
        let index = 0;
        for (let i = 0; i < displayedItems.length; i++) {
            if (displayedItems[i].id === v.id) {
                count = displayedItems[i].count + 1;
                index = i;
                return;
            }
        }
        if (count > 0) {

            display[index] = {
                id: displayedItems[index].id,
                itemName: displayedItems[index].itemName,
                count: count,
                price: displayedItems[index].price
            };
        } else {
            display.push({
                id: v.id,
                itemName: v.title,
                count: 1,
                price: v.price
            })
        }

        setDisplayedItems(display);
    }

    const getPriceOfItem = (v: any) => {
        let total = 0;

        displayedItems.forEach((el: any) => {
            if (el.id === v.id) {

                total = findOccurrencesObjectId(addItems, v.id) * v.price;

                return;
            }


        });
        return total;

    }

    const onDrop = useCallback((acceptedFiles: File[]) => {


        if (files.length > 0) {
            let currFiles = files;

            currFiles.concat(acceptedFiles);
            setFiles(currFiles);
        } else {
            setFiles(acceptedFiles);
        }




    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            setMenuItems([]);
            setLoading(true);
            if (search !== '') {

                let res: IMenuItem[] = searchStringInArray(menuItemsSto, search);
                if (res.length > 0) {
                    setTimeout(() => {
                        setMenuItems(res);
                        setLoading(false);
                    }, 1500);
                } else {
                    toast.info(`${search} not found`);
                    setTimeout(() => {
                        setMenuItems(menuItemsSto);
                        setLoading(false);
                    }, 1500);

                }
            } else {

                setTimeout(() => {
                    setMenuItems(menuItemsSto);
                    setLoading(false);
                }, 1500);

            }



        }
    };




    return (
        <div>
            <div className="bg-white rounded-[30px] p-4 ">
                {loading ? (
                    <div className="w-full flex flex-col items-center content-center">
                        <Loader color={''} />
                    </div>
                ) : (

                    <div className='grid grid-cols-12'>
                        <div className="col-span-9   overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
                            <div className='mb-6'>
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

                            <div className='w-full'>
                                {menuItems.length > 0 ? <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                                    {menuItems.map((v) => {
                                        return (
                                            <div className={'flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] ' + checkIfItOccurs(v.id)}
                                                onClick={() => {
                                                    addItemsToMeal(v);
                                                }}>
                                                <ShowImage src={`/${adminId}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Menu Item'} style={'rounded-[25px] h-20 w-full'} />
                                                <div className='flex flex-row justify-between'>
                                                    <h1 className='font-bold text-sm'>{v.title}</h1>
                                                    <h1 className='font-bold text-sm'>{v.price}USD</h1>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div> : <h1 className='col-span-2'>Looks like you are yet to add Menu Items</h1>}

                            </div>


                        </div>
                        <div className='col-span-3 flex flex-col p-4 '>
                            <div className='max-h-[150px] overflow-y-scroll'>
                                <div className='flex flex-row justify-between shadow-md m-4 p-4 rounded-[25px]'>
                                    <p className="text-xs"> Item</p>
                                    <div className='flex justify-between space-x-2'>
                                        <p className="text-xs" >No of Items</p>
                                        <p className="text-xs">Price</p>
                                        <p className="text-xs">Total</p>
                                        <p className="text-xs w-4"></p>
                                    </div>

                                </div>
                                {displayedItems.map((v: any) => (
                                    <div className='flex flex-row justify-between shadow-sm m-4 p-4'>
                                        <h1>{v.itemName}</h1>
                                        <div className='flex justify-between space-x-4'>
                                            <h1>{getCount(v.id)}</h1>
                                            <h1>{v.price}</h1>
                                            <h1>{getPriceOfItem(v)}</h1>
                                            <button onClick={() => { removeItem(v) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>

                                        </div>

                                    </div>
                                ))}
                            </div>

                            <div className='flex flex-row justify-between px-8'>
                                <h1 className='text-xl'>Combined Total</h1>
                                <h1 className='text-xl'>{getTotal()}USD</h1>

                            </div>
                            <div>
                                <div className="flex flex-col border-dashed border-2 border-[#8b0e06] place-items-center p-2 rounded-[20px] my-4" {...getRootProps()}>
                                    <input className="hidden"

                                        {...getInputProps()} />

                                    <div className="mt-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                                            />
                                        </svg>
                                    </div>
                                    <p>Drop picture here</p>
                                    <p>or</p>
                                    <p>Click here to select</p>
                                </div>


                            </div>
                            {files.length > 0 ? <p className='bg-green-600 text-white w-full rounded-[25px] p-4'>{files.length} Image{files.length > 1 ? 's' : ''} Added</p> : <p></p>}
                            <div className='flex flex-row justify-between'>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        value={title}
                                        placeholder={"Meal title"}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
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
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div className="mb-6 w-full">
                                    <textarea
                                        value={description}
                                        placeholder={"Meal Description"}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
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
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-6 w-full">
                                <button className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
                                    onClick={(e) => e.preventDefault()}>
                                    <select value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                        }}
                                        className='bg-white w-full'
                                        data-required="1"
                                        required>
                                        <option value="Chapter" hidden>
                                            Select Meal Category
                                        </option>
                                        {categories.map(v => (
                                            <option value={v.category} >
                                                {v.category}
                                            </option>
                                        ))}
                                    </select>
                                </button>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div className="mb-6 w-full">
                                    <p className='text-xs text-gray-400 text-center'>Discount in percentage</p>
                                    <input
                                        type="number"
                                        value={discount}
                                        placeholder={"Discount"}
                                        onChange={(e) => {
                                            setDiscount(parseInt(e.target.value));
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
                                        required
                                    />
                                </div>
                            </div>

                            <div className='flex flex-row justify-between'>
                                <div className="mb-6 w-full">
                                    <p className='text-xs text-gray-400 text-center'>Final Total Price</p>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1000000"
                                        value={price}
                                        placeholder={"Final total"}
                                        onChange={(e) => {
                                            setPrice(parseFloat(e.target.value));
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
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    addMeal()
                                }}
                                className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        border-primary
                                        py-3
                                        px-10
                                        bg-[#8b0e06]
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    "
                            >
                                Add Meal
                            </button>


                        </div>
                    </div>


                )}
            </div>



            <ToastContainer position="top-right" autoClose={5000} />
        </div >
    );
};

export default CreateMeal;
