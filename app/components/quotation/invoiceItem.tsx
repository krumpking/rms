import React, { FC } from "react";
import InvoiceField from "./invoiceField";


interface MyProps {
  id: any,
  name: any,
  qty: any,
  price: string,
  onDeleteItem: (id: string) => void,
  onEdtiItem: (event: any) => void,
}


const InvoiceItem: FC<MyProps> = ({ id, name, qty, price, onDeleteItem, onEdtiItem }) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  return (
    <tr>
      <td className="min-w-[200px] md:min-w-[150px]">
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            placeholder: "Item name",
            type: "text",
            name: "name",
            id: id,
            value: name,
          }}
        />
      </td>
      <td className="min-w-[100px] md:min-w-[150px]">
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            type: "number",
            step: "0.001",
            min: "1.00",
            name: "qty",
            id: id,
            value: qty,
          }}
        />
      </td>
      <td className="relative min-w-[100px] md:min-w-[150px]">

        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            className: "text-right",
            type: "number",
            min: "0.01",
            step: "0.01",
            name: "price",
            id: id,
            value: price,
          }}
        />
      </td>
      <td className="flex items-center justify-center">
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
          onClick={deleteItemHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
