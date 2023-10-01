import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { Dialog, Transition } from '@headlessui/react';
import ReactPaginate from 'react-paginate';
import { IUser } from '../../types/userTypes';
import { addDocument, getDataFromDBOne, updateDocument } from '../../api/mainApi';
import { AMDIN_FIELD, LIGHT_GRAY } from '../../constants/constants';
import { USER_COLLECTION } from '../../constants/userConstants';
import { searchStringInArray } from '../../utils/arrayM';
import AppAccess from '../accessLevel';
import ClientNav from '../clientNav';
import Loader from '../loader';
import { IShift } from '../../types/staffTypes';
import DateMethods from '../../utils/date';
import { print } from '../../utils/console';
import { SHIFT_COLLECTION } from '../../constants/staffConstants';
import { useAuthIds } from '../authHook';



const AddSchedule = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { adminId, userId, access } = useAuthIds();
    const [categories, setCategories] = useState<IUser[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [usersTemp, setUsersTemp] = useState<IUser[]>([]);
    const [edit, setEdit] = useState(false);
    const [editItem, setEditItem] = useState<any>({
        category: "",
        title: "",
        description: "",
        price: 0
    });
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<IUser>({
        id: "id",
        userId: "",
        adminId: "adminId",
        access: [],
        contact: "",
        name: "",
        email: "",
        date: new Date(),
        dateString: new Date().toDateString(),
        dateOfUpdate: new Date()
    });
    const [labels, setLabels] = useState<string[]>(['ADDED DATE', 'NAME', 'CONTACT', 'EMAIL', 'ACCESS LEVEL']);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [search, setSearch] = useState("");
    const [selectedAccessArray, setselectedAccessArray] = useState<any[]>([])
    const [shift, setShift] = useState<IShift>({
        id: "",
        adminId: "",
        user: "",
        userId: "",
        date: new Date(),
        dateString: new Date().toDateString(),
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
        dateOfUpdate: new Date(),
        startTime: "",
        endTime: "",
        role: "",
        confirmed: false
    });

    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;



        getUsers();
    }, []);


    const getUsers = () => {

        getDataFromDBOne(USER_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    setUsers(users => [...users, {
                        id: element.id,
                        userId: d.id,
                        adminId: d.adminId,
                        contact: d.contact,
                        name: d.name,
                        email: d.email,
                        access: d.access,
                        date: new Date(),
                        dateString: new Date().toDateString(),
                        dateOfUpdate: new Date()
                    }]);
                    setUsersTemp(users => [...users, {
                        id: element.id,
                        userId: d.id,
                        adminId: d.adminId,
                        contact: d.contact,
                        name: d.name,
                        email: d.email,
                        access: d.access,
                        date: new Date(),
                        dateString: new Date().toDateString(),
                        dateOfUpdate: new Date()
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }

    const addShift = async () => {


        if (DateMethods.diffDatesDays(new Date().toDateString(), new Date(shift.startDate).toDateString()) > 0
            && DateMethods.diffDatesDays(new Date().toDateString(), new Date(shift.endDate).toDateString()) > 0) {
            let addedShift = { ...shift, user: user, adminId: adminId, userId: userId };
            setOpen(false);
            setLoading(true);
            addDocument(SHIFT_COLLECTION, addedShift).then((v) => {
                setLoading(false);
                toast.success('Shift Added');
            }).catch((e: any) => {
                setLoading(false);
                console.error(e);
                toast.error('There was an error please try again');
            });
        } else {
            toast.error('Chosen dates have to be later than today');
        }


    }

    const getReadyToUpdate = (v: IUser) => {
        setOpen(true);
        setUser(v);
        setEdit(true);

    }


    const editUser = async () => {


        let newItem = { ...user, dateOfUpdate: new Date().toDateString() }

        setOpen(false);
        setLoading(true);
        setUsersTemp([]);
        updateDocument(USER_COLLECTION, user.id, newItem).then((v) => {
            getUsers();
            setOpen(false);
        }).catch((e: any) => {

            getUsers();
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
        setShift({
            ...shift,
            [e.target.name]: e.target.value
        })
    }

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            searchFor();
        }
    };

    const searchFor = () => {
        setUsersTemp([]);

        setLoading(true);
        if (search !== '') {

            let res: IUser[] = searchStringInArray(users, search);

            if (res.length > 0) {
                setTimeout(() => {
                    setUsersTemp(res);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setUsersTemp(users);
                    setLoading(false);
                }, 1500);


            }


        } else {

            setTimeout(() => {
                setUsersTemp(users);
                setLoading(false);
            }, 1500);

        }
    }


    const editArray = (v: string) => {

        if (user.access.includes(v)) {
            let newArray: any[] = [];
            user.access.forEach((el) => {
                if (el !== v) {
                    newArray.push(el);
                }
            });

            setUser({ ...user, access: newArray });
        } else {
            let newArray: any[] = user.access;
            newArray.push(v);
            setUser({ ...user, access: newArray });
        }

    }



    return (
        <AppAccess access={access} component={'staff-scheduling'}>
            <div>
                <div className="w-full m-2 px-2 py-8 sm:px-0 col-span-9">
                    <div>
                        <div className="bg-white rounded-[30px] p-4">
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
                                                usersTemp.slice(start, end).map((value, index) => {
                                                    return (
                                                        <tr key={index}
                                                            onClick={() => { getReadyToUpdate(value) }}
                                                            className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                            <td className='text-left' >{value.dateString}</td>
                                                            <td className='text-left' >{value.name}</td>
                                                            <td className='text-left' >{value.contact}</td>
                                                            <td className='text-left col-span-3' >{value.email}</td>
                                                            <td className='text-left col-span-3' >{value.access.slice(0, 4).toString()}...</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <div>
                                        {usersTemp.length > 0 ? <div className='flex w-full'>
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
                                                className="text-sm font-medium leading-6 text-gray-900 m-4 text-center"
                                            >

                                                Add Schedule
                                            </Dialog.Title>
                                            <div className="flex flex-col items-center space-y-2 w-full">

                                                <div className="w-full">
                                                    <p className='px-4 text-xs text-gray-400 text-center'>Shift Start Date</p>
                                                    <input
                                                        type="date"
                                                        // value={shift.date}
                                                        placeholder={'Shift date'}
                                                        onChange={handleChange}
                                                        name="startDate"
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
                                                <div className="w-full">
                                                    <p className='px-4 text-xs text-gray-400 text-center'>Shift End Date</p>
                                                    <input
                                                        type="date"
                                                        // value={shift.date}
                                                        placeholder={'Shift date'}
                                                        onChange={handleChange}
                                                        name="endDate"
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
                                                    <p className='px-4 text-xs text-gray-400 text-center'>Start Shift Time</p>
                                                    <input
                                                        name="startTime"
                                                        type="time"
                                                        // value={user.contact}
                                                        placeholder={'Start Time'}
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
                                                    <p className='px-4 text-xs text-gray-400 text-center'>End Shift Time</p>
                                                    <input
                                                        type="time"
                                                        name="endTime"
                                                        // value={shift.endTime}
                                                        placeholder={'End Time'}
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
                                                <div className="mb-6 w-full">
                                                    <p className='px-4 text-xs text-gray-400 text-center'>Person Role</p>
                                                    <input
                                                        type="text"
                                                        name="role"
                                                        value={shift.role}
                                                        placeholder={'Role'}
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
                                                        addShift();
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
                                                    Add Shift
                                                </button>
                                            </div>


                                        </div>
                                    </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition>

                        <ToastContainer position="top-right" autoClose={5000} />
                    </div>


                </div>
            </div>
        </AppAccess>


    );
};

export default AddSchedule;

