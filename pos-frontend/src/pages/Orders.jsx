import React, { useState, useEffect } from "react";
import OrderCard from "../components/orders/OrderCard";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const filters = [
  { key: "all", label: "All" },
  { key: "In Progress", label: "In Progress" },
  { key: "Ready", label: "Ready" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

const Orders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("newOrder", () => {
      queryClient.invalidateQueries(["orders"]);
    });
    socket.on("orderUpdated", () => {
      queryClient.invalidateQueries(["orders"]);
    });
    return () => socket.disconnect();
  }, [queryClient]);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const allOrders = resData?.data?.data || [];
  const filtered =
    status === "all"
      ? allOrders
      : allOrders.filter((o) => o.orderStatus === status);

  return (
    <section className="bg-[#141414] h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[#f5f5f5] text-lg font-bold">Orders</h1>
          <span className="text-xs text-[#666] bg-[#1a1a1a] border border-[#222] px-3 py-1 rounded-full">
            {filtered.length} of {allOrders.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1a1a1a] rounded-xl p-1 border border-[#222]">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === f.key
                  ? "bg-[#f6b100] text-[#111]"
                  : "text-[#888] hover:text-[#f5f5f5]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.length > 0 ? (
            filtered.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <p className="col-span-full text-[#555] text-sm text-center py-20">
              No orders found
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Orders;
