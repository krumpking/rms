import React, { useEffect, useState } from "react";
import incrementString from "./helpers/incrementString";
import InvoiceItem from "./invoiceItem";
import InvoiceModal from "./invoiceModal";
import { print } from "../../utils/console";
import { createId } from "../../utils/stringM";
import { getCount } from "../../api/eReceiptingApi";
import ReceiptModal from "./receiptModal";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
});

const ReceiptForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState(1);
    const [sumTotal, setSumTotal] = useState("");
    const [items, setItems] = useState([
        {
            id: createId(),
            name: "",
            qty: "1.00",
            price: "1.00",
        },
    ]);
    const [total, setTotal] = useState("");
    const [receivedFrom, setReceivedFrom] = useState("");
    const [email, setEmail] = useState("");
    const [receiptNo, setReceiptNo] = useState(0);
    const [stage, setStage] = useState("Receipt Sent");
    const [currency, setCurrency] = useState<string[]>([]);


    useEffect(() => {



        getCount(stage).then((v) => {
            if (v !== null) {
                var r = v.count;
                setReceiptNo(r);
            }
        }).catch((e) => {
            console.error(e);
        })


    }, [])



    const reviewInvoiceHandler = (event: any) => {
        event.preventDefault();
        setIsOpen(true);
    };

    const addNextInvoiceHandler = () => {
        setInvoiceNumber((prevNumber) => incrementString(prevNumber));
        setItems([
            {
                id: createId(),
                name: "",
                qty: "1.00",
                price: "1.00",
            },
        ]);
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

    const handleChange = (value: string) => {

        let cu = currency;
        cu.push(value);
        setCurrency(cu);

    };

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
                            Receipt Number: {receiptNo}
                        </label>

                    </div>
                </div>
                <div className="grid grid-cols-1 smXS:grid-cols-2 gap-2 pt-4 pb-8">
                    <div>
                        <label
                            htmlFor="cashierName"
                            className="text-sm font-bold sm:text-base"
                        >
                            Received from:
                        </label>
                        <div>
                            <textarea
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
                                placeholder="Received from"
                                name="receivedFrom"
                                id="receivedFrom"
                                value={receivedFrom}
                                onChange={(event) => setReceivedFrom(event.target.value)}
                            />

                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="customerName"
                            className="col-start-2 row-start-1 text-sm font-bold md:text-base"
                        >
                            Paid the sum of:
                        </label>
                        <div>
                            <textarea
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
                                placeholder="Sum Total in words"
                                name="sumTotal"
                                id="sumTotal"
                                value={sumTotal}
                                onChange={(event) => setSumTotal(event.target.value)}
                            />

                        </div>
                    </div>




                </div>
                <div className="w-full overscroll-contain overflow-y-auto">
                    <table className="w-full p-4 text-left">
                        <thead>
                            <tr className="border-b border-gray-900/10 text-sm md:text-base">
                                <th>Item Note</th>
                                <th>QTY</th>
                                <th className="text-center">Note</th>
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
                <div className="grid grid-cols-1 smXS:grid-cols-2 pt-6">
                    <div className="flex flex-row space-x-4 px-2">
                        <input onChange={() => handleChange("USD")} type="checkbox" id="usd" name="usd" value="USD" className='accent-green-700 text-white bg-whites' />
                        <label htmlFor="vehicle1"> USD</label><br />
                        <input onChange={() => handleChange("ZWL")} type="checkbox" id="zwl" name="zwl" value="ZWL" />
                        <label htmlFor="vehicle2"> ZWL</label><br />
                    </div>
                    <div className="flex w-full justify-between md:w-1/2">
                        <span className="font-bold">Total:</span>
                        <span>${subtotal.toFixed(2)}</span>
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
                        Review Receipt
                    </button>
                    <ReceiptModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        type={'Receipt'}
                        invoiceInfo={{
                            invoiceNumber,
                            subtotal,
                            total,
                            today,
                            email,
                            items,
                            sumTotal,
                            receivedFrom,
                            currency,
                            receiptNo,
                            stage,
                        }}
                        items={items}
                        onAddNextInvoice={undefined}
                        onEditItem={() => { }} />

                </div>
            </div>
        </form>
    );
};

export default ReceiptForm;
