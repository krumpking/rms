/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { Dialog, Menu, Transition } from '@headlessui/react';

import {
  ADMIN_ID,
  COOKIE_ID,
  LIGHT_GRAY,
  PERSON_ROLE,
} from '../constants/constants';
import ClientNav from './clientNav';
import Loader from './loader';
// import {
//   addTasksToDB,
//   getAllEmployeesToDB,
//   updateEmployeeToDB,
// } from '../api/crmApi';
import { print } from '../utils/console';
import { searchStringInMembers } from '../utils/stringM';
import DateMethods from '../utils/date';
import { decrypt, encrypt } from '../utils/crypto';
import DataSummary from './dataSummary';
import Pill from './pill';
import { addDays } from 'date-fns';
import { IEmployee } from '../types/hrTypes';

const HRProfile = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [role, setRole] = useState('Admin');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [labels, setLabels] = useState([
    'Date Joined',
    'Position',
    'Full Name',
    'Phone Number',
    'Email',
  ]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editMember, setEditMember] = useState<any>();
  const [search, setSearch] = useState('');
  const [sortDateUp, setSortDateUp] = useState(false);
  const [tempEmployees, setTempEmployees] = useState<IEmployee[]>([
    {
      adminId: 'string',
      id: 'string',
      dateString: '5 June 2023',
      date: '5 June 2023',
      surname: 'Mudondo',
      name: 'Prosper',
      phone: '0782231251',
      bank: 'CBZ',
      position: 'Mister',
      email: 'fmudondo@gmail.com',
      gender: 'Male',
      address: '5445 Ruwa',
      account: '123456',
    },
    {
      adminId: 'string',
      id: 'string',
      dateString: '5 July 2023',
      date: '5 June 2023',
      surname: 'Mudo',
      name: 'Prosp',
      phone: '0782231245',
      bank: 'ZB',
      position: 'Manager',
      email: 'udondo@gmail.com',
      gender: 'Female',
      address: '545 Ruwa',
      account: '8996',
    },
    {
      adminId: 'string',
      id: 'string',
      dateString: '8 October 2023',
      date: '5 June 2023',
      surname: 'Dondo',
      name: 'Pros',
      phone: '0782234551',
      bank: 'Steward',
      position: 'CEO',
      email: 'ceo@gmail.com',
      gender: 'Male',
      address: '45 Ruwa',
      account: '783456',
    },
    {
      adminId: 'string',
      id: 'string',
      dateString: '8 September 2023',
      date: '5 June 2023',
      surname: 'Mdono',
      name: 'Fara',
      phone: '0712231251',
      bank: 'BancABC',
      position: 'Cleaner',
      email: 'cleaner@gmail.com',
      gender: 'Female',
      address: '45 Borodale',
      account: '45545',
    },
    {
      adminId: 'string',
      id: 'string',
      dateString: '10 December 2023',
      date: '5 June 2023',
      surname: 'John',
      name: 'Ban',
      phone: '0722231251',
      bank: 'CBZ',
      position: 'Accountant',
      email: 'fmudoo@gmail.com',
      gender: 'Male',
      address: '545 Ruwa',
      account: '5556',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [view, setView] = useState(0);
  const [notes, setNotes] = useState('');
  const [refSource, setRefSource] = useState('');
  const [products, setProducts] = useState('');
  const [docId, setDocId] = useState('');
  const [priority, setPriority] = useState('');
  const [reminder, setReminder] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;

    let role = getCookie(PERSON_ROLE);
    var infoFromCookie = '';
    if (getCookie(ADMIN_ID) == '') {
      infoFromCookie = getCookie(COOKIE_ID);
    } else {
      infoFromCookie = getCookie(ADMIN_ID);
    }

    if (typeof role !== 'undefined') {
      if (role !== '') {
        var id = decrypt(infoFromCookie, COOKIE_ID);
        var roleTitle = decrypt(role, id);
        if (roleTitle == 'Editor') {
          // "Viewer" //"Editor"
          router.push('/home');
          toast.info('You do not have permission to access this page');
        }
      }
    }

    // setEmployees([]);
    // getEmployeesFromDB();
  }, []);

  // const deleteMemb = (id: string) => {
  //     setLoading(true);
  //     deleteClientById(id).then((v) => {
  //         setUsers([]);
  //         getUsersFromDB();
  //     }).catch((e) => {
  //         console.error(e);
  //     })

  // }

  const getEmployeesFromDB = () => {
    setLoading(true);

    // getAllEmployeesToDB().then((v) => {

    //     var infoFromCookie = "";
    //     if (getCookie(ADMIN_ID) == "") {
    //         infoFromCookie = getCookie(COOKIE_ID);
    //     } else {
    //         infoFromCookie = getCookie(ADMIN_ID);
    //     }
    //     var id = decrypt(infoFromCookie, COOKIE_ID)
    //     if (v !== null) {
    //         var clnts: any[] = [];
    //         v.data.forEach(element => {

    //             var notesA: any = [];
    //             element.data().notes.forEach((el: string) => {
    //                 notesA.push(decrypt(el, id));
    //             });

    //             var prodA: any = [];
    //             element.data().enquired.forEach((el: string) => {
    //                 prodA.push(decrypt(el, id));
    //             });

    //             var client = {
    //                 docId: element.id,
    //                 id: element.data().id,
    //                 adminId: element.data().adminId,
    //                 dateString: element.data().dateString,
    //                 date: element.data().date,
    //                 name: decrypt(element.data().name, id),
    //                 contact: decrypt(element.data().contact, id),
    //                 organisation: decrypt(element.data().organisation, id),
    //                 stage: decrypt(element.data().stage, id),
    //                 notes: notesA,
    //                 refSource: decrypt(element.data().refSource, id),
    //                 enquired: prodA,
    //                 value: decrypt(element.data().value, id),
    //                 salesPerson: decrypt(element.data().salesPerson, id),
    //             }
    //             print(client);
    //             clnts.push(client);

    //         });
    //         let res = DateMethods.sortObjectsByDate(clnts, false);
    //         setEmployees(res);
    //         setTempEmployees(res);

    //     }

    //     setLoading(false);
    // }).catch((e) => {
    //     console.error(e);
    //     setLoading(false);
    // });
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      setLoading(true);
      if (search !== '') {
        let res: IEmployee[] = searchStringInMembers(employees, search);
        setTimeout(() => {
          setTempEmployees(res);
          setLoading(false);
        }, 1500);
      } else {
        toast.info(`${search} not found`);
        setTempEmployees(employees);
        setLoading(false);
      }
    }
  };

  const sortEmployees = () => {
    setLoading(true);
    setSortDateUp(!sortDateUp);
    setTempEmployees([]);
    var res = DateMethods.sortObjectsByDate(tempEmployees, sortDateUp);
    setTimeout(() => {
      setTempEmployees(res);
      setLoading(false);
    }, 2000);
  };

  const getView = () => {
    switch (view) {
      case 0:
        return (
          <div className="flex flex-col">
            <Pill title={`${editMember?.position}`} description={'Position'} />
            <Pill title={`${editMember?.name} ${editMember?.surname}`} description={'Full Name'} />
            <Pill
              title={`${editMember?.gender}`}
              description={'Gender'}
            />
            <Pill
              title={`${editMember?.date}`}
              description={'Date of Birth'}
            />
            <Pill
              title={`${editMember?.address}`}
              description={'Home Address'}
            />
            <Pill title={`${editMember?.phone}`} description={'Phone Number'} />
            <Pill title={`${editMember?.email}`} description={'Email Address'} />
            <Pill title={`${editMember?.account}`} description={'Account Number'} />
            <Pill
              title={`${editMember?.bank}`}
              description={'Name of Bank'}
            />
          </div>
        );
      case 1:
        return <div className="flex flex-col space-y-2 "></div>;
      case 2:
        return (
          <div className="flex flex-col space-y-2 ">
            <div className="mb-6">
              <button className="font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full">
                <select
                  value={'stage'}
                  onChange={(e) => {
                    // setStage(e.target.value);
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
                  <option value="Project In Progress">
                    Project In Progress
                  </option>
                  <option value="Project Finished">Project Finished</option>
                </select>
              </button>
            </div>
            <div className="mb-6">
              <button
                onClick={() => {
                  //   updateStage();
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
                Update Stage
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col space-y-2 ">
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
              <button
                onClick={() => {
                  //   addNotes();
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
                Add Notes
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-6">
              <input
                type="text"
                value={'title'}
                placeholder={'Title of task'}
                onChange={(e) => {
                  //   setTitle(e.target.value);
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
              <button className="font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full">
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                  className="bg-white w-full"
                  data-required="1"
                  required
                >
                  <option value="title" hidden>
                    Select Priority
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-xs text-center">Reminder cycle in days</p>
              <input
                type="number"
                value={reminder}
                placeholder={'Set reminder cycle in days'}
                onChange={(e) => {
                  //   setReminder(parseInt(e.target.value));
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
                value={description}
                placeholder={'Description'}
                onChange={(e) => {
                  setDescription(e.target.value);
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
              <button
                onClick={() => {
                  //   addTasks();
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
                Add Task
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col">
            <Pill title={`${editMember?.name}`} description={'Name'} />
            <Pill title={`${editMember?.contact}`} description={'Contact'} />
            <Pill
              title={`${editMember?.organisation}`}
              description={'Organization'}
            />
            <Pill
              title={`${editMember?.refSource}`}
              description={'Came to us through'}
            />
            <Pill
              title={`${editMember?.enquired}`}
              description={'Enquired About'}
            />
            <Pill title={`${editMember?.value}`} description={'Total Value'} />
            <Pill title={`${editMember?.stage}`} description={'Stage'} />
            <Pill title={`${editMember?.notes}`} description={'Notes'} />
          </div>
        );
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center content-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-2 p-4">
            <div>
              <p className="text-base">
                Total recorded of employees {employees.length}
              </p>
            </div>
          </div>

          <div className="w-full overscroll-contain overflow-y-auto max-h-screen min-h-screen">
            <table className="table-auto border-separate border-spacing-1  shadow-2xl rounded-[25px] p-4 w-full">
              <thead className=" text-white font-bold w-full p-4">
                <tr className="grid grid-cols-6">
                  <th className="col-span-2">
                    <button
                      onClick={() => {
                        sortEmployees();
                      }}
                      className="
                                        
                                                flex 
                                                flex-row
                                                items-center
                                                content-center
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
                                                transition"
                    >
                      Sort by Date
                      {sortDateUp ? (
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
                            d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
                          />
                        </svg>
                      ) : (
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
                            d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="col-span-3">
                    <input
                      type="text"
                      value={search}
                      placeholder={'Search'}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      className="
                                            
                                            w-full
                                            rounded-[25px]
                                            border-2
                                            border-[#fdc92f]
                                            py-3
                                            px-5
                                            bg-white
                                            text-base
                                             text-body-color
                                             text-black
                                            placeholder-[#ACB6BE]
                                            outline-none
                                            focus-visible:shadow-none
                                            focus:border-primary
                                            "
                      onKeyDown={handleKeyDown}
                    />
                  </th>
                </tr>
                <tr className="grid grid-cols-6 bg-[#00947a] py-3">
                  {labels.map((v: any) => (
                    <th key={v.label} className="text-left">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tempEmployees.map((value, index) => {
                  return (
                    <tr
                      key={index}
                      className={
                        'odd:bg-white even:bg-slate-50  hover:cursor-pointer grid grid-cols-6'
                      }
                    >
                      <td className="text-left">{value.dateString}</td>
                      <td className="text-left">{value.position}</td>
                      <td className="text-left">{`${value.name} ${value.surname}`}</td>
                      <td className="text-left">{value.phone}</td>
                      <td className="text-left">{value.email}</td>

                      <td className=" whitespace-nowrap text-right">
                        <Menu>
                          {({ open }) => (
                            <>
                              <span className="rounded-md shadow-sm">
                                <Menu.Button className="inline-flex justify-center text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 "
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                    />
                                  </svg>
                                </Menu.Button>
                              </span>

                              <Transition
                                show={open}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items
                                  static
                                  className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                                >
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            if (
                                              typeof value.id !== 'undefined'
                                            ) {
                                              setOpenDialog(true);
                                              setEditMember(value);
                                              setView(0);
                                            }
                                          }}
                                          className={`${active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                        >
                                          View
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            if (
                                              typeof value.id !== 'undefined'
                                            ) {
                                              setOpenDialog(true);
                                              setEditMember(value);
                                              setView(1);
                                            }
                                          }}
                                          className={`${active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            if (
                                              typeof value.id !== 'undefined'
                                            ) {
                                              setOpenDialog(true);
                                              setEditMember(value);
                                              setView(2);
                                            }
                                          }}
                                          className={`${active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                        >
                                          Move Stage
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            if (typeof value.id !== 'undefined')
                                              setOpenDialog(true);
                                            setEditMember(value);
                                            setView(3);
                                          }}
                                          className={`${active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                        >
                                          Add Notes
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            if (typeof value.id !== 'undefined')
                                              setOpenDialog(true);
                                            setEditMember(value);
                                            setView(4);
                                          }}
                                          className={`${active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700'
                                            } flex justify-between font-bold w-full px-4 py-2 text-sm leading-5 text-left border-sky-600`}
                                        >
                                          Add Task
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </>
                          )}
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Transition appear show={openDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenDialog(false)}
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
              <div className="bg-slate-100 my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                {getView()}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default HRProfile;
