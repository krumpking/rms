import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { createId } from '../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, PERSON_ROLE } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { addAClientToDB } from '../api/crmApi';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import { print } from '../utils/console';
import { useRouter } from 'next/router';

const AddStock = () => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [stage, setStage] = useState('');
  const [notes, setNotes] = useState('');
  const [refSource, setRefSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState('');
  const [Price, setPrice] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const router = useRouter()


  useEffect(() => {
    let role = getCookie(PERSON_ROLE);
    var infoFromCookie = "";
    if (getCookie(ADMIN_ID) == "") {
      infoFromCookie = getCookie(COOKIE_ID);
    } else {
      infoFromCookie = getCookie(ADMIN_ID);
    }

    if (typeof role !== 'undefined') {
      if (role !== "") {
        var id = decrypt(infoFromCookie, COOKIE_ID);
        var roleTitle = decrypt(role, id);
        if (roleTitle !== "Admin") { // "Viewer" //"Editor"
          router.push('/home');
          toast.info("You do not have permission to access this page");
        }

      }
    }



  }, [])


  const addClient = () => {
    print("hello");
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center content-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
           <div className="mb-6">
            <input
              type="text"
              value={date}
              placeholder={'Date'}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="
                        w-full
                        rounded-[25px]
                        border-2
                        border-[#fdc92f]
                        py-3
                        px-5
                        bg-white
                        text-base text-body-color
                        placeholder-[#ACB6BE]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={category}
              placeholder={'Item Category'}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="
                        w-full
                        rounded-[25px]
                        border-2
                        border-[#fdc92f]
                        py-3
                        px-5
                        bg-white
                        text-base text-body-color
                        placeholder-[#ACB6BE]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={name}
              placeholder={'Item Name'}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="
                        w-full
                        rounded-[25px]
                        border-2
                        border-[#fdc92f]
                        py-3
                        px-5
                        bg-white
                        text-base text-body-color
                        placeholder-[#ACB6BE]
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={number}
              placeholder={'Number of Items'}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
              className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "
            />
          </div>


          <div className="mb-6">
            <input
              value={Price}
              placeholder={'Total Price in USD'}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    bg-white
                                    text-base text-body-color
                                    placeholder-[#ACB6BE]
                                    outline-none
                                    focus-visible:shadow-none
                                    focus:border-primary
                                    "
            />
          </div>



          <div className="mb-6">
            <button
              onClick={() => {
                AddStock();
              }}
              className="

                    font-bold
                    w-full
                    rounded-[25px]
                    border-2
                    border-[#fdc92f]
                    border-primary
                    py-3
                    px-5
                    bg-[#fdc92f]
                    text-base
                    text-[#7d5c00]
                    cursor-pointer
                    hover:bg-opacity-90
                    transition
                                    "
            >
              Add Stock
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddStock;
