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
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, getDataFromDBTwo, updateDocument, uploadFile } from '../../api/mainApi';
import { MENU_CAT_COLLECTION, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../constants/menuConstants';
import { print } from '../../utils/console';
import { Dialog, Transition } from '@headlessui/react';
import { IStockCategory, IStockItem } from '../../types/stockTypes';
import { STOCK_CATEGORY_REF, STOCK_ITEM_COLLECTION } from '../../constants/stockConstants';
import { returnOccurrencesIndex, searchStringInArray } from '../../utils/arrayM';
import ReactPaginate from 'react-paginate';
import AppAccess from '../accessLevel';
import { ILog, IShift } from '../../types/staffTypes';
import { SHIFT_COLLECTION } from '../../constants/staffConstants';
import DateMethods from '../../utils/date';
import { differenceInHours } from 'date-fns';




const Logs = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [adminId, setAdminId] = useState('');
    const [webfrontId, setWebfrontId] = useState("");
    const [logs, setLogs] = useState<ILog[]>([]);
    const [logsTemp, setLogsTemp] = useState<ILog[]>([]);
    const [open, setOpen] = useState(false);
    const [labels, setLabels] = useState<string[]>(['STAFF MEMBER', 'MONTH', 'TOTAL HOURS']);
    const [selectedTrans, setSelectedTrans] = useState<IShift[]>([]);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [search, setSearch] = useState("");
    const [accessArray, setAccessArray] = useState<any[]>([
        'menu', 'orders', 'move-from-pantry', 'move-from-kitchen', 'cash-in',
        'cash-out', 'cash-report', 'add-stock', 'confirm-stock', 'move-to-served', 'add-reservation', 'available-reservations',
        'staff-scheduling', 'approve-schedule', 'website', 'payments', 'staff-logs']);


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


        getShifts();
    }, []);

    const getShifts = () => {
        print('Here it is');
        print(logs.length);
        getDataFromDBTwo(SHIFT_COLLECTION, AMDIN_FIELD, adminId, 'confirmed', true).then((v) => {

            if (v !== null) {

                let logsTempVar: ILog[] = [];
                if (logs.length > 0) {
                    logsTempVar = logs;
                }

                v.data.forEach(element => {
                    let d = element.data();
                    let index = returnOccurrencesIndex(logsTempVar, d.user.id);
                    if (index > -1) {
                        let startDate = new Date(d.startDate + ' ' + d.startTime);
                        let endDate = new Date(d.endDate + ' ' + d.endTime);
                        let hours = parseInt(d.endTime.split(':')[0]) - parseInt(d.startTime.split(':')[0]);
                        let minutes = (parseInt(d.endTime.split(':')[1]) + parseInt(d.startTime.split(':')[1]));
                        if (minutes == 60) {
                            minutes /= 60;
                        } else {
                            minutes /= 100;
                        }
                        hours += minutes;
                        hours += logsTempVar[index].hours;
                        let month = DateMethods.showMonth(startDate.getMonth());
                        logsTempVar[index] = {
                            id: d.user.id,
                            userId: d.userId,
                            adminId: d.adminId,
                            user: d.user,
                            date: new Date(),
                            dateString: new Date().toDateString(),
                            month: month,
                            hours: hours
                        }

                    } else {

                        let startDate = new Date(d.startDate + ' ' + d.startTime);
                        let hours = parseInt(d.endTime.split(':')[0]) - parseInt(d.startTime.split(':')[0]);
                        let minutes = (parseInt(d.endTime.split(':')[1]) + parseInt(d.startTime.split(':')[1]));
                        if (minutes == 60) {
                            minutes /= 60;
                        } else {
                            minutes /= 100;
                        }
                        hours += minutes;
                        let month = DateMethods.showMonth(startDate.getMonth());
                        logsTempVar.push({
                            id: d.user.id,
                            userId: d.userId,
                            adminId: d.adminId,
                            user: d.user,
                            date: new Date(),
                            dateString: new Date().toDateString(),
                            month: month,
                            hours: hours
                        });
                    }

                });
                setLogs(logsTempVar);
                setLogsTemp(logsTempVar);

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
        setLogsTemp([]);

        setLoading(true);
        if (search !== '') {

            let res: ILog[] = searchStringInArray(logs, search);

            if (res.length > 0) {
                setTimeout(() => {
                    setLogsTemp(res);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setLogsTemp(logs);
                    setLoading(false);
                }, 1500);


            }


        } else {

            setTimeout(() => {
                setLogsTemp(logs);
                setLoading(false);
            }, 1500);

        }
    }





    return (
        <AppAccess access={accessArray} component={'approve-schedule'}>

            <div className="bg-white rounded-[30px] p-4  ">
                <div>
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
                                        logsTemp.slice(start, end).map((value, index) => {
                                            return (
                                                <tr key={index}
                                                    className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer hover:bg-[#8b0e06] hover:text-white'}>
                                                    <td className='text-left' >{value.user.name}</td>
                                                    <td className='text-left' >{value.month}</td>
                                                    <td className='text-left' >{value.hours}</td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>

                            </table>
                            <div>
                                {logsTemp.length > 0 ? <div className='flex w-full'>
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
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </AppAccess>

    );
};

export default Logs;
