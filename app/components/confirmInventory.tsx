import React, { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { LIGHT_GRAY, URL_LOCK_ID } from '../constants/constants';
import Payment from '../utils/paymentUtil';
import ClientNav from './clientNav';
import ReactTable from 'react-table';

import { IData, IDynamicObject } from '../types/types';
import { forEach } from 'lodash';
import { decrypt, simpleDecrypt } from '../utils/crypto';
import Loader from './loader';
import { getDate, getMonth, isBase64 } from '../utils/stringM';
import { downloadExcel } from '../utils/excel';
import { Dialog, Transition } from '@headlessui/react';
import ReturnElements from './returnElements';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, ImageRun, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs';
import { saveAs } from 'file-saver';
import { getUrl } from '../utils/getImageUrl';
import { HexColorPicker } from 'react-colorful';
import { getSpecificData } from '../api/formApi';
import { print } from '../utils/console';
import { IConfirm } from '../types/confirmTypes';
import { doc, updateDoc } from 'firebase/firestore';
import Inventory from '../../pages/inventory';
import AddInventory from './addInventory';
import { UpdateInventory } from '../api/inventoryApi';

// var object = {};
// var array = [];
// var arrayOfObjects = [{},{},{}]

const ConfirmInventory = () => {
  const router = useRouter();
  const [label, setLabel] = useState<any[]>([
    'date',
    'category',
    'name',
    'price',
    'number',
  ]);
  const [data, setData] = useState<any[]>([
    {
      date: '26 June 2023',
      category: 'Nike',
      name: 'Ball',
      price: '500',
      number: '600',
    },
    {
      date: '26 June 2023',
      category: 'Nike',
      name: 'Ball',
      price: '500',
      number: '600',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState('');
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
                        <td>{value.date}</td>
                        <td>{value.category}</td>
                        <td>{value.name}</td>
                        <td>{value.price}</td>
                        <td>{value.number}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <button
                onClick={() => {
                  AddInventory();
                  setLoading(true);
                }}
                className="
                                font-bold
                                        w-ful
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
                Update
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ConfirmInventory;
