import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTable, addCategory, addMenuItem, getCategories } from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ modalType, setModalOpen }) => {
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });
  const [categoryData, setCategoryData] = useState({ name: "", image: "" });
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    categoryId: "",
    isVeg: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: modalType === "dishes",
  });

  const categories = categoriesRes?.data?.categories || [];

  const handleCloseModal = () => setModalOpen(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setModalOpen(false);
      queryClient.invalidateQueries(["tables"]);
      enqueueSnackbar(res.data.message, { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to add table", {
        variant: "error",
      });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (reqData) => addCategory(reqData),
    onSuccess: (res) => {
      setModalOpen(false);
      queryClient.invalidateQueries(["categories"]);
      enqueueSnackbar("Category added successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to add category",
        { variant: "error" }
      );
    },
  });

  const dishMutation = useMutation({
    mutationFn: (reqData) => addMenuItem(reqData),
    onSuccess: (res) => {
      setModalOpen(false);
      queryClient.invalidateQueries(["menuItems"]);
      enqueueSnackbar("Menu item added successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to add item",
        { variant: "error" }
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === "table") {
      tableMutation.mutate(tableData);
    } else if (modalType === "category") {
      categoryMutation.mutate(categoryData);
    } else if (modalType === "dishes") {
      const formData = new FormData();
      formData.append("name", dishData.name);
      formData.append("price", Number(dishData.price));
      formData.append("categoryId", Number(dishData.categoryId));
      formData.append("isVeg", dishData.isVeg);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      dishMutation.mutate(formData);
    }
  };

  const titles = { table: "Add Table", category: "Add Category", dishes: "Add Menu Item" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-xl shadow-lg w-[420px] border border-[#333] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">
            {titles[modalType]}
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-[#ababab] hover:text-red-500 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === "table" && (
            <>
              <InputField
                label="Table Number"
                type="number"
                value={tableData.tableNo}
                onChange={(v) => setTableData((p) => ({ ...p, tableNo: v }))}
              />
              <InputField
                label="Number of Seats"
                type="number"
                value={tableData.seats}
                onChange={(v) => setTableData((p) => ({ ...p, seats: v }))}
              />
            </>
          )}

          {modalType === "category" && (
            <>
              <InputField
                label="Category Name"
                type="text"
                value={categoryData.name}
                onChange={(v) => setCategoryData((p) => ({ ...p, name: v }))}
              />
              <InputField
                label="Image URL (optional)"
                type="text"
                value={categoryData.image}
                onChange={(v) => setCategoryData((p) => ({ ...p, image: v }))}
                required={false}
              />
            </>
          )}

          {modalType === "dishes" && (
            <>
              <InputField
                label="Item Name"
                type="text"
                value={dishData.name}
                onChange={(v) => setDishData((p) => ({ ...p, name: v }))}
              />
              <InputField
                label="Price (₹)"
                type="number"
                value={dishData.price}
                onChange={(v) => setDishData((p) => ({ ...p, price: v }))}
              />
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Category
                </label>
                <select
                  value={dishData.categoryId}
                  onChange={(e) =>
                    setDishData((p) => ({ ...p, categoryId: e.target.value }))
                  }
                  className="w-full rounded-lg p-3.5 bg-[#1f1f1f] text-white focus:outline-none border border-[#333] focus:border-[#f6b100]"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Dish Image (optional)
                </label>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-lg p-3.5 bg-[#1f1f1f] text-[#888] text-sm border border-[#333] hover:border-[#f6b100] transition-colors text-left"
                >
                  {imageFile ? imageFile.name : "Choose an image..."}
                </button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg border border-[#333]"
                  />
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="text-[#ababab] text-sm font-medium">
                  Type:
                </label>
                <button
                  type="button"
                  onClick={() => setDishData((p) => ({ ...p, isVeg: true }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dishData.isVeg
                      ? "bg-green-600 text-white"
                      : "bg-[#1f1f1f] text-[#ababab] border border-[#333]"
                  }`}
                >
                  Veg
                </button>
                <button
                  type="button"
                  onClick={() => setDishData((p) => ({ ...p, isVeg: false }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !dishData.isVeg
                      ? "bg-red-600 text-white"
                      : "bg-[#1f1f1f] text-[#ababab] border border-[#333]"
                  }`}
                >
                  Non-Veg
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-xl mt-4 mb-2 py-3 text-lg bg-[#f6b100] hover:bg-[#e5a200] text-[#1a1a1a] font-bold transition-colors"
          >
            {titles[modalType]}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, type, value, onChange, required = true }) => (
  <div>
    <label className="block text-[#ababab] mb-2 text-sm font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg p-3.5 bg-[#1f1f1f] text-white focus:outline-none border border-[#333] focus:border-[#f6b100] transition-colors"
      required={required}
    />
  </div>
);

export default Modal;
