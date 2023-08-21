import React, { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { addAClientToDB } from "../../api/crmApi";
import { getCookie } from "react-use-cookie";
import { ADMIN_ID, COOKIE_ID } from "../../constants/constants";
import { decrypt, encrypt } from "../../utils/crypto";
import { getOrgInfoFromDB } from "../../api/orgApi";
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



const InvoiceModal: FC<MyProps> = ({
  type,
  isOpen,
  setIsOpen,
  invoiceInfo,
  items,
  onAddNextInvoice,
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
      id: decrypt(getCookie(COOKIE_ID), COOKIE_ID),
      adminId: id,
      date: new Date(),
      dateString: new Date().toDateString(),
      name: encrypt(invoiceInfo.customerName, id),
      contact: encrypt(invoiceInfo.customerContact, id),
      organisation: encrypt(invoiceInfo.customerOrgainsation, id),
      stage: encrypt(invoiceInfo.stage, id),
      notes: [],
      refSource: "",
      enquired: prodA,
      value: encrypt(invoiceInfo.total.toString(), id),
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
                <div id="print" className="font-open text-lg my-8 inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <div className="p-16 border-2 border-black m-8 " >
                    <h1 className="text-center text-2xl font-bold text-gray-900 border-black border-4 text-bold">
                      {type}
                    </h1>
                    <div className="grid grid-cols-2 p-4 my-12">
                      <div className="flex flex-col border-r-2 border-black">
                        <h1 className="font-bold text-2xl"> {organizationName} </h1>
                        <p>{address}</p>
                        <p>Email: {email}</p>
                        <p>Tel: {call}/{landline}</p>
                        <p>Tax No {vat}</p>
                      </div>
                      <div className="">
                        <img src={image} className="max-h-48 border-b-2 border-black w-full ml-2 object-contain" />
                        <p className="mx-2">Date </p>
                        <div className="mt-5 flex flex-row justify-between mx-2">
                          <p>{invoiceInfo.today}</p>
                          <p>Our refference</p>
                          <p>{invoiceInfo.cashierName}</p>
                        </div>

                      </div>
                    </div>
                    <div className="my-12 ">
                      <div className="mb-4 grid grid-cols-2 border-y-2 p-4 border-black ">

                        <div>
                          <p>{invoiceInfo.customerName}</p>
                          <p>{invoiceInfo.customerOrganisation}</p>
                          <p>{invoiceInfo.customerContact}</p>
                        </div>
                        <div className="border-l-2 border-black px-2">
                          <p>REF: {invoiceInfo.cashierName}</p>
                          <p>CELL: {invoiceInfo.spContact}</p>
                          <p>EMAIL: {invoiceInfo.email}</p>
                        </div>

                      </div>
                      <div className="min-h-[1000px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-sm md:text-base p-4">
                              <th>ITEM</th>
                              <th className="text-center">QTY</th>
                              <th className="text-right">PRICE</th>
                              <th className="text-right">AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody >
                            {items.map((item: any) => (
                              <tr key={item.id}>
                                <td className="w-full">{item.name}</td>
                                <td className="min-w-[50px] text-center">
                                  {item.qty}
                                </td>
                                <td className="min-w-[80px] text-right">
                                  ${Number(item.price).toFixed(2)}
                                </td>
                                <td className="min-w-[90px] text-right">
                                  ${Number(item.price * item.qty).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="grid grid-cols-2 content-end">
                        <div className="p-4 max-w-72">
                          <p className="font-bold">Please Note</p>
                          <ul className="list-decimal">
                            {quotation.includes(",") ? quotation.split(",").map((v) => (
                              <li key={v}>{v}</li>
                            )) : <li>{quotation}</li>}
                          </ul>

                        </div>
                        <div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex w-full justify-between border-t border-black/10 pt-2">
                              <span className="font-bold">Subtotal:</span>
                              <span>${invoiceInfo.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex w-full justify-between">
                              {/* TO BE CORRECTED */}
                              <span className="font-bold">Discount:</span>
                              <span>${typeof invoiceInfo.discountRate === "number" ? 0 : invoiceInfo.discountRate.toFixed(2)}</span>
                            </div>
                            <div className="flex w-full justify-between">
                              <span className="font-bold">Tax:</span>
                              <span>${invoiceInfo.taxRate.toFixed(2)}</span>
                            </div>
                            <div className="flex w-full justify-between border-t border-black/10 py-2">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold">
                                $
                                {invoiceInfo.total % 1 === 0
                                  ? invoiceInfo.total
                                  : invoiceInfo.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className="w-full text-center border-t-2 border-black">
                        <p className="text-2xl font-bold">WE VALUE YOUR BUSINESS</p>
                      </div>

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

export default InvoiceModal;
