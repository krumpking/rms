import React, { useCallback, useEffect, useState } from 'react'
import { FC } from 'react';
import { createId, excelDateToJSDate, getExtension } from '../utils/stringM';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, PERSON_ROLE } from '../constants/constants';
import { decrypt, encrypt } from '../utils/crypto';
import { addAClientToDB } from '../api/crmApi';
import Loader from './loader';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { print } from '../utils/console';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone'
import InvoiceItem from './quotation/invoiceItem';





const AddClient = () => {
    const [fullName, setFullName] = useState("");
    const [contact, setContact] = useState("");
    const [organisation, setOrganisation] = useState("");
    const [stage, setStage] = useState("");
    const [notes, setNotes] = useState("");
    const [refSource, setRefSource] = useState("");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [salesPerson, setSalesPerson] = useState("");
    const router = useRouter();
    const [fileAdded, setFileAdded] = useState(false);
    const [isPdf, setIsPdf] = useState(false);
    const [pdfCapture, setPDFCapture] = useState("");
    const [pdfPath, setPdfPath] = useState("");
    const [items, setItems] = useState([
        {
            id: createId(),
            name: "",
            qty: "1.00",
            price: "1.00",
        },
    ]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
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
                if (roleTitle == "Viewer") { // "Viewer" //"Editor"
                    router.push('/home');
                    toast.info("You do not have permission to access this page");
                }

            }
        }



    }, [])



    const addClient = () => {
        setLoading(true);
        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        var myId = decrypt(getCookie(COOKIE_ID), COOKIE_ID);
        var id = decrypt(infoFromCookie, COOKIE_ID)

        var notesA = [];
        notesA.push(encrypt(notes, id));
        var prodA: any = [];
        items.forEach((el: any) => {
            prodA.push(
                {
                    product: encrypt(el.name, id),
                    value: encrypt(el.price, id),
                    totalNumber: encrypt(el.qty, id)
                }
            )
        })
        var client = {
            id: myId,
            adminId: id,
            date: new Date(),
            dateString: new Date().toDateString(),
            name: encrypt(fullName, id),
            contact: encrypt(contact, id),
            organisation: encrypt(organisation, id),
            stage: encrypt(stage, id),
            notes: notesA,
            refSource: encrypt(refSource, id),
            enquired: prodA,
            value: encrypt(total.toString(), id),
            encryption: 2,
            salesPerson: encrypt(salesPerson, id),
        }

        addAClientToDB(client).then((r) => {
            toast.success("Client added!");

            setLoading(false);
        }).catch((e) => {
            toast.error("There was an error adding client please try again");
            setLoading(false);
            console.error(e);
        })
    }


    const addItemHandler = () => {
        const id = createId();
        setItems((prevItem) => [
            ...prevItem,
            {
                id: id,
                name: "",
                qty: "1.00",
                price: "1.00",
            },
        ]);


        setTotal(subtotal);

    };

    const deleteItemHandler = (id: any) => {
        setItems((prevItem) => prevItem.filter((item) => item.id !== id));
    };

    const edtiItemHandler = (event: any) => {
        const editedItem = {
            id: event.target.id,
            name: event.target.name,
            value: event.target.value,
        };

        const newItems = items.map((items: any) => {
            for (const key in items) {
                if (key === editedItem.name && items.id === editedItem.id) {
                    items[key] = editedItem.value;
                }
            }
            return items;
        });

        setItems(newItems);
    };

    const uploadClient = () => {

    }

    const onDrop = useCallback(async (acceptedFiles: any[]) => {
        setFileAdded(true);
        if (getExtension(acceptedFiles[0].name) === "pdf") {
            setIsPdf(true);
            // setPdfPath(acceptedFiles[0].path);
            // const doc = await pdfjs.getDocument(acceptedFiles[0]).promise // note the use of the property promise
            // const page = await doc.getPage(1)
            // return await page.getTextContent()

        } else if (getExtension(acceptedFiles[0].name) === "xlsx" || getExtension(acceptedFiles[0].name) === "xls") {

            var reader = new FileReader();

            reader.onload = e => {
                if (e !== null) {

                    if (e.target !== null) {

                        /* Parse data */
                        const bstr = e.target.result;
                        const wb = XLSX.read(bstr, { type: 'binary' });
                        /* Get first worksheet */
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        /* Convert array of arrays */
                        const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
                        /* Update state */
                        let counter = 0;
                        data.forEach((element: any) => {

                            let d = `${element[0]}`;


                            let fullName = `${element[1]}`;
                            let contact = `${element[2]}`;
                            let organisation = `${element[3]}`;
                            let stage = `${element[4]}`;
                            let products = `${element[5]}`;
                            let totalAmount = `${element[6]}`;
                            let notes = `${element[7]}`;
                            let refSource = `${element[8]}`;
                            let salesPerson = `${element[9]}`;

                            var infoFromCookie = "";
                            if (getCookie(ADMIN_ID) == "") {
                                infoFromCookie = getCookie(COOKIE_ID);
                            } else {
                                infoFromCookie = getCookie(ADMIN_ID);
                            }

                            var myId = decrypt(getCookie(COOKIE_ID), COOKIE_ID);
                            var id = decrypt(infoFromCookie, COOKIE_ID)

                            var notesA = [];
                            if (notes !== "undefined") {
                                notesA.push(encrypt(notes, id));
                            }

                            var prodA: any = [];

                            if (products !== "undefined" && typeof products !== 'undefined' && products !== 'Product') {

                                if (products.includes(",")) {
                                    var prodAr = products.split(",");
                                    prodAr.forEach((el) => {
                                        prodA.push({
                                            product: encrypt(el, id),
                                            value: encrypt(totalAmount, id),
                                            totalNumber: encrypt("1", id)
                                        });
                                    })

                                } else {
                                    prodA.push({
                                        product: encrypt(products, id),
                                        value: encrypt(totalAmount, id),
                                        totalNumber: encrypt("1", id)
                                    });
                                }

                            }


                            // var c = {
                            //     id: myId,
                            //     adminId: id,
                            //     date: new Date(d),
                            //     dateString: new Date(d).toDateString(),
                            //     name: fullName,
                            //     contact: contact,
                            //     organisation: organisation,
                            //     stage: stage,
                            //     notes: notesA,
                            //     refSource: refSource,
                            //     enquired: prodA,
                            //     value: totalAmount,
                            //     encryption: 2,
                            //     salesPerson: salesPerson,
                            // }
                            // print(c);

                            var client = {
                                id: myId,
                                adminId: id,
                                date: new Date(d),
                                dateString: new Date(d).toDateString(),
                                name: fullName === "undefined" ? "" : encrypt(fullName, id),
                                contact: contact === "undefined" ? "" : encrypt(contact, id),
                                organisation: organisation === "undefined" ? "" : encrypt(organisation, id),
                                stage: stage === "undefined" ? "" : encrypt(stage, id),
                                notes: notesA,
                                refSource: refSource === "undefined" ? "" : encrypt(refSource, id),
                                enquired: prodA,
                                value: totalAmount === "undefined" ? "" : encrypt(totalAmount, id),
                                encryption: 2,
                                salesPerson: salesPerson === "undefined" ? "" : encrypt(salesPerson, id),
                            }
                            // print(client);


                            if (totalAmount !== "undefined" && totalAmount !== "" && typeof totalAmount !== 'undefined') {
                                addAClientToDB(client).then((r) => {
                                    toast.success("Client added!");

                                    setLoading(false);
                                })
                            }



                        });




                    }

                }

            };
            reader.readAsBinaryString(acceptedFiles[0]);
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        } else {
            toast.error("Only PDF and Excel files accepted");
        }


        // Do something with the files





    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    const extractTextCompleted = (args: any) => {
        // Extract the Complete text of load document
        console.log(args);
        console.log(args.documentTextCollection[1]);
        // Extract the Text data.
        console.log(args.documentTextCollection[1][1].TextData);
        // Extract Text in the Page.
        console.log(args.documentTextCollection[1][1].PageText);
        // Extract Text along with Bounds
        console.log(args.documentTextCollection[1][1].TextData[0].Bounds);
    };


    const subtotal = items.reduce((prev, curr) => {
        if (curr.name.trim().length > 0)
            return prev + Number(parseFloat(curr.price) * parseFloat(curr.qty));
        else return prev;
    }, 0);
    useEffect(() => {

        setTotal(subtotal);

    }, [subtotal])


    return (
        <div>
            {loading ?
                <div className='flex flex-col items-center content-center'>
                    <Loader />
                </div>
                : <div className='grid grid-cols-2 gap-4'>
                    <div className="mb-2">
                        <input
                            type="text"
                            value={fullName}
                            placeholder={"Full Name"}
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
                    <div className="mb-2">
                        <input
                            type="text"
                            value={contact}
                            placeholder={"Contact"}
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
                    <div className="mb-1">
                        <input
                            type="text"
                            value={organisation}
                            placeholder={"Organisation"}
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
                    <div className='mb-1'>
                        <button className='font-bold rounded-[25px] border-2  bg-white px-4 py-3 w-full' >
                            <select
                                value={stage}
                                onChange={(e) => {
                                    setStage(e.target.value);
                                }}
                                className='bg-white w-full'
                                data-required="1"
                                required>
                                <option value="Contact" hidden>
                                    Stage of Relationship
                                </option>
                                <option value="Quotation Sent" >
                                    Quotation Sent
                                </option>
                                <option value="Invoice Sent" >
                                    Invoice Sent
                                </option>
                                <option value="Receipt Sent" >
                                    Receipt Sent
                                </option>
                                <option value="Project Started" >
                                    Project Started
                                </option>
                                <option value="Project In Progress" >
                                    Project In Progress
                                </option>
                                <option value="Project Finished" >
                                    Project Finished
                                </option>
                            </select>
                        </button>

                    </div>
                    <div className='col-span-2 '>
                        <div className='overflow-x-auto whitespace-nowrap'>
                            <table className="w-full p-4 text-left  ">
                                <thead>
                                    <tr className="border-b border-gray-900/10 text-sm md:text-base">
                                        <th>ITEM</th>
                                        <th>QTY</th>
                                        <th className="text-center">PRICE</th>
                                        <th className="text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <InvoiceItem
                                            key={item.id}
                                            id={item.id}
                                            name={item.name}
                                            qty={item.qty}
                                            price={item.price}
                                            onDeleteItem={deleteItemHandler}
                                            onEdtiItem={edtiItemHandler}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
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
                            type="button"
                            onClick={addItemHandler}
                        >
                            Add Item
                        </button>
                        <div className="flex flex-col items-end space-y-2 pt-6">
                            <div className="flex w-full justify-between border-t border-gray-900/10 pt-2 md:w-1/2">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold">
                                    ${total % 1 === 0 ? total : total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-1">
                        <textarea
                            value={notes}
                            placeholder={"Notes"}
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
                    <div className="mb-1">
                        <textarea
                            value={refSource}
                            placeholder={"How they heard"}
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
                            placeholder={"Sales Person"}
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
                    <div className="mb-1">
                        <button
                            onClick={() => { if (fileAdded) { uploadClient() } else { addClient() } }}
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
                                    ">
                            Add Client
                        </button>
                    </div>
                    <div {...getRootProps()} className="
                                    mb-6
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
                                    text-center
                                    " >
                        <input {...getInputProps()} />
                        <>
                            {fileAdded ? <>{isPdf ?
                                <>
                                    <textarea
                                        value={notes}
                                        placeholder={"Words to capture"}
                                        onChange={(e) => {
                                            setPDFCapture(e.target.value);
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
                                </> : <p>File added</p>}</>
                                : <>
                                    {
                                        isDragActive ?
                                            <p>Drop the file here ...</p> :
                                            <p> Click to select file</p>
                                    }
                                </>
                            }
                        </>

                    </div>



                </div>}
            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div >

    )
};


export default AddClient
