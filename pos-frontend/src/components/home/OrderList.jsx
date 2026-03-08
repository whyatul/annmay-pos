import React from "react";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ order }) => {
  return (
    <div className="flex items-center gap-4 py-2.5 px-2 rounded-lg hover:bg-[#1f1f1f] transition-colors">
      <div className="w-9 h-9 bg-[#f6b100] flex items-center justify-center rounded-lg text-[#111] text-sm font-bold flex-shrink-0">
        {getAvatarName(order.customerName)}
      </div>
      <div className="flex items-center justify-between flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <h1 className="text-[#f5f5f5] text-sm font-medium truncate">
            {order.customerName}
          </h1>
          <p className="text-[#555] text-xs">
            {order.items?.length || 0} items
            <span className="mx-1.5">·</span>
            Table {order.Table?.tableNo || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[#f5f5f5] text-sm font-semibold">
            ₹{order.totalWithTax?.toFixed(0)}
          </span>
          {order.orderStatus === "Ready" ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
              Ready
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
              {order.orderStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
