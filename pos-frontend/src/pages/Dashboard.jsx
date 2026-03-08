import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTables,
  getCategories,
  getMenuItems,
  deleteTable,
  deleteCategory,
  deleteMenuItem,
} from "../https/index";
import { enqueueSnackbar } from "notistack";
import BillingSettings from "../components/dashboard/BillingSettings";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Tables", "Categories", "Menu Items", "Settings"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("table");
  const [activeTab, setActiveTab] = useState("Metrics");

  const { data: tablesRes } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: activeTab === "Tables",
  });
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: activeTab === "Categories",
  });
  const { data: menuItemsRes } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    enabled: activeTab === "Menu Items",
  });

  const tablesList = tablesRes?.data?.data || [];
  const categoriesList = categoriesRes?.data?.categories || [];
  const menuItemsList = menuItemsRes?.data?.menuItems || [];

  const deleteTableMut = useMutation({
    mutationFn: (id) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"]);
      enqueueSnackbar("Table deleted", { variant: "success" });
    },
    onError: (err) =>
      enqueueSnackbar(err.response?.data?.message || "Failed", {
        variant: "error",
      }),
  });
  const deleteCategoryMut = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      enqueueSnackbar("Category deleted", { variant: "success" });
    },
    onError: (err) =>
      enqueueSnackbar(err.response?.data?.message || "Failed", {
        variant: "error",
      }),
  });
  const deleteMenuItemMut = useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
      enqueueSnackbar("Menu item deleted", { variant: "success" });
    },
    onError: (err) =>
      enqueueSnackbar(err.response?.data?.message || "Failed", {
        variant: "error",
      }),
  });

  const handleOpenModal = (action) => {
    setModalType(action);
    setModalOpen(true);
  };

  const handleDelete = (type, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    if (type === "table") deleteTableMut.mutate(id);
    else if (type === "category") deleteCategoryMut.mutate(id);
    else if (type === "menuItem") deleteMenuItemMut.mutate(id);
  };

  return (
    <div className="bg-[#141414] h-full overflow-y-auto">
      <div className="container mx-auto flex items-center justify-between py-10 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#2c2c2c] px-6 py-3 rounded-xl text-[#f5f5f5] font-semibold text-sm flex items-center gap-2 transition-colors border border-[#333] hover:border-[#f6b100]"
            >
              <span className="text-[#f6b100] text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#f6b100] text-[#1a1a1a]"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}

      {/* Manage Tables */}
      {activeTab === "Tables" && (
        <div className="container mx-auto px-6 md:px-4 pb-10">
          <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
            Manage Tables ({tablesList.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {tablesList.map((t) => (
              <div
                key={t.id}
                className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 flex flex-col items-center gap-2"
              >
                <span className="text-[#f6b100] font-bold text-lg">
                  T-{t.tableNo}
                </span>
                <span className="text-[#888] text-xs">{t.seats} seats</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    t.status === "Booked"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {t.status}
                </span>
                <button
                  onClick={() => handleDelete("table", t.id)}
                  disabled={t.status === "Booked"}
                  className="mt-1 p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title={
                    t.status === "Booked"
                      ? "Cannot delete booked table"
                      : "Delete table"
                  }
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Categories */}
      {activeTab === "Categories" && (
        <div className="container mx-auto px-6 md:px-4 pb-10">
          <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
            Manage Categories ({categoriesList.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {categoriesList.map((c) => (
              <div
                key={c.id}
                className="bg-[#1a1a1a] border border-[#222] rounded-xl p-4 flex items-center justify-between gap-2"
              >
                <span className="text-[#f5f5f5] text-sm font-medium truncate">
                  {c.name}
                </span>
                <button
                  onClick={() => handleDelete("category", c.id)}
                  className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                  title="Delete category"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Menu Items */}
      {activeTab === "Menu Items" && (
        <div className="container mx-auto px-6 md:px-4 pb-10">
          <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
            Manage Menu Items ({menuItemsList.length})
          </h2>
          <div className="overflow-x-auto bg-[#1a1a1a] border border-[#222] rounded-xl">
            <table className="w-full text-left text-[#f5f5f5]">
              <thead className="bg-[#222] text-[#888] text-xs uppercase">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItemsList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#222] hover:bg-[#222]/50"
                  >
                    <td className="p-3">
                      {item.image ? (
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }${item.image}`}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#555] text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-sm font-medium">{item.name}</td>
                    <td className="p-3 text-xs text-[#888]">
                      {item.Category?.name || "—"}
                    </td>
                    <td className="p-3 text-sm text-[#f6b100] font-semibold">
                      ₹{item.price}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete("menuItem", item.id)}
                        className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete item"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Settings" && <BillingSettings />}

      {modalOpen && <Modal modalType={modalType} setModalOpen={setModalOpen} />}
    </div>
  );
};

export default Dashboard;
