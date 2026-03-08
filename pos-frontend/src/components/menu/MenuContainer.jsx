import React, { useState } from "react";
import { FaPlus, FaCheck, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories, getMenuItems } from "../../https";
import { FiChevronLeft, FiMessageCircle, FiMoreHorizontal, FiShare2, FiEdit3 } from "react-icons/fi";

const MenuContainer = () => {
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);

  const { data: catRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });

  const { data: itemRes } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    placeholderData: keepPreviousData,
  });

  const categories = catRes?.data?.categories || [];
  const allItems = itemRes?.data?.menuItems || [];

  const activeCatId = selectedCatId;
  const activeCategory = activeCatId ? categories.find(c => c.id === activeCatId) : null;

  const filteredItems = activeCatId
    ? allItems.filter((item) => {
        const matchCat = item.categoryId === activeCatId;
        const matchSearch = searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return matchCat && matchSearch;
      })
    : allItems.filter((item) =>
        searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );

  const displayItems = searchQuery
    ? allItems.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredItems;

  const getCartQty = (itemId) => {
    const cartItem = cartData.find((c) => c.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    dispatch(
      addItems({
        id: item.id,
        name: item.name,
        pricePerQuantity: item.price,
        quantity: 1,
        price: item.price,
      })
    );
  };

  const countFor = (catId) => allItems.filter((i) => i.categoryId === catId).length;

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {/* Top Bar with Search */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-gray-800">
        <div className="relative w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-gray-200 pl-11 pr-4 py-2.5 rounded-2xl outline-none placeholder:text-gray-400 text-sm focus:ring-1 focus:ring-red-400 transition-all border border-transparent focus:border-amber-400 focus:bg-gray-900"
          />
        </div>
        
      </div>

      {/* Header Label & Breadcrumbs */}
      <div className="px-10 py-6 flex items-center justify-between">
         <div className="flex items-center gap-5">
           <button 
             onClick={() => setSelectedCatId(null)}
             className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-600 hover:bg-gray-800 shadow-sm"
           >
             <FiChevronLeft size={20} />
           </button>
           <div>
             <h2 className="text-3xl font-bold text-gray-100 tracking-tight">
               {activeCategory ? activeCategory.name : "All Items"}
             </h2>
             <p className="text-sm text-gray-500 mt-1">Discover whatever you need easily</p>
           </div>
         </div>
         <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">
           MENUS &gt; <span className="text-gray-200">{activeCategory ? activeCategory.name : "ALL"}</span>
         </div>
      </div>

      {/* Category Pills (Optional if we want to mimic the sidebar nav, but keeping them as pills is good) */}
      {!searchQuery && (
        <div className="flex gap-3 px-10 pb-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => {
              setSelectedCatId(null);
              setSearchQuery("");
            }}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCatId === null
                ? "bg-amber-50 text-amber-600 shadow-sm border border-amber-100"
                : "bg-gray-900 border border-gray-700 text-gray-500 hover:border-amber-200 hover:text-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                setSearchQuery("");
              }}
               className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCatId === cat.id
                  ? "bg-amber-50 text-amber-600 shadow-sm border border-amber-100"
                  : "bg-gray-900 border border-gray-700 text-gray-500 hover:border-amber-200 hover:text-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-10 pb-8 rounded-b-3xl">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
             <div className="text-4xl mb-2">🍽️</div>
             No items found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayItems.map((item) => {
              const inCart = getCartQty(item.id);
              return (
                <div
                  key={item.id}
                  onClick={(e) => handleAddToCart(item, e)}
                  className="group flex flex-col items-center text-center justify-between p-6 rounded-3xl bg-gray-900 border border-gray-800 hover:border-amber-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(255,77,79,0.08)] transition-all duration-300 cursor-pointer relative"
                >

                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-center gap-2 px-2">
                      
                      <h3 className="text-gray-100 text-base font-bold leading-snug line-clamp-2">
                         {item.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-amber-600 text-lg font-black mt-2">₹{item.price}</p>
                  
                  {inCart > 0 && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                      {inCart}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuContainer;
