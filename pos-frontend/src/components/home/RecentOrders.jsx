import React from "react";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

const RecentOrders = () => {
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const orders = resData?.data?.data || [];

  return (
    <div className="px-8 mt-3 flex flex-col h-full">
      <div className="bg-[#1a1a1a] border border-[#222] flex-1 rounded-xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-[#222]">
          <h1 className="text-[#f5f5f5] text-sm font-semibold uppercase tracking-wider">
            Recent Orders
          </h1>
          <span className="text-xs text-[#666] bg-[#222] px-2.5 py-1 rounded-full">
            {orders.length} total
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2">
          {orders.length > 0 ? (
            orders.slice(0, 10).map((order) => {
              return <OrderList key={order.id} order={order} />;
            })
          ) : (
            <p className="text-[#555] text-sm flex justify-center items-center h-32">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
