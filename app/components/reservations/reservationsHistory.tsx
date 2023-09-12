import { useRouter } from 'next/router';
import { LIGHT_GRAY, URL_LOCK_ID } from '../../constants/constants';
import ClientNav from '../clientNav';
import ReactTable from 'react-table';
import Loader from '../loader';
import { Dialog, Transition } from '@headlessui/react';
import ReturnElements from '../returnElements';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, ImageRun, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs';
import { saveAs } from 'file-saver';
import { getUrl } from '../../utils/getImageUrl';
import { HexColorPicker } from 'react-colorful';
import { getSpecificData } from '../../api/formApi';
import { print } from '../../utils/console';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import React from 'react';

const ReservationsHistory = () => {
  const router = useRouter();
  const [label, setLabel] = useState<any[]>([
    'Name',
    'Phone Number',
    'Date',
    'Time',
    'Number of People',
  ]);
  const [data, setData] = useState<any[]>([
    {
      name: 'John Banda',
      phoneNumber: '0782231251',
      date: '1 August 2023',
      time: '21:15',
      people: '20',
    },
    {
      name: 'Ale Ma',
      phoneNumber: '07822555',
      date: '2 August 2023',
      time: '21:30',
      people: '30',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [excelData, setExcelData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [columnLayout, setColumnLayout] = useState(true);
  const [rowInfo, setRowInfo] = useState<any[]>([]);
  const ref = React.createRef();
  const [changedLayout, setChangedLayout] = useState(true);

  return (
    <div>
      <div className="flex flex-col">
        {loading ? (
          <div className="flex flex-col justify-center items-center w-full col-span-8">
            <Loader />
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
                  {data.map((value: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className={
                          'odd:bg-white even:bg-slate-50 hover:bg-[#8b0e06] hover:text-white hover:cursor-pointer'
                        }
                      >
                        <td>{value.name}</td>
                        <td>{value.phoneNumber}</td>
                        <td>{value.date}</td>
                        <td>{value.time}</td>
                        <td>{value.people}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ReservationsHistory;
