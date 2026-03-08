import React from "react";
import { useSelector } from "react-redux";
import { getAvatarName } from "../../utils";

const CustomerInfo = () => {
  const customerData = useSelector((state) => state.customer);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-9 h-9 bg-gradient-to-br from-[#f6b100] to-[#e09800] flex items-center justify-center rounded-lg text-[#111] text-sm font-bold flex-shrink-0">
        {getAvatarName(customerData.customerName) || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm text-[#f5f5f5] font-semibold truncate">
          {customerData.customerName || "Walk-in"}
        </h1>
        <p className="text-[10px] text-[#666] mt-0.5">
          Table {customerData.table?.tableNo || "—"}
          
          <span className="mx-1.5">·</span>
          Dine in
        </p>
      </div>
    </div>
  );
};

export default CustomerInfo;
