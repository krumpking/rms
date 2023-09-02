import React, { Fragment, useCallback, useEffect, useState } from 'react';

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
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, updateDocument, uploadFile } from '../../api/mainApi';
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { IStockCategory, IStockItem } from '../../types/stockTypes';
import { STOCK_CATEGORY_REF, STOCK_ITEM_COLLECTION } from '../../constants/stockConstants';

const AddInventory = () => {
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
    dateOfUpdate: new Date().toDateString()
  });
  const [labels, setLabels] = useState<string[]>(['TRANSACTION DATE', 'TITLE', 'DETAILS', 'TRANSACTION TYPE', 'NUMBER OF ITEMS']);

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

    getCategories();
    getStockItems();
  }, []);


  const getCategories = () => {

    getDataFromDBOne(STOCK_CATEGORY_REF, AMDIN_FIELD, adminId).then((v) => {

      if (v !== null) {

        v.data.forEach(element => {
          let d = element.data();

          setCategories(categories => [...categories, {
            id: element.id,
            adminId: d.adminId,
            userId: d.userId,
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


  const getStockItems = () => {

    getDataFromDBOne(STOCK_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

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
            dateOfUpdate: d.dateOdUpdate
          }]);

        });



      }
      setLoading(false);

    }).catch((e) => {
      console.error(e);
      setLoading(true);
    });
  }


  const addStockItem = async () => {

    setOpen(false);



    setLoading(true);

    setStockItems([]);
    addDocument(STOCK_ITEM_COLLECTION, stockItem).then((v) => {

      setFiles([]);
      getStockItems();
    }).catch((e: any) => {
      setFiles([]);
      getStockItems();
      console.error(e);
      toast.error('There was an error please try again');
    });







  }




  const getReadyToUpdate = (v: IMenuItem) => {
    setOpen(true);
    setEditItem(v);
    setEdit(true);
    setTitle(v.title);
    setDescription(v.description);
    setPrice(v.price);
    setCategory(v.category);

  }


  const editStockItem = async () => {

    setOpen(false);
    setLoading(true);
    setStockItems([]);
    updateDocument(STOCK_ITEM_COLLECTION, editItem.id, stockItem).then((v) => {
      setFiles([]);
      getStockItems();
      setOpen(false);
    }).catch((e: any) => {
      setFiles([]);
      getStockItems();
      setOpen(false);
      console.error(e);
      toast.error('There was an error please try again');
    });

  }


  const deleteItem = (id: string, pic: any) => {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
      //Logic to delete the item
      setLoading(true);
      deleteDocument(STOCK_ITEM_COLLECTION, id).then(() => {
        getStockItems();
      }).catch((e: any) => {
        console.error(e);
      });
    }
  }


  const handleChange = (e: any) => {
    setStockItem({
      ...stockItem,
      [e.target.name]: e.target.value
    })
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
                        onClick={() => { setSelectedTrans(value); setOpen(true); }}
                        className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
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
            <div className='flex shadow-xl rounded-[25px] p-8 w-[250px]  items-center justify-center' onClick={() => { setOpen(true) }}>
              <div className='flex flex-col items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="w-16 h-16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Menu Item
              </div>
            </div>
            {menuItems.map((v) => {
              return (
                <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                  <div className='flex flex-row-reverse'>
                    <button onClick={() => { deleteItem(v.id, v.pic) }}>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>


                    </button>
                    <button onClick={() => { getReadyToUpdate(v); }}>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>



                    </button>

                  </div>
                  <ShowImage src={`/${webfrontId}/menu-item/${v.pic.thumbnail}`} alt={'Menu Item'} style={'rounded-[25px] h-20 w-full'} />
                  <div className='flex flex-row justify-between'>
                    <h1 className='font-bold text-sm'>{v.title}</h1>
                    <h1 className='font-bold text-sm'>{v.price}USD</h1>
                  </div>

                </div>
              )
            })}

          </div>
        )}
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="min-h-screen px-4 text-center backdrop-blur-sm ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                <Dialog.Title
                  as="h3"
                  className="text-sm font-medium leading-6 text-gray-900 m-4"
                >

                  Add Stock Item
                </Dialog.Title>
                <div className="flex flex-col items-center space-y-2 w-full">

                  <div className="mb-6 w-full">
                    <input
                      type="text"
                      value={stockItem.title}
                      placeholder={'Title'}
                      onChange={handleChange}
                      name="title"
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
                  <div className="mb-6 w-full">
                    <textarea
                      name="details"
                      value={stockItem.details}
                      placeholder={'Item Description'}
                      onChange={handleChange}
                      className="
                          h-25
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
                  <div className="mb-6 w-full">
                    <button className='font-bold rounded-[25px] border-2 border-[#8b0e06] bg-white px-4 py-3 w-full'
                      onClick={(e) => e.preventDefault()}>
                      <select value={stockItem.category}
                        onChange={handleChange}
                        name="category"
                        className='bg-white w-full'
                        data-required="1"
                        required>
                        <option value="Item Category" hidden>
                          Select Item Category
                        </option>
                        {categories.map(v => (
                          <option value={v.category} >
                            {v.category}
                          </option>
                        ))}
                      </select>
                    </button>
                  </div>
                  <div className="mb-6 w-full">
                    <p className='text-xs text-gray-400 text-center'>Number of items</p>
                    <input
                      type="number"
                      name="itemNumber"
                      value={stockItem.itemNumber}
                      placeholder={'Price in USD'}
                      onChange={handleChange}
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
                  <button
                    onClick={() => {

                      edit ? editStockItem() : addStockItem();
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
                    {edit ? 'Update Menu Item' : 'Add Menu Item'}
                  </button>
                </div>


              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddInventory;
