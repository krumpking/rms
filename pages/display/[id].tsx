import React, { Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, URL_LOCK_ID } from '../../app/constants/constants';
import Payment from '../../app/utils/paymentUtil';
import ClientNav from '../../app/components/clientNav';
import ReactTable from "react-table";
import { IData, IDynamicObject } from '../../app/types/types';
import { forEach } from 'lodash';
import { decrypt, simpleDecrypt } from '../../app/utils/crypto';
import Loader from '../../app/components/loader';
import { getDate, getMonth, isBase64 } from '../../app/utils/stringM';
import { downloadExcel } from '../../app/utils/excel';
import { Dialog, Transition } from '@headlessui/react';
import ReturnElements from '../../app/components/returnElements';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlignmentType, Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import fs from 'fs';
import { saveAs } from 'file-saver';
import { getUrl } from '../../app/utils/getImageUrl';
import { HexColorPicker } from "react-colorful";
import { getSpecificData } from '../../app/api/formApi';
import { getCookie } from 'react-use-cookie';
import { print } from '../../app/utils/console';
import * as XLSX from 'xlsx';


const DataDisplay = () => {
    const router = useRouter();
    const [data, setData] = useState<IData>();
    const [loading, setLoading] = useState(true);
    const [imageBase64, setImageBase64] = useState("");
    const [excelData, setExcelData] = useState<any>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [columnLayout, setColumnLayout] = useState(true);
    const [rowInfo, setRowInfo] = useState<any[]>([]);
    const ref = React.createRef();
    const [changedLayout, setChangedLayout] = useState(true);
    const [mainData, setMainData] = useState<any>();





    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        checkPayment();

        if (router.isReady) {
            const { id } = router.query;

            if (typeof id == 'string') {


                if (id.length > 0) {
                    var infoId = decrypt(id, URL_LOCK_ID);

                    getSpecificData(infoId).then((v) => {

                        if (v != null) {
                            var element = v.data;


                            setData({
                                id: element.id,
                                title: element.data().title,
                                descr: element.data().descr,
                                date: element.data().date,
                                editorId: element.data().editorId,
                                encryption: element.data().encryption,
                                info: element.data().info,
                                infoId: element.data().infoId
                            });

                            setLoading(false);

                        }





                    }).catch((e: any) => {
                        setLoading(false);
                        console.error(e);
                    });
                } else {
                    toast.warn('Form Data not found');
                    router.push({
                        pathname: '/login',
                    });
                }

            }
        }


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
                if (roleTitle == "Editor") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }





    }, [router.isReady]);

    const checkPayment = async () => {
        const paymentStatus = await Payment.checkPaymentStatus();
        if (!paymentStatus) {
            toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

            setTimeout(() => {
                router.push({
                    pathname: '/payments',
                });
            }, 5000);

        }
    }



    const downloadPdf = () => {
        const input = document.getElementById('divToPrint');
        if (input !== null) {
            html2canvas(input, { useCORS: true })
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    const imgProperties = pdf.getImageProperties(canvas);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight =
                        (imgProperties.height * pdfWidth) / imgProperties.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    // pdf.output('dataurlnewwindow');
                    pdf.save(`${data?.title}.pdf`);
                })
        }

    }


    const downloadWordDoc = async () => {
        const dataFromRow: Paragraph[] = [];


        // if (columnLayout) {

        rowInfo.forEach(async (element) => {


            if (element.element == 11) {

                if (typeof data !== 'undefined') {
                    var imageBuffer = await getUrl(`/${data.infoId}/11/${simpleDecrypt(element.info, data.infoId + data.infoId + data.infoId)}`);
                    if (imageBuffer !== null) {
                        dataFromRow.push(new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation: {
                                        width: 903,
                                        height: 1149,
                                    },
                                }),
                            ]
                        }));
                    }

                }

            } else if (element.element == 17) {
                dataFromRow.push(new Paragraph({
                    children: [
                        new TextRun('Signature')
                    ]
                }));
            } else {
                if (typeof data !== 'undefined') {

                    dataFromRow.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${element.label}:  `, bold: true, break: 1, },),
                            new TextRun({ text: `${simpleDecrypt(element.info, `${data.infoId + data.infoId + data.infoId}`)}`, break: 1, })
                        ]
                    }));
                }
            }


        });
        // } else {
        //     for (let index = 0; index < rowInfo.length; index++) {
        //         const element = rowInfo[index];


        //         if (index % 2 == 0) {
        //             if (element.element == 11) {

        //                 if (typeof data !== 'undefined') {


        //                     var imageBuffer = await getUrl(`/${data.infoId}/11/${simpleDecrypt(element.info, data.infoId + data.infoId + data.infoId)}`);
        //                     if (imageBuffer !== null) {
        //                         dataFromRow.push(new Paragraph({
        //                             children: [
        //                                 new ImageRun({
        //                                     data: imageBuffer,
        //                                     transformation: {
        //                                         width: 903,
        //                                         height: 1149,
        //                                     },
        //                                 }),
        //                             ]
        //                         }));
        //                     }

        //                 }

        //             } else if (element.element == 17) {
        //                 dataFromRow.push(new Paragraph({
        //                     children: [


        //                         new TextRun('Signature')


        //                     ]
        //                 }));
        //             } else {
        //                 if (typeof data !== 'undefined') {

        //                     dataFromRow.push(new Paragraph({
        //                         children: [
        //                             new TextRun({ text: `${element.label}`, bold: true }),

        //                             new TextRun({ text: `${typeof rowInfo[index + 1] === 'undefined' ? '' : rowInfo[index + 1].label}`, bold: true })


        //                         ],
        //                         alignment: AlignmentType.CENTER,
        //                     }));
        //                     dataFromRow.push(new Paragraph({
        //                         children: [
        //                             new TextRun({ text: `${simpleDecrypt(element.info, `${data.infoId + data.infoId + data.infoId}`)}` }),

        //                             new TextRun({ text: typeof rowInfo[index + 1] === 'undefined' ? '' : simpleDecrypt(rowInfo[index + 1].info, `${data.infoId + data.infoId + data.infoId}`) })
        //                         ],
        //                         alignment: AlignmentType.CENTER,
        //                         spacing: {
        //                             after: 100,
        //                         },
        //                     }));
        //                 }
        //             }

        //         }







        //     }
        // }



        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: dataFromRow,
                }
            ]

        });



        Packer.toBlob(doc).then((buffer) => {

            saveAs(buffer, `${data?.title}.docx`);
            // fs.writeFileSync(`${data?.title}.docx`, buffer);

        });


    }

    const downloadExcelWithFormat = async () => {
        if (columnLayout) {
            var exlD: any[] = [];
            data?.info.forEach(element => {
                const object: IDynamicObject = {};
                element.data.forEach((el: any) => {
                    var resInfo = simpleDecrypt(el.info, data.infoId + data.infoId + data.infoId);
                    object[el.label] = resInfo;
                });
                exlD.push(object);


            });
            downloadExcel(exlD, `${data?.title}`);
        } else {


            var table_elt = document.getElementById("divToPrint");

            var workbook = XLSX.utils.table_to_book(table_elt);

            // Process Data (add a new row)
            var ws = workbook.Sheets["Sheet1"];
            XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toISOString()]], { origin: -1 });

            // Package and Release Data (`writeFile` tries to write and save an XLSB file)
            XLSX.writeFile(workbook, `${data?.title}.xlsx`);



        }
    }






    return (
        <div>
            <div className='flex flex-col lg:grid lg:grid-cols-12'>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'data'} />
                </div>



                <div className='bg-white lg:col-span-9 m-8 rounded-[30px]'>

                    {loading ?
                        <div className='flex flex-col justify-center items-center w-full col-span-8'>
                            <Loader />
                        </div> :
                        <div className='p-4 lg:p-8 2xl:p-16 rounded-md flex flex-col'>
                            <div className="overflow-x-auto whitespace-nowrap">
                                <table className="table-auto border-separate border-spacing-1 ">
                                    <thead className='bg-[#00947a] text-white font-bold w-full '>
                                        <tr>
                                            {data?.info[0].data.map((v: any) => (
                                                <th key={v.label} className='text-left'>{v.label}</th>
                                            ))}
                                        </tr>


                                    </thead>
                                    <tbody>

                                        {
                                            data?.info.map((value, index) => {
                                                return (
                                                    <tr key={index}
                                                        className={'odd:bg-white even:bg-slate-50 hover:bg-[#0ead96] hover:text-white hover:cursor-pointer'}
                                                        onClick={() => { setIsOpen(true); setRowInfo(data.info[index].data) }}>
                                                        {data?.info[index].data.map((v: any) => {
                                                            var resInfo = simpleDecrypt(v.info, data.infoId + data.infoId + data.infoId);


                                                            if (v.element == 17) {
                                                                return (
                                                                    <td className='text-left' key={v.info}>Signature</td>
                                                                )

                                                            } else if (v.element == 8) {
                                                                var totalString = simpleDecrypt(v.info, data.infoId + data.infoId + data.infoId);
                                                                var firstString = totalString.substring(0, totalString.indexOf(" - "));
                                                                var secString = totalString.substring(totalString.indexOf(" - ") + 2, totalString.length);
                                                                return (
                                                                    <td key={v.info}>{getDate(firstString)} - {getDate(secString)} </td>
                                                                )

                                                            } else if (v.element == 9) {

                                                                return (
                                                                    <td key={v.info}>{getMonth(simpleDecrypt(v.info, data.infoId + data.infoId + data.infoId))}</td>
                                                                )
                                                            } else if (v.element == 10) {

                                                                return (
                                                                    <td key={v.info}>{getDate(simpleDecrypt(v.info, data.infoId + data.infoId + data.infoId))}</td>
                                                                )

                                                            } else if (v.element == 16) {
                                                                return (
                                                                    <td key={v.info}>
                                                                        <p>Location</p>
                                                                    </td>
                                                                )
                                                            } else {
                                                                return (
                                                                    <td className='text-left' key={v.info}>{resInfo}</td>
                                                                )
                                                            }




                                                        })

                                                        }

                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setLoading(true);

                                        var exlD: any[] = [];
                                        data?.info.forEach(element => {
                                            const object: IDynamicObject = {};
                                            element.data.forEach((el: any) => {
                                                var resInfo = simpleDecrypt(el.info, data.infoId + data.infoId + data.infoId);
                                                object[el.label] = resInfo;
                                            });
                                            exlD.push(object);


                                        });
                                        setMainData(exlD);

                                        downloadExcel(exlD, typeof data?.title === 'undefined' ? 'info' : data?.title);
                                        setLoading(false);
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
                                >Download Table as Excel File</button>
                            </div>

                        </div>}
                </div>
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog

                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={() => setIsOpen(false)}
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
                                <div className="bg-white my-8 inline-block w-full max-w-48  transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                                    <Dialog.Title
                                        as="h3"
                                        className="text-sm font-medium leading-6 text-gray-900 m-4 grid grid-cols-4 items-center justify-items-center max-w-96"
                                    >

                                        <button className='flex flex-col items-center' onClick={() => {

                                            setColumnLayout(true);

                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 rotate-90 flex flex-col justify-center">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>
                                            View as Column
                                        </button>
                                        <button className='flex flex-col items-center' onClick={() => {

                                            setColumnLayout(false);



                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 ">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                            </svg>
                                            View as Grid
                                        </button>
                                        <button className='flex flex-col items-center' onClick={() => { downloadWordDoc() }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Download as Word Document
                                        </button>
                                        {/* <button className='flex flex-col items-center' onClick={() => { downloadExcelWithFormat() }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Download as Excell Document
                                        </button> */}

                                        <button className='flex flex-col items-center' onClick={() => { downloadPdf() }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Download as PDF Document
                                        </button>


                                    </Dialog.Title>

                                    <div className={columnLayout ? 'flex flex-col' : 'grid grid-cols-2'} id='divToPrint' onClick={() => { setIsOpen(false) }}>
                                        {rowInfo.map((v: any) => {

                                            return (
                                                <div key={v} className='flex flex-col my-4'>
                                                    <h1 className='text-bold text-2xl'>{v.label}</h1>
                                                    {typeof data !== 'undefined' ? <ReturnElements num={v.element} info={v.info} code={`${data.infoId + data.infoId + data.infoId}`} codeId={data.infoId} /> : ''}
                                                </div>
                                            )
                                        })}

                                    </div>


                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>



            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default DataDisplay
