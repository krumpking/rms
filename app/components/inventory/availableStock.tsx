import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, getDataFromDBTwo, updateDocument, uploadFile } from '../../api/mainApi';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { IStockCategory, IStockItem } from '../../types/stockTypes';
import { STOCK_CATEGORY_REF, STOCK_ITEM_COLLECTION } from '../../constants/stockConstants';
import { containsObject, findOccurrences, findOccurrencesObjectId, searchStringInArray } from '../../utils/arrayM';
import ReactPaginate from 'react-paginate';
import AppAccess from '../accessLevel';

interface MyProps {
  status: string,
}



const AvailableStock: FC<MyProps> = ({ status }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [adminId, setAdminId] = useState('adminId');
  const [categories, setCategories] = useState<IStockCategory[]>([]);
  const [stockItems, setStockItems] = useState<IStockItem[]>([]);
  const [edit, setEdit] = useState(false);
  const [webfrontId, setWebfrontId] = useState("");
  const [setNoOfItems, setSetNoOfItems] = useState(false);
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
  const [numberOfItems, setNumberOfItems] = useState(0);
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
  const [component, setComponent] = useState("");


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
    switch (status) {
      case 'Pantry':
        setComponent('move-from-pantry');
        break;
      case 'Kitchen':
        setComponent('move-from-kitchen');
        break;
      case 'Served':
        setComponent('move-to-served');
        break;

      default:
        setComponent('move-from-pantry');
        break;
    }


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
            category: d.category,
            title: d.title,
            details: d.details,
            itemNumber: d.itemNumber,
            date: d.date,
            dateString: d.dateString,
            dateOfUpdate: d.dateOdUpdate,
            status: d.status,
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


    if (status !== 'Served') {
      setOpen(true);
      setStockItem(v);
      setEdit(true);
    }


  }

  const sendStockItems = async () => {

    setOpen(false);
    setLoading(true);
    let updateStatus = 'Pantry';
    switch (status) {
      case 'Pantry':
        updateStatus = 'Kitchen';
        break;
      case 'Kitchen':
        updateStatus = 'Served';
        break;
      default:
        updateStatus = 'Pantry';
        break;
    }

    if (stockItem.itemNumber - numberOfItems > 0) {
      setStockItems([]);
      let newItem = { ...stockItem, dateOfUpdate: new Date().toDateString(), itemNumber: stockItem.itemNumber - numberOfItems }
      //Logic to delete the item
      updateDocument(STOCK_ITEM_COLLECTION, stockItem.id, newItem).then((v) => {
      }).catch((e: any) => {
        console.error(e);
        toast.error('There was an error please try again');
      });

      let addItem = { ...stockItem, status: updateStatus, dateOfUpdate: new Date().toDateString(), itemNumber: numberOfItems }
      addDocument(STOCK_ITEM_COLLECTION, addItem).then((r) => {
        getStockItems();
      }).catch((e) => {
        console.error(e);
        setLoading(false);
      });

      // });
    } else if (stockItem.itemNumber == numberOfItems) {
      setStockItems([]);
      let newItem = { ...stockItem, status: updateStatus, dateOfUpdate: new Date().toDateString(), itemNumber: numberOfItems }
      //Logic to delete the item
      updateDocument(STOCK_ITEM_COLLECTION, stockItem.id, newItem).then((v) => {
        getStockItems();;
      }).catch((e: any) => {
        console.error(e);
        toast.error('There was an error please try again');
      });



    } else {
      toast.error(`Looks like there is only ${stockItem.itemNumber} of ${stockItem.title} left and you are trying to move ${numberOfItems}.Try again!!`);
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
    <AppAccess access={accessArray} component={component}>
      <div>
        <div className="bg-white rounded-[30px] p-4 ">
          {loading ? (
            <div className="w-full flex flex-col items-center content-center">
              <Loader />
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

                    Type Number of items to move
                  </Dialog.Title>
                  <div className="flex flex-col items-center space-y-2 w-full">

                    <div className="mb-6 w-full">
                      <input
                        type="number"
                        value={numberOfItems}
                        placeholder={'No of Items to move'}
                        onChange={(e) => {
                          setNumberOfItems(parseInt(e.target.value));
                        }}
                        name="itemNumber"
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
                        sendStockItems();
                      }}
                      className="
                      w-full
                       font-bold
                       rounded-[25px]
                       border-2
                       border-[#8b0e06]
                       border-primary
                       py-3
                       px-2
                       bg-[#8b0e06]
                       text-base 
                       text-white
                       cursor-pointer
                       hover:bg-opacity-90
                       transition
                   "
                    >
                      Move

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

export default AvailableStock;
