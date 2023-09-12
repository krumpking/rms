import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { createId } from '../../utils/stringM';
import { getCookie } from 'react-use-cookie';
import {
  ADMIN_ID,
  AMDIN_FIELD,
  COOKIE_ID,
  PERSON_ROLE,
} from '../../constants/constants';
import { decrypt, encrypt } from '../../utils/crypto';
import { addAClientToDB } from '../../api/crmApi';
import Loader from '../loader';
import { ToastContainer, toast } from 'react-toastify';
import { print } from '../../utils/console';
import { useRouter } from 'next/router';
import { IBookingEvent, IReservation } from '../../types/reservationTypes';
import { getOrgInfoFromDB } from '../../api/orgApi';
import { RESERVATION_COLLECTION } from '../../constants/reservationConstants';
import {
  addDocument,
  deleteDocument,
  getDataFromDBOne,
} from '../../api/mainApi';

const AddReservation = () => {
  const [category, setCategory] = useState('Reservation');
  const [addedInfo, setAddedInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState('');
  const router = useRouter();
  const [reservation, setReservation] = useState<IReservation>({
    adminId: '',
    userId: '',
    name: '',
    phoneNumber: 0,
    email: '',
    date: new Date(),
    time: '',
    peopleNumber: 0,
    notes: '',
    category: '',
    dateAdded: new Date(),
    dateOfUpdate: new Date(),
    dateAddedString: new Date().toDateString(),
  });
  const [reservations, setReservations] = useState<IReservation[]>([]);

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = () => {
    getDataFromDBOne(RESERVATION_COLLECTION, AMDIN_FIELD, '')
      .then((v) => {
        if (v !== null) {
          v.data.forEach((element) => {
            let d = element.data();
            print(d);
            setReservations;
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleChange = (e: any) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const addReservationDatabase = () => {
    setLoading(true);
    addDocument(RESERVATION_COLLECTION, reservation)
      .then((v) => {
        setLoading(false);
        toast.success('Reservation added successfully');
      })

      .catch((e) => {
        setLoading(false);
        toast.error('There was an error, please try again');
      });
    getReservations();
  };

  const deleteItem = (id: string, pic: any) => {
    var result = confirm('Are you sure you want to delete?');
    if (result) {
      //Logic to delete the item
      setLoading(true);

      deleteDocument(RESERVATION_COLLECTION, id)
        .then(() => {
          getReservations();
        })
        .catch((e: any) => {
          console.error(e);
        });
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center content-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="mb-6">
              <input
                type="text"
                name="name"
                value={reservation.name}
                placeholder={'Name'}
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
              />
            </div>
            <div className="mb-6">
              <input
                type="number"
                name="phoneNumber"
                value={reservation.phoneNumber}
                placeholder={'Phone Number'}
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
              />
            </div>
            <div className="mb-6">
              <input
                type="date"
                // value={reservation.date}
                name="date"
                placeholder={'Date'}
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
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                name="time"
                value={reservation.time}
                placeholder={'Time'}
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
              />
            </div>
            <div className="mb-6">
              <input
                type="people"
                name="peopleNumber"
                value={reservation.peopleNumber}
                placeholder={'Number of People'}
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
              />
            </div>

            <div className="mb-6 w-full">
              <button
                className=" w-full
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
                                    focus:border-primary"
                onClick={(e) => e.preventDefault()}
              >
                <select
                  value={reservation.category}
                  name="category"
                  onChange={handleChange}
                  className="bg-white w-full"
                  required
                >
                  <option value="Category" hidden>
                    Category
                  </option>
                  <option value="Inside">Inside</option>
                  <option value="Outside">Outside</option>
                </select>
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={() => {
                  addReservationDatabase();
                }}
                className="
                                font-bold
                                w-full
                                rounded-[25px]
                                border-2
                                border-[#8b0e06]
                                border-primary
                                py-3
                                px-5
                                bg-[#8b0e06]
                                text-base
                                text-white
                                cursor-pointer
                                hover:bg-opacity-90
                                transition
                                    "
              >
                Add {category}
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            {reservations.map((v) => (
              <div
                onClick={() => {
                  setReservation(v);
                }}
              >
                <div className="flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] ">
                  <div className="flex flex-row-reverse">
                    <button onClick={() => {}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 m-1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button onClick={() => {}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddReservation;
