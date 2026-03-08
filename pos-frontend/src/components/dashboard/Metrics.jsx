import React, { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getOrders, getTables, getCategories, getMenuItems } from "../../https/index";
import { FaChartLine, FaShoppingCart, FaChair, FaUtensils, FaTimes, FaFire } from "react-icons/fa";
import { formatDateAndTime } from "../../utils";

const Metrics = () => {
  const [drillDown, setDrillDown] = useState(null); // { title, items }

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

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });

  const { data: menuItemsRes } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    placeholderData: keepPreviousData,
  });

  const orders = ordersRes?.data?.data || [];
  const tables = tablesRes?.data?.data || [];
  const categories = categoriesRes?.data?.categories || [];
  const menuItems = menuItemsRes?.data?.menuItems || [];

  const activeOrders = orders.filter((o) => o.orderStatus !== "Cancelled");
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.totalWithTax || 0), 0);
  const activeTables = tables.filter((t) => t.status === "Booked").length;
  const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
  const readyOrders = orders.filter((o) => o.orderStatus === "Ready");
  const completedOrders = orders.filter((o) => o.orderStatus === "Completed");
  const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled");

  // Best Selling Items computation
  const bestSellingItems = useMemo(() => {
    const itemSales = {};
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (itemSales[item.id]) {
            itemSales[item.id] += Number(item.quantity) || 1;
          } else {
            itemSales[item.id] = Number(item.quantity) || 1;
          }
        });
      }
    });
    return menuItems
      .map((mi) => ({ ...mi, totalSold: itemSales[mi.id] || 0 }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
  }, [orders, menuItems]);

  const handleDrillDown = (key) => {
    switch (key) {
      case "revenue":
        setDrillDown({
          title: "All Orders (Revenue)",
          rows: orders.map((o) => ({
            col1: `#${o.id} — ${o.customerName}`,
            col2: `₹${o.totalWithTax?.toFixed(2)}`,
          })),
        });
        break;
      case "orders":
        setDrillDown({
          title: "All Orders",
          rows: orders.map((o) => ({
            col1: `#${o.id} — ${o.customerName}`,
            col2: o.orderStatus,
          })),
        });
        break;
      case "activeTables":
        setDrillDown({
          title: "Active (Booked) Tables",
          rows: tables
            .filter((t) => t.status === "Booked")
            .map((t) => ({
              col1: `Table ${t.tableNo}`,
              col2: `${t.seats} seats`,
            })),
        });
        break;
      case "avgOrder":
        setDrillDown({
          title: "Order Values",
          rows: orders.map((o) => ({
            col1: `#${o.id} — ${o.customerName}`,
            col2: `₹${o.totalWithTax?.toFixed(2)}`,
          })),
        });
        break;
      case "menuItems":
        setDrillDown({
          title: "All Menu Items",
          rows: menuItems.map((m) => ({
            col1: m.name,
            col2: `₹${m.price}`,
          })),
        });
        break;
      case "categories":
        setDrillDown({
          title: "All Categories",
          rows: categories.map((c) => ({ col1: c.name, col2: "" })),
        });
        break;
      case "readyOrders":
        setDrillDown({
          title: "Ready Orders",
          rows: readyOrders.map((o) => ({
            col1: `#${o.id} — ${o.customerName}`,
            col2: `Table ${o.Table?.tableNo || "N/A"}`,
          })),
        });
        break;
      case "totalTables":
        setDrillDown({
          title: "All Tables",
          rows: tables.map((t) => ({
            col1: `Table ${t.tableNo} — ${t.seats} seats`,
            col2: t.status,
          })),
        });
        break;
      default:
        break;
    }
  };

  const metricsData = [
    {
      color: "#025cca",
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      icon: <FaChartLine className="text-2xl" />,
      subtitle: "From all orders",
      key: "revenue",
    },
    {
      color: "#2e7d32",
      title: "Total Orders",
      value: orders.length,
      icon: <FaShoppingCart className="text-2xl" />,
      subtitle: `${completedOrders.length} completed · ${cancelledOrders.length} cancelled`,
      key: "orders",
    },
    {
      color: "#f57c00",
      title: "Active Tables",
      value: `${activeTables} / ${tables.length}`,
      icon: <FaChair className="text-2xl" />,
      subtitle: `${tables.length - activeTables} available`,
      key: "activeTables",
    },
    {
      color: "#7b1fa2",
      title: "Avg. Order Value",
      value: `₹${avgOrderValue.toFixed(0)}`,
      icon: <FaUtensils className="text-2xl" />,
      subtitle: "Per order",
      key: "avgOrder",
    },
  ];

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Live metrics from your restaurant operations
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            onClick={() => handleDrillDown(metric.key)}
            className="shadow-sm rounded-xl p-5 transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: metric.color }}
          >
            <div className="flex justify-between items-center text-white/80">
              <p className="font-medium text-sm">{metric.title}</p>
              {metric.icon}
            </div>
            <p className="mt-2 font-bold text-3xl text-[#f5f5f5]">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-white/60">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between mt-10">
        <div className="flex items-center gap-2">
          <FaFire className="text-orange-500" />
          <div>
            <h2 className="font-semibold text-[#f5f5f5] text-xl">
              Best Selling
            </h2>
            <p className="text-sm text-[#ababab]">
              Top performing items by order volume
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[#1a1a1a] border border-[#222] rounded-xl overflow-hidden">
          {bestSellingItems.length > 0 ? (
            <div className="divide-y divide-[#222]">
              {bestSellingItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#222]/50 transition-colors"
                >
                  <span className="text-[#444] text-xs font-mono w-6 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f6b100]/20 to-[#f6b100]/5 flex items-center justify-center">
                    <span
                      className={`w-2 h-2 rounded-sm ${
                        item.isVeg ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e0e0e0] text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#666]">
                      {item.Category?.name || "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#f6b100] text-sm font-semibold">
                      {item.totalSold > 0 ? `${item.totalSold} sold` : "No sales yet"}
                    </p>
                    <p className="text-xs text-[#666]">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#555] text-sm text-center py-8">
              No sales data available yet
            </p>
          )}
        </div>
      </div>

      {/* Drill-down Overlay */}
      {drillDown && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
              <h3 className="text-[#f5f5f5] text-lg font-semibold">
                {drillDown.title}
              </h3>
              <button
                onClick={() => setDrillDown(null)}
                className="text-[#888] hover:text-red-400 transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {drillDown.rows.length > 0 ? (
                drillDown.rows.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#222] text-sm"
                  >
                    <span className="text-[#e0e0e0]">{row.col1}</span>
                    <span className="text-[#f6b100] font-medium">
                      {row.col2}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[#555] text-sm text-center py-8">
                  No items to show
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
