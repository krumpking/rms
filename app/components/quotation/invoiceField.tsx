import React, { FC } from "react";


interface MyProps {
  cellData: any,
  onEditItem: (event: any) => void,
}

const InvoiceField: FC<MyProps> = ({ onEditItem, cellData }) => {
  return (
    <input
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
      type={cellData.type}
      placeholder={cellData.placeholder}
      min={cellData.min}
      max={cellData.max}
      step={cellData.step}
      name={cellData.name}
      id={cellData.id}
      value={cellData.value}
      onChange={onEditItem}
      required
    />
  );
};

export default InvoiceField;
