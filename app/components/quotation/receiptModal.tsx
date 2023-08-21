import React, { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { addAClientToDB } from "../../api/crmApi";
import { getCookie } from "react-use-cookie";
import { ADMIN_ID, COOKIE_ID } from "../../constants/constants";
import { decrypt, encrypt } from "../../utils/crypto";
import { getOrgInfoFromDB } from "../../api/orgApi";
import { print } from "../../utils/console";
import Head from "next/head";


interface MyProps {
    type: string,
    isOpen: any,
    setIsOpen: any,
    invoiceInfo: any,
    items: any,
    onAddNextInvoice: any,
    onEditItem: (event: any) => void,
}



const ReceiptModal: FC<MyProps> = ({
    type,
    isOpen,
    setIsOpen,
    invoiceInfo,
    items
}) => {
    const [organizationName, setOrganizationName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [call, setCall] = useState("");
    const [landline, setLandline] = useState("");
    const [vat, setVat] = useState(0);
    const [image, setImage] = useState<any>();
    const [quotation, setQuotation] = useState("");

    useEffect(() => {

        getOrgInfo();



    }, [])




    const getOrgInfo = () => {

        getOrgInfoFromDB().then((r) => {

            var infoFromCookie = "";
            if (getCookie(ADMIN_ID) == "") {
                infoFromCookie = getCookie(COOKIE_ID);
            } else {
                infoFromCookie = getCookie(ADMIN_ID);
            }
            var id = decrypt(infoFromCookie, COOKIE_ID);


            if (r !== null) {

                r.data.forEach(element => {
                    setOrganizationName(decrypt(element.data().organizationName, id));
                    setAddress(decrypt(element.data().address, id));
                    setEmail(decrypt(element.data().email, id));
                    setCall(decrypt(element.data().call, id));
                    setLandline(decrypt(element.data().landline, id));
                    setVat(parseInt(decrypt(element.data().vat, id)));
                    setImage(element.data().image);
                    setQuotation(decrypt(element.data().quotation, id));
                });

            }


        }).catch((e) => {
            console.error(e);

        });
    }




    function closeModal() {
        setIsOpen(false);
    }



    const SaveAsPDFHandler = () => {

        var infoFromCookie = "";
        if (getCookie(ADMIN_ID) == "") {
            infoFromCookie = getCookie(COOKIE_ID);
        } else {
            infoFromCookie = getCookie(ADMIN_ID);
        }

        var id = decrypt(infoFromCookie, COOKIE_ID);


        var prodA: any = [];



        var client = {
            id: decrypt(getCookie(COOKIE_ID), COOKIE_ID),
            adminId: id,
            date: new Date(),
            dateString: new Date().toDateString(),
            name: encrypt(invoiceInfo.receivedFrom, id),
            contact: encrypt(invoiceInfo.customerContact, id),
            organisation: encrypt(invoiceInfo.customerOrgainsation, id),
            stage: encrypt(invoiceInfo.stage, id),
            notes: [],
            refSource: "",
            enquired: prodA,
            value: encrypt(invoiceInfo.sumTotal.toString(), id),
            encryption: 2,
            salesPerson: encrypt(invoiceInfo.cashierName, id),
        }

        addAClientToDB(client).then((r) => {
            alert('Client Added');
        }).catch((e) => {
            console.error(e);
        })


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
                            // if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                            //   pageCanvas.height = pxFullHeight % pxPageHeight;
                            //   pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
                            // }
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
                        pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
                    };
                })
                .catch((error) => {
                    console.error("oops, something went wrong!", error);
                });
        }

    };

    return (
        <>
            <Head>
                <meta name="viewport" content="width=978"></meta>
            </Head>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
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
                            <div>
                                <div id="print" className="  my-8 text-lg font-open inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all ">
                                    <div className="grid grid-cols-3 justify-items-center content-center place-content-center p-4">
                                        <div>
                                            <img src={image} className="max-h-48 w-full ml-2" />
                                        </div>
                                        <div>
                                            <h1>Receipt No: {invoiceInfo.receiptNo}</h1>
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="font-bold text-xl"> {organizationName} </h1>
                                            <p>{address}</p>
                                            <p>Email: {email}</p>
                                            <p>Tel: {call}/{landline}</p>
                                            <p>Tax No {vat}</p>
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-4 p-4 mb-6">

                                        <div className="col-span-3">
                                            <p> Received from: {invoiceInfo.receivedFrom}  Date: {new Date().toDateString()}</p>
                                            <p>Paid the sum of: {invoiceInfo.sumTotal}</p>
                                            <div className="flex flex-row space-x-2">
                                                {invoiceInfo.currency.map((v: any) => (
                                                    <p key={v}>{v}</p>
                                                ))}</div>
                                            <p>Name ................................... Signature:.................................................</p>
                                        </div>
                                        <div className="col-span-1  border-2 border-black p-4">
                                            <table className="w-full text-left ">
                                                <thead>
                                                    <tr className=" text-sm md:text-base p-4">
                                                        <th className="text-center">ITEM</th>
                                                        <th className="text-center">QTY</th>
                                                        <th className="text-right">PRICE</th>
                                                        <th className="text-right">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {items.map((item: any) => (
                                                        <tr key={item.id}>
                                                            <td className="w-12">{item.name}</td>
                                                            <td className="min-w-[50px] text-center">
                                                                {item.qty}
                                                            </td>
                                                            <td className="min-w-[80px] text-right">
                                                                ${Number(item.price).toFixed(2)}
                                                            </td>
                                                            <td className="min-w-[90px] text-right ">
                                                                ${Number(item.price * item.qty).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                </div>
                                <div className="w-full mb-6">
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
                                        onClick={SaveAsPDFHandler}
                                    >

                                        <span>Download</span>
                                    </button>

                                </div>
                            </div>

                        </Transition.Child>
                    </div>
                </Dialog >
            </Transition >
        </>

    );
};

export default ReceiptModal;
