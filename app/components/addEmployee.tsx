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

const AddEmployee = () => {
  const [surname, setSurname] = useState('');
  const [position, setPosition] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('');
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
              value={position}
              placeholder={'Employee Position'}
              onChange={(e) => {
                setPosition(e.target.value);
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
              value={surname}
              placeholder={'Employee Surname'}
              onChange={(e) => {
                setSurname(e.target.value);
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
              placeholder={'Employee Name'}
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
              value={gender}
              placeholder={'Employee Gender'}
              onChange={(e) => {
                setGender(e.target.value);
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
              value={date}
              placeholder={'Date of Birth'}
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
              value={address}
              placeholder={'Home Address'}
              onChange={(e) => {
                setAddress(e.target.value);
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
              placeholder={'Phone Number'}
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
              type="text"
              value={email}
              placeholder={'Email'}
              onChange={(e) => {
                setEmail(e.target.value);
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
              value={account}
              placeholder={'Account Number'}
              onChange={(e) => {
                setAccount(e.target.value);
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
              value={bank}
              placeholder={'Name of Bank'}
              onChange={(e) => {
                setBank(e.target.value);
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
                AddEmployee();
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
              Add Employee
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddEmployee;
