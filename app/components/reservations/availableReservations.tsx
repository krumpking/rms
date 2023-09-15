import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { AMDIN_FIELD } from '../../constants/constants';
import Loader from '../loader';
import { IReservation } from '../../types/reservationTypes';
import { getDataFromDBOne } from '../../api/mainApi';
import { RESERVATION_COLLECTION } from '../../constants/reservationConstants';
import { searchStringInArray } from '../../utils/arrayM';
import ReactPaginate from 'react-paginate';
import { isAfter, isBefore, isEqual } from 'date-fns';
import { print } from '../../utils/console';

// var object = {};
// var array = [];
// var arrayOfObjects = [{},{},{}]

const AvailableReservations = (props: { isHistory: boolean }) => {
  const { isHistory } = props;
  const router = useRouter();
  const [label, setLabel] = useState<any[]>([
    'Name',
    'Phone Number',
    'Date',
    'Time',
    'Number of People',
  ]);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [reservationsTemp, setReservationsTemp] = useState<IReservation[]>([]);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [search, setSearch] = useState("");


  useEffect(() => {
    getReservations();
  }, []);


  const getReservations = () => {
    getDataFromDBOne(RESERVATION_COLLECTION, AMDIN_FIELD, '')
      .then((v) => {
        if (v !== null) {
          v.data.forEach((element) => {
            let d = element.data();
            let d1 = new Date(new Date().toDateString());
            let d2 = new Date(d.dateAddedString);

            if (isHistory) {
              if (isBefore(d2, d1)) {
                setReservations(prevRes => [...prevRes, {
                  id: element.id,
                  adminId: d.adminId,
                  userId: d.userId,
                  name: d.name,
                  phoneNumber: d.phoneNumber,
                  email: d.email,
                  date: new Date(),
                  time: d.time,
                  peopleNumber: d.peopleNumber,
                  notes: d.notes,
                  category: d.category,
                  dateAdded: new Date(),
                  dateOfUpdate: new Date(),
                  dateAddedString: new Date().toDateString(),
                }]);
                setReservationsTemp(prevRes => [...prevRes, {
                  id: element.id,
                  adminId: d.adminId,
                  userId: d.userId,
                  name: d.name,
                  phoneNumber: d.phoneNumber,
                  email: d.email,
                  date: new Date(),
                  time: d.time,
                  peopleNumber: d.peopleNumber,
                  notes: d.notes,
                  category: d.category,
                  dateAdded: new Date(),
                  dateOfUpdate: new Date(),
                  dateAddedString: new Date().toDateString(),
                }]);
              }

            } else {
              if (isEqual(d1, d2) || isAfter(d2, d1)) {
                setReservations(prevRes => [...prevRes, {
                  id: element.id,
                  adminId: d.adminId,
                  userId: d.userId,
                  name: d.name,
                  phoneNumber: d.phoneNumber,
                  email: d.email,
                  date: new Date(),
                  time: d.time,
                  peopleNumber: d.peopleNumber,
                  notes: d.notes,
                  category: d.category,
                  dateAdded: new Date(),
                  dateOfUpdate: new Date(),
                  dateAddedString: new Date().toDateString(),
                }]);
                setReservationsTemp(prevRes => [...prevRes, {
                  id: element.id,
                  adminId: d.adminId,
                  userId: d.userId,
                  name: d.name,
                  phoneNumber: d.phoneNumber,
                  email: d.email,
                  date: new Date(),
                  time: d.time,
                  peopleNumber: d.peopleNumber,
                  notes: d.notes,
                  category: d.category,
                  dateAdded: new Date(),
                  dateOfUpdate: new Date(),
                  dateAddedString: new Date().toDateString(),
                }]);
              }

            }



          });
          var numOfPages = Math.floor(v.count / 10);
          if (v.count % 10 > 0) {
            numOfPages++;
          }
          setPages(numOfPages);
          setCount(v.count);
        }



        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };


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
    setReservationsTemp([]);

    setLoading(true);
    if (search !== '') {

      let res: IReservation[] = searchStringInArray(reservations, search);

      if (res.length > 0) {
        setTimeout(() => {
          setReservationsTemp(res);
          setLoading(false);
        }, 1500);

      } else {
        toast.info(`${search} not found `);
        setTimeout(() => {
          setReservationsTemp(reservations);
          setLoading(false);
        }, 1500);


      }


    } else {

      setTimeout(() => {
        setReservationsTemp(reservations);
        setLoading(false);
      }, 1500);

    }
  }



  return (
    <div>
      <div className="flex flex-col">
        {loading ? (
          <div className="flex flex-col justify-center items-center w-full col-span-8">
            <Loader color={''} />
          </div>
        ) : (
          <div className="p-4 lg:p-8 2xl:p-16 rounded-md flex flex-col">
            <div className="overflow-x-auto whitespace-nowrap w-full">
              <table className="table-auto border-separate border-spacing-1 w-full">
                <thead className="bg-[#8b0e06] text-white font-bold w-full ">
                  <tr>
                    {label.map((v: any) => (
                      <th key={v} className="text-left">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reservationsTemp.map((value: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className={
                          'odd:bg-white even:bg-slate-50 hover:bg-[#8b0e06] hover:text-white hover:cursor-pointer'
                        }
                      >
                        <td>{value.name}</td>
                        <td>{value.phoneNumber}</td>
                        <td>{value.dateAddedString}</td>
                        <td>{value.time}</td>
                        <td>{value.peopleNumber}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div>
                {reservationsTemp.length > 0 ? <div className='flex w-full'>
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

          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AvailableReservations;
