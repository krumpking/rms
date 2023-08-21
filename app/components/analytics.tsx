import React, { useState } from 'react';
import { FC } from 'react';
import { createId } from '../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { addAClientToDB } from '../api/crmApi';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';

const Analytics = () => {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [stage, setStage] = useState('');
  const [notes, setNotes] = useState('');
  const [refSource, setRefSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [salesPerson, setSalesPerson] = useState('');

  const addClient = () => {

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
              value={fullName}
              placeholder={'Full Name'}
              onChange={(e) => {
                setFullName(e.target.value);
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
              value={contact}
              placeholder={'Contact'}
              onChange={(e) => {
                setContact(e.target.value);
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
              value={organisation}
              placeholder={'Organisation'}
              onChange={(e) => {
                setOrganisation(e.target.value);
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
            <button className="font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full">
              <select
                value={stage}
                onChange={(e) => {
                  setStage(e.target.value);
                }}
                className="bg-white w-full"
                data-required="1"
                required
              >
                <option value="Contact" hidden>
                  Stage of communication
                </option>
                <option value="Contact Made">Contact Made</option>
                <option value="Appointment Set">Appointment Set</option>
                <option value="Presentation Made">Presentation Made</option>
                <option value="Decision Maker brought in">
                  Decision Maker brought in
                </option>
                <option value="Contract Sent">Contract Sent</option>
                <option value="Contract Signed">Contract Signed</option>
                <option value="Project Started">Project Started</option>
                <option value="Project In Progress">Project In Progress</option>
                <option value="Project Finished">Project Finished</option>
              </select>
            </button>
          </div>
          <div className="mb-6">
            <input
              value={products}
              placeholder={'List of products/services enquired'}
              onChange={(e) => {
                setProducts(e.target.value);
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
              value={totalAmount}
              placeholder={'Total Value Amount'}
              onChange={(e) => {
                setTotalAmount(e.target.value);
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
            <textarea
              value={notes}
              placeholder={'Notes'}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              className="
                                    w-full
                                    rounded-[25px]
                                    border-2
                                    border-[#fdc92f]
                                    py-3
                                    px-5
                                    h-48
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
            <textarea
              value={refSource}
              placeholder={'How they heard'}
              onChange={(e) => {
                setRefSource(e.target.value);
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
                                    h-24
                                    "
            />
            <textarea
              value={salesPerson}
              placeholder={'Sales Person'}
              onChange={(e) => {
                setSalesPerson(e.target.value);
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
                                    h-24
                                    "
            />
          </div>
          <div className="mb-6">
            <button
              onClick={() => {
                addClient();
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
              Add Client
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Analytics;
