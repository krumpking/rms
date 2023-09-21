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
import ReactPaginate from 'react-paginate';
import { searchStringInArray } from '../../utils/arrayM';
import AppAccess from '../accessLevel';

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
  const [stockItemsTemp, setStockItemsTemp] = useState<IStockItem[]>([]);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [search, setSearch] = useState("");
  const [accessArray, setAccessArray] = useState<any[]>([
    'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
    'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
    'staff-scheduling', 'website', 'payments']);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;


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
            confirmed: false
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




  const getReadyToUpdate = (v: IStockItem) => {
    setOpen(true);
    setStockItem(v);
    setEdit(true);

  }


  const editStockItem = async () => {



    let newItem = { ...stockItem, dateOfUpdate: new Date().toDateString() }

    setOpen(false);
    setLoading(true);
    setStockItems([]);
    updateDocument(STOCK_ITEM_COLLECTION, stockItem.id, newItem).then((v) => {
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


  const handleChange = (e: any) => {
    setStockItem({
      ...stockItem,
      [e.target.name]: e.target.value
    })
  }

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
    <AppAccess access={accessArray} component={'add-stock'}>
      <div>
        <div className="bg-white rounded-[30px] p-4 relative">
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
                          <td className='text-left' >{value.dateString}</td>
                          <td className='text-left' >{value.title}</td>
                          <td className='text-left' >{value.details}</td>
                          <td className='text-left col-span-3' >{value.category}</td>
                          <td className='text-left' >{value.itemNumber}</td>

                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              <div>
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
              </div>

            </div>
          )}
        </div>
        <div className='fixed bottom-10 left-0 right-10 z-10  flex flex-row-reverse'>

          <button
            onClick={() => {
              setOpen(true);
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
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
                      {edit ? 'Update Stock Item' : 'Add Stock Item'}
                    </button>
                  </div>


                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </AppAccess>

  );
};

export default AddInventory;
