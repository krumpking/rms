import React, { FC, Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY, PERSON_ROLE, URL_LOCK_ID } from '../constants/constants';
import Payment from '../utils/paymentUtil';
import { decrypt } from '../utils/crypto';
import Loader from './loader';
import { numberWithCommas, searchStringInMembers } from '../utils/stringM';
import { getAllClientsByDate, getAllClientsToDB } from '../api/crmApi';
import { getCookie } from 'react-use-cookie';
import { IClient } from '../types/userTypes';
import DateMethods from '../utils/date';
import { print } from '../utils/console';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { randomRGBAColor } from '../utils/colorM';
import { addTotalValue, findOccurrences, findOccurrencesProducts, getProductsRepMapFromArray, getSalesRepMapFromArray, highest, highestProduct } from '../utils/arrayM';
import ReportHighlight from './reportHighlights';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { sub } from 'date-fns';


export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};



ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend);
ChartJS.register(ChartDataLabels);

interface MyProps {
    tab: number
}

const CRMReportTemplate: FC<MyProps> = ({ tab }) => {
    const router = useRouter();
    const [clients, setClients] = useState<IClient[]>([]);
    const [tempClients, setTempClients] = useState<IClient[]>([]);
    const [totalQuotations, setTotalQuotations] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [labels, setLabels] = useState(['Created', 'Name', 'Stage', 'Products', 'Value']);
    const [sortDateUp, setSortDateUp] = useState(false);
    const [search, setSearch] = useState("");
    const [totalValue, setTotalValue] = useState(0);
    const [products, setProducts] = useState<any>(data);
    const [productsByValue, setProductsByValue] = useState<any>(data);
    const [sales, setSales] = useState<any>(data);
    const [stage, setStage] = useState<any>(data);
    const [totalFinished, setTotalFinished] = useState<any[]>([]);
    const [salesPeople, setSetsalesPeople] = useState<any[]>([]);
    const [productsCount, setProductsCount] = useState<any[]>([]);
    const [salesRepLabel, setSalesRepLabels] = useState<any[]>([]);
    const [uniqueProducts, setUniqueProducts] = useState<any[]>([]);
    const [uniqeSalesReps, setUniqeSalesReps] = useState<any[]>([]);
    const [salesByProduct, setSalesByProduct] = useState<any[]>([]);


    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        checkPayment();
        setClients([]);
        setTempClients([]);
        getClientsFromDB();

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

    const getClientsFromDB = () => {
        setLoading(true);

        if (tab == 5) {

            getAllClientsToDB().then((v) => {

                var infoFromCookie = "";
                if (getCookie(ADMIN_ID) == "") {
                    infoFromCookie = getCookie(COOKIE_ID);
                } else {
                    infoFromCookie = getCookie(ADMIN_ID);
                }
                var id = decrypt(infoFromCookie, COOKIE_ID)
                if (v !== null) {
                    var clnts: any[] = [];
                    let totVal = 0;
                    let prods: any = [];
                    let sls: any = [];
                    let stag: any = [];
                    let finished: any = [];
                    v.data.forEach(element => {

                        var notesA: any = [];
                        element.data().notes.forEach((el: string) => {
                            notesA.push(decrypt(el, id));
                        });


                        var prodA: any = [];
                        element.data().enquired.forEach((el: any) => {
                            prodA.push({
                                product: decrypt(el.product, id),
                                totalNumber: decrypt(el.totalNumber, id),
                                value: decrypt(el.value, id)
                            });
                        });

                        let value = decrypt(element.data().value, id);



                        if (!isNaN(parseFloat(value.replace('$', '').replace(',', '')))) {
                            totVal += parseFloat(value.replace('$', '').replace(',', ''));
                        }



                        var client = {
                            docId: element.id,
                            id: element.data().id,
                            adminId: element.data().adminId,
                            date: element.data().dateString,
                            name: decrypt(element.data().name, id),
                            contact: decrypt(element.data().contact, id),
                            organisation: decrypt(element.data().organisation, id),
                            stage: decrypt(element.data().stage, id),
                            notes: notesA,
                            refSource: decrypt(element.data().refSource, id),
                            enquired: prodA,
                            value: value,
                            salesPerson: decrypt(element.data().salesPerson, id),
                        }
                        prods = prods.concat(prodA);
                        sls.push(decrypt(element.data().salesPerson, id));
                        clnts.push(client);
                        stag.push(decrypt(element.data().stage, id));
                        if (decrypt(element.data().stage, id) === "Project Started"
                            || decrypt(element.data().stage, id) == "Project In Progress"
                            || decrypt(element.data().stage, id) == "Project Finished"
                            || decrypt(element.data().stage, id) == "Receipt Sent") {
                            finished.push(clnts);
                        }


                    });
                    setSetsalesPeople(sls);

                    setProductsCount(prods);
                    setClients(clnts);
                    setTotalFinished(finished);
                    setTempClients(clnts);
                    setTotalValue(totVal);
                    let salesRep = getSalesRepMapFromArray(clnts);
                    setSalesRepLabels(salesRep);
                    let salesByP = getProductsRepMapFromArray(clnts);
                    setSalesByProduct(salesByP);
                    const uniqueProductsCal = salesByP.map((value: any) => value.product);
                    setUniqueProducts(uniqueProductsCal);

                    let p = {
                        labels: uniqueProductsCal,
                        datasets: [
                            {
                                label: '# of Quotations/Invoice/Receipts',
                                data: uniqueProductsCal.map((v: any) => findOccurrencesProducts(prods, v)),
                                backgroundColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }

                    setProducts(p);
                    let pT = {
                        labels: uniqueProductsCal,
                        datasets: [
                            {
                                label: 'Products by value',
                                data: uniqueProductsCal.map((v: any) => addTotalValue(prods, v)),
                                backgroundColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }
                    setProductsByValue(pT)
                    const uniqueSales = sls.reduce((accumulator: any[], string: any) => {
                        if (!accumulator.includes(string)) {
                            accumulator.push(string);
                        }
                        return accumulator;
                    }, []);
                    setUniqeSalesReps(uniqueSales);
                    let s = {
                        labels: uniqueSales,
                        datasets: [
                            {
                                label: '# of Quotations',
                                data: uniqueSales.map((v: any) => findOccurrences(sls, v)),
                                backgroundColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }

                    setSales(s);
                    const uniqueStage = stag.reduce((accumulator: any[], string: any) => {
                        if (!accumulator.includes(string)) {
                            accumulator.push(string);
                        }
                        return accumulator;
                    }, []);


                    let st = {
                        labels: uniqueStage,
                        datasets: [
                            {
                                label: '# of Quotations',
                                data: uniqueStage.map((v: any) => findOccurrences(stag, v)),
                                backgroundColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderColor: uniqueStage.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }
                    setStage(st);


                }

                setLoading(false);
            }).catch((e) => {
                console.error(e);
                setLoading(false);
            });

        } else {
            let first = new Date();
            let last = new Date();
            if (tab == 0) {
                first = sub(new Date(), { days: 1 });
            } else if (tab == 1) {
                first = sub(new Date(), { days: 7 });
            } else if (tab == 2) {
                first = sub(new Date(), { days: 30 });
            } else if (tab == 3) {
                first = sub(new Date(), { days: 90 });
            } else if (tab == 4) {
                first = sub(new Date(), { days: 365 });
            }

            getAllClientsByDate(first, last).then((v) => {

                var infoFromCookie = "";
                if (getCookie(ADMIN_ID) == "") {
                    infoFromCookie = getCookie(COOKIE_ID);
                } else {
                    infoFromCookie = getCookie(ADMIN_ID);
                }
                var id = decrypt(infoFromCookie, COOKIE_ID)
                if (v !== null) {
                    var clnts: any[] = [];
                    let totVal = 0;
                    let prods: any = [];
                    let sls: any = [];
                    let stag: any = [];
                    let finished: any = [];
                    v.data.forEach(element => {

                        var notesA: any = [];
                        element.data().notes.forEach((el: string) => {
                            notesA.push(decrypt(el, id));
                        });


                        var prodA: any = [];
                        element.data().enquired.forEach((el: any) => {
                            prodA.push({
                                product: decrypt(el.product, id),
                                totalNumber: decrypt(el.totalNumber, id),
                                value: decrypt(el.value, id)
                            });
                        });

                        let value = decrypt(element.data().value, id);



                        if (!isNaN(parseFloat(value.replace('$', '').replace(',', '')))) {
                            totVal += parseFloat(value.replace('$', '').replace(',', ''));
                        }



                        var client = {
                            docId: element.id,
                            id: element.data().id,
                            adminId: element.data().adminId,
                            date: element.data().dateString,
                            name: decrypt(element.data().name, id),
                            contact: decrypt(element.data().contact, id),
                            organisation: decrypt(element.data().organisation, id),
                            stage: decrypt(element.data().stage, id),
                            notes: notesA,
                            refSource: decrypt(element.data().refSource, id),
                            enquired: prodA,
                            value: value,
                            salesPerson: decrypt(element.data().salesPerson, id),
                        }
                        prods = prods.concat(prodA);
                        sls.push(decrypt(element.data().salesPerson, id));
                        clnts.push(client);
                        stag.push(decrypt(element.data().stage, id));
                        if (decrypt(element.data().stage, id) === "Project Started"
                            || decrypt(element.data().stage, id) == "Project In Progress"
                            || decrypt(element.data().stage, id) == "Project Finished"
                            || decrypt(element.data().stage, id) == "Receipt Sent") {
                            finished.push(clnts);
                        }


                    });
                    setSetsalesPeople(sls);

                    setProductsCount(prods);
                    setClients(clnts);
                    setTotalFinished(finished);
                    setTempClients(clnts);
                    setTotalValue(totVal);
                    let salesRep = getSalesRepMapFromArray(clnts);
                    setSalesRepLabels(salesRep);
                    let salesByP = getProductsRepMapFromArray(clnts);
                    setSalesByProduct(salesByP);
                    const uniqueProductsCal = salesByP.map((value: any) => value.product);
                    setUniqueProducts(uniqueProductsCal);

                    let p = {
                        labels: uniqueProductsCal,
                        datasets: [
                            {
                                label: '# of Quotations/Invoice/Receipts',
                                data: uniqueProductsCal.map((v: any) => findOccurrencesProducts(prods, v)),
                                backgroundColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }

                    setProducts(p);
                    let pT = {
                        labels: uniqueProductsCal,
                        datasets: [
                            {
                                label: 'Products by value',
                                data: uniqueProductsCal.map((v: any) => addTotalValue(prods, v)),
                                backgroundColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderColor: uniqueProductsCal.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }
                    setProductsByValue(pT)
                    const uniqueSales = sls.reduce((accumulator: any[], string: any) => {
                        if (!accumulator.includes(string)) {
                            accumulator.push(string);
                        }
                        return accumulator;
                    }, []);
                    setUniqeSalesReps(uniqueSales);
                    let s = {
                        labels: uniqueSales,
                        datasets: [
                            {
                                label: '# of Quotations',
                                data: uniqueSales.map((v: any) => findOccurrences(sls, v)),
                                backgroundColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }

                    setSales(s);
                    const uniqueStage = stag.reduce((accumulator: any[], string: any) => {
                        if (!accumulator.includes(string)) {
                            accumulator.push(string);
                        }
                        return accumulator;
                    }, []);


                    let st = {
                        labels: uniqueStage,
                        datasets: [
                            {
                                label: '# of Quotations',
                                data: uniqueStage.map((v: any) => findOccurrences(stag, v)),
                                backgroundColor: uniqueSales.map(() => (randomRGBAColor())),
                                borderColor: uniqueStage.map(() => (randomRGBAColor())),
                                borderWidth: 2,
                            },
                        ],
                    }
                    setStage(st);


                }

                setLoading(false);
            }).catch((e) => {
                console.error(e);
                setLoading(false);
            });
        }



    }

    const sortClients = () => {
        setLoading(true);
        setSortDateUp(!sortDateUp);
        setClients([]);
        var res = DateMethods.sortObjectsByDate(clients, sortDateUp);
        setTimeout(() => {
            setTempClients(res);
            setLoading(false);
        }, 2000);
    }


    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            setLoading(true);
            if (search !== '') {


                let res: IClient[] = searchStringInMembers(clients, search);
                setTimeout(() => {

                    if (res.length > 0) {
                        setTempClients(res);
                    } else {
                        toast.info(`${search} not found`);
                        setTempClients(clients);
                    }

                    setLoading(false);
                }, 1500);


            } else {

                toast.info(`${search} not found`);
                setTempClients(clients);
                setLoading(false);


            }



        }
    };


    const downloadPdf = () => {
        const dom = document.getElementById("print");
        if (dom !== null) {
            toPng(dom)
                .then((dataUrl) => {
                    const img = new Image();
                    img.crossOrigin = "annoymous";
                    img.src = dataUrl;
                    img.onload = () => {
                        // Initialize the PDF.
                        const pdf = new jsPDF("p", "mm", "a4");

                        // Define reused data
                        const imgProps = pdf.getImageProperties(img);
                        const imageType = imgProps.fileType;
                        const pdfWidth = pdf.internal.pageSize.getWidth();

                        // Calculate the number of pages.
                        const pxFullHeight = imgProps.height;
                        const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
                        const nPages = Math.ceil(pxFullHeight / pxPageHeight);

                        // Define pageHeight separately so it can be trimmed on the final page.
                        let pageHeight = pdf.internal.pageSize.getHeight();

                        // Create a one-page canvas to split up the full image.
                        const pageCanvas = document.createElement("canvas");
                        const pageCtx = pageCanvas.getContext("2d");
                        pageCanvas.width = imgProps.width;
                        pageCanvas.height = pxPageHeight;

                        for (let page = 0; page < nPages; page++) {
                            // Trim the final page to reduce file size.
                            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                                pageCanvas.height = pxFullHeight % pxPageHeight;
                                pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
                            }
                            // Display the page.
                            const w = pageCanvas.width;
                            const h = pageCanvas.height;
                            if (pageCtx !== null) {
                                pageCtx.fillStyle = "white";
                                pageCtx.fillRect(0, 0, w, h);
                                pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

                                // Add the page to the PDF.
                                if (page) pdf.addPage();


                            }

                            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
                            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);

                        }
                        // Output / Save
                        pdf.save(`report-${new Date().toDateString()}.pdf`);
                    };
                })
                .catch((error: any) => {
                    console.error("oops, something went wrong!", error);
                });
        }
    }




    return (
        <div>
            <div className='flex flex-col '>






                {loading ?
                    <div className='flex flex-col justify-center items-center w-full col-span-8'>
                        <Loader />
                    </div> :
                    <>
                        {tempClients.length > 0 ? <div className='shadow-2xl rounded-[25px] flex flex-col'>
                            <div className='grid grid-cols-1 xs:flex xs:justify-between mb-6'>
                                <h1 className='px-4 text-xl md:text-2xl lg:text-4xl'>Overview</h1>
                                <button
                                    onClick={() => { downloadPdf() }}
                                    className='                                        
                                            flex
                                            flex-row
                                            items-center
                                            content-center
                                            font-bold
                                            w-48
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
                                            transition'>
                                    Download PDF
                                </button>
                            </div>

                            <div id="print">
                                <div className='grid grid-cols-1 smXS:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    <ReportHighlight title={'Top Product'} description={`${highestProduct(productsCount).value}`} />
                                    <ReportHighlight title={'Top Sales Person'} description={`${highest(salesPeople).value}`} />
                                    <ReportHighlight title={'Total Clients'} description={`${clients.length}`} />
                                    <ReportHighlight title={'Convesion Rate'} description={`${Math.floor((totalFinished.length / clients.length) * 100)}%`} />
                                    <ReportHighlight title={'Total Value'} description={`$${numberWithCommas(totalValue.toFixed(2))}`} />
                                </div>
                                <div>
                                    <div className='col-span-2'>
                                        <button
                                            onClick={() => { sortClients() }}
                                            className='                                        
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
                                                transition'>
                                            Sort by Date
                                            {sortDateUp ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
                                                </svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" />
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                    <div className='col-span-3'>
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
                                    </div>



                                </div>
                                <div className='w-full overscroll-contain overflow-x-auto whitespace-nowrap'>
                                    <table className="table border-separate border-spacing-1  shadow-2xl rounded-[25px] w-full">
                                        <thead className=' text-white font-bold w-full  p-4'>

                                            <tr className='bg-[#00947a] py-3'>
                                                {labels.map((v: any) => (
                                                    <th key={v.label} className='text-left'>{v}</th>
                                                ))}
                                            </tr>


                                        </thead>
                                        <tbody>
                                            {
                                                tempClients.map((value, index) => {
                                                    return (
                                                        <tr key={index}
                                                            className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer'}
                                                        >
                                                            <td className='text-left' >{value.date}</td>
                                                            <td className='text-left' >{value.name}</td>
                                                            <td className='text-left' >{value.stage}</td>
                                                            <td className='text-left' >{value.enquired.map((v) => v.product + ", ")}</td>
                                                            <td className='text-left' >{value.value}</td>
                                                        </tr>
                                                    )
                                                })

                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr
                                                className={'bg-[#00947a] hover:cursor-pointer text-white'}
                                            >
                                                <td className='text-left' >{new Date().toDateString()}</td>
                                                <td className='text-left' ></td>
                                                <td className='text-left' ></td>
                                                <td className='text-left' >Total</td>
                                                <td className='text-left' >${numberWithCommas(totalValue.toFixed(2))}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <h1 className='text-center text-4xl'>Top Products Overview</h1>
                                <div>
                                    {salesByProduct.map((v, i) => {
                                        var totalValueOfSalesPerson = 0;
                                        return (
                                            <div className='w-full overscroll-contain overflow-y-auto whitespace-nowrap' key={v.product}>
                                                <h1 className='ml-8'>
                                                    {v.product} Total Quotations
                                                </h1>
                                                <table className="table-auto border-separate border-spacing-1   p-4 w-full">
                                                    <thead className=' text-white font-bold w-full p-4'>
                                                        <tr className='bg-[#00947a] py-3'>
                                                            {labels.map((v: any) => (
                                                                <th key={v.label} className='text-left'>{v}</th>
                                                            ))}
                                                        </tr>


                                                    </thead>
                                                    <tbody>
                                                        {
                                                            v.value.map((value: any, index: any) => {
                                                                totalValueOfSalesPerson += parseFloat(value.enquired[i].value.replace('$', '').replace(',', ''));

                                                                return (
                                                                    <tr key={index}
                                                                        className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer '}
                                                                    >
                                                                        <td className='text-left' >{value.date}</td>
                                                                        <td className='text-left' >{value.name}</td>
                                                                        <td className='text-left' >{value.stage}</td>
                                                                        <td className='text-left' >{value.enquired[i].product}</td>
                                                                        <td className='text-left' >{value.enquired[i].value}</td>
                                                                    </tr>
                                                                )
                                                            })

                                                        }

                                                    </tbody>
                                                    <tfoot>
                                                        <tr
                                                            className={'bg-[#00947a] hover:cursor-pointer  text-white'}
                                                        >
                                                            <td className='text-left' >{new Date().toDateString()}</td>
                                                            <td className='text-left' ></td>
                                                            <td className='text-left' ></td>
                                                            <td className='text-left' >Total</td>
                                                            <td className='text-left' >${numberWithCommas(totalValueOfSalesPerson.toFixed(2))}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )
                                    })}

                                </div>
                                <div className='h-72 w-full flex flex-col items-center mb-6'>
                                    <Bar options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top' as const,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Value from each product Bar Chart',
                                            },
                                        },
                                    }} data={productsByValue} />
                                </div>
                                <div className='h-72 w-full flex flex-col items-center mb-6'>
                                    <Bar options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top' as const,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Products Bar Chart',
                                            },
                                        },
                                    }} data={products} />
                                </div>


                                <h1 className='text-center text-4xl'>Sales Rep Overview</h1>
                                <div >
                                    {salesRepLabel.map((v) => {
                                        var totalValueOfSalesPerson = 0;
                                        return (
                                            <div className='w-full overscroll-contain overflow-x-auto whitespace-nowrap' key={v.person}>
                                                <h1 className='ml-8'>
                                                    {v.person} Total Quotations
                                                </h1>
                                                <table className="table-auto border-separate border-spacing-1 p-4 w-full">
                                                    <thead className=' text-white font-bold w-full p-4'>
                                                        <tr className='bg-[#00947a] py-3'>
                                                            {labels.map((v: any) => (
                                                                <th key={v.label} className='text-left'>{v}</th>
                                                            ))}
                                                        </tr>


                                                    </thead>
                                                    <tbody>
                                                        {
                                                            v.value.map((value: any, index: any) => {
                                                                totalValueOfSalesPerson += parseFloat(value.value.replace('$', '').replace(',', ''));

                                                                return (
                                                                    <tr key={index}
                                                                        className={'odd:bg-white even:bg-slate-50  hover:cursor-pointer'}
                                                                    >
                                                                        <td className='text-left' >{value.date}</td>
                                                                        <td className='text-left' >{value.name}</td>
                                                                        <td className='text-left' >{value.stage}</td>
                                                                        <td className='text-left' >{value.enquired[0].product}</td>
                                                                        <td className='text-left' >{value.value}</td>
                                                                    </tr>
                                                                )
                                                            })

                                                        }

                                                    </tbody>
                                                    <tfoot>
                                                        <tr
                                                            className={'bg-[#00947a] hover:cursor-pointer text-white'}
                                                        >
                                                            <td className='text-left' >{new Date().toDateString()}</td>
                                                            <td className='text-left' ></td>
                                                            <td className='text-left' ></td>
                                                            <td className='text-left' >Total</td>
                                                            <td className='text-left' >${numberWithCommas(totalValueOfSalesPerson.toFixed(2))}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )
                                    })}

                                </div>
                                <div className='h-72 w-full flex flex-col items-center mb-6'>
                                    <Bar options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top' as const,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Sales Rep Bar Chart',
                                            },
                                        },
                                    }} data={sales} />
                                </div>
                                <div className='h-72 w-full flex flex-col items-center'>
                                    <Pie data={sales} />
                                </div>



                                <h1 className='text-center  text-4xl'>Stage Overview</h1>
                                <div className='h-72 w-full flex flex-col items-center mb-6'>
                                    <Bar options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top' as const,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Stage  Bar Chart',
                                            },
                                        },
                                    }} data={stage} />
                                </div>
                                <div className='h-72 w-full flex flex-col items-center'>
                                    <Pie data={stage} />
                                </div>
                            </div>




                        </div> : <div>No Data yet, add a client or send a Quotation/Invoice to add information</div>}

                    </>

                }




            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default CRMReportTemplate

