import React, { useEffect } from "react";
import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders, getTables } from "../https";
import { FaRupeeSign, FaSpinner, FaChair, FaClipboardList } from "react-icons/fa";

const Home = () => {
  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  const { data: ordersRes } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  const { data: tablesRes } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
  });

  const orders = ordersRes?.data?.data || [];
  const tables = tablesRes?.data?.data || [];
  const activeOrders = orders.filter((o) => o.orderStatus !== "Cancelled");
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.totalWithTax || 0), 0);
  const inProgress = orders.filter((o) => o.orderStatus === "In Progress").length;
  const activeTables = tables.filter((t) => t.status === "Booked").length;

  return (
    <section className="bg-[#141414] h-full overflow-hidden flex">
      {/* Left */}
      <div className="flex-[3] flex flex-col overflow-hidden">
        <Greetings />
        <div className="grid grid-cols-4 gap-3 px-8 mt-4">
          <MiniCard
            title="Revenue"
            icon={<FaRupeeSign />}
            value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            accent="#10b981"
          />
          <MiniCard
            title="Orders"
            icon={<FaClipboardList />}
            value={orders.length}
            accent="#f6b100"
          />
          <MiniCard
            title="In Progress"
            icon={<FaSpinner />}
            value={inProgress}
            accent="#f59e0b"
          />
          <MiniCard
            title="Active Tables"
            icon={<FaChair />}
            value={`${activeTables}/${tables.length}`}
            accent="#6366f1"
          />
        </div>
        <div className="flex-1 overflow-hidden mt-2">
          <RecentOrders />
        </div>
      </div>
      {/* Right */}
      <div className="flex-[1.2] border-l border-[#222]">
        <PopularDishes />
      </div>
    </section>
  );
};

export default Home;
