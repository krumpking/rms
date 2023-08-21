import React, { useEffect, useState } from "react";
import incrementString from "./helpers/incrementString";
import InvoiceItem from "./invoiceItem";
import InvoiceModal from "./invoiceModal";
import { print } from "../../utils/console";
import { createId } from "../../utils/stringM";
import { getCount } from "../../api/eReceiptingApi";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
});

const QuotationForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [discount, setDiscount] = useState("");
    const [tax, setTax] = useState("15");
    const [invoiceNumber, setInvoiceNumber] = useState(1);
    const [cashierName, setCashierName] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerContact, setCustomerContact] = useState("");
    const [customerOrganisation, setCustomerOrganisation] = useState("");
    const [items, setItems] = useState([
        {
            id: createId(),
            name: "",
            qty: "1.00",
            price: "1.00",
        },
    ]);
    const [total, setTotal] = useState(0);
    const [spContact, setSPContact] = useState("");
    const [email, setEmail] = useState("");
    const [stage, setStage] = useState("Quotation Sent");
    const [invoiceNo, setInvoiceNo] = useState(0);





    const reviewInvoiceHandler = (event: any) => {
        event.preventDefault();
        setIsOpen(true);
    };



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

        if (discountRate > 0) {
            setTotal(subtotal + taxRate - discountRate);
        } else {
            setTotal(subtotal + taxRate);
        }
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

    const subtotal = items.reduce((prev, curr) => {
        if (curr.name.trim().length > 0)
            return prev + Number(parseFloat(curr.price) * parseFloat(curr.qty));
        else return prev;
    }, 0);
    const taxRate = (parseFloat(tax) * subtotal) / 100;
    const discountRate = (parseFloat(discount) * subtotal) / 100;
    useEffect(() => {
        print(total + taxRate);
        if (discountRate > 0) {

            setTotal((subtotal + taxRate) - discountRate);
        } else {
            setTotal(subtotal + taxRate);
        }

        if (total < 1) {
            getCount(stage).then((v) => {

                if (v !== null) {
                    var r = v.count;
                    setInvoiceNo(r);
                }
            }).catch((e) => {
                console.error(e);
            })
        }
    }, [subtotal]);

    return (
        <form
            className="relative flex flex-col px-2 md:flex-row"
            onSubmit={reviewInvoiceHandler}
        >
            <div className="my-6 flex-1 space-y-2  rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6">
                <div className="flex flex-col justify-between space-y-2 border-b border-gray-900/10 pb-4 md:flex-row md:items-center md:space-y-0">
                    <div className="flex space-x-2">
                        <span className="font-bold">Current Date: </span>
                        <span>{today}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="font-bold" htmlFor="invoiceNumber">
                            Quotation Number: {invoiceNo}
                        </label>

                    </div>
                </div>
                <div className="grid grid-cols-1 smXS:grid-cols-2 gap-2 pt-4 pb-8">
                    <div>
                        <label
                            htmlFor="cashierName"
                            className="text-sm font-bold sm:text-base"
                        >
                            Sales Person:
                        </label>
                        <div>
                            <input
                                required
                                className="
                                mb-2
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
                                placeholder="Sales person"
                                name="cashierName"
                                id="cashierName"
                                value={cashierName}
                                onChange={(event) => setCashierName(event.target.value)}
                            />
                            <input
                                required
                                className="
                                    mb-2
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
                                placeholder="Sales person contact"
                                name="spContact"
                                id="spContact"
                                value={spContact}
                                onChange={(event) => setSPContact(event.target.value)}
                            />
                            <input
                                required
                                className="
                                    mb-2
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
                                placeholder="Sales Person Email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="customerName"
                            className="col-start-2 row-start-1 text-sm font-bold md:text-base"
                        >
                            Customer:
                        </label>
                        <div>
                            <input
                                required
                                className="
                                    mb-2
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
                                placeholder="Customer name"
                                type="text"
                                name="customerName"
                                id="customerName"
                                value={customerName}
                                onChange={(event) => setCustomerName(event.target.value)}
                            />
                            <input
                                required
                                className="
                                    mb-2
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
                                placeholder="Customer Contact"
                                type="text"
                                name="customerContact"
                                id="customerContact"
                                value={customerContact}
                                onChange={(event) => setCustomerContact(event.target.value)}
                            />
                            <input
                                required
                                className="
                                mb-2
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
                                placeholder="Customer Organisation"
                                type="text"
                                name="customerOrganisation"
                                id="customerOrganisation"
                                value={customerOrganisation}
                                onChange={(event) => setCustomerOrganisation(event.target.value)}
                            />
                        </div>

                    </div>



                </div>
                <div className="w-full overscroll-contain overflow-y-auto">
                    <table className="w-full p-4 text-left">
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
                    <div className="flex w-full justify-between md:w-1/2">
                        <span className="font-bold">Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between md:w-1/2">
                        <span className="font-bold">Discount:</span>
                        <span>
                            ({discount || "0"}%)${typeof discount === "string" ? 0.00 : discountRate.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex w-full justify-between md:w-1/2">
                        <span className="font-bold">VAT:</span>
                        <span>
                            ({tax || "0"}%)${taxRate.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex w-full justify-between border-t border-gray-900/10 pt-2 md:w-1/2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold">
                            ${total % 1 === 0 ? total : total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="basis-1/4 bg-transparent">
                <div className="sticky top-0 z-10 space-y-4 divide-y divide-gray-900/10 pb-8 md:pt-6 md:pl-4">
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
                        type="submit"
                    >
                        Review Quotation
                    </button>
                    <InvoiceModal
                        type={'Quotation'}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        invoiceInfo={{
                            stage,
                            invoiceNumber,
                            cashierName,
                            customerName,
                            subtotal,
                            taxRate,
                            discountRate,
                            total,
                            today,
                            email,
                            spContact,
                            customerOrganisation,
                            customerContact,
                            items
                        }}
                        items={items}
                        onAddNextInvoice={undefined}
                        onEditItem={() => { }} />
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold md:text-base" htmlFor="tax">
                                Tax rate:
                            </label>
                            <div className="flex items-center">
                                <input
                                    className="w-full rounded-r-none bg-white shadow-sm"
                                    type="number"
                                    name="tax"
                                    id="tax"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.0"
                                    value={tax}
                                    onChange={(event) => setTax(event.target.value)}
                                />
                                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                                    %
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                className="text-sm font-bold md:text-base"
                                htmlFor="discount"
                            >
                                Discount rate:
                            </label>
                            <div className="flex items-center">
                                <input
                                    className="w-full rounded-r-none bg-white shadow-sm"
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.0"
                                    value={discount}
                                    onChange={(event) => setDiscount(event.target.value)}
                                />
                                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default QuotationForm;
