import React, { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMenuItems, getOrders } from "../../https/index";

const PopularDishes = () => {
  const { data: menuData } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    placeholderData: keepPreviousData,
  });

  const { data: orderData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  // Algorithm to track Best Selling Items
  const bestSellingDishes = useMemo(() => {
    const menuItems = menuData?.data?.menuItems || [];
    const orders = orderData?.data?.data || [];
    
    const itemSales = {};

    orders.forEach(order => {
      // Look at completed orders only, if applicable. Assume all for now.
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (itemSales[item.id]) {
            itemSales[item.id] += Number(item.quantity) || 1;
          } else {
            itemSales[item.id] = Number(item.quantity) || 1;
          }
        });
      }
    });

    const itemsWithSales = menuItems.map(menuItem => ({
      ...menuItem,
      totalSold: itemSales[menuItem.id] || 0
    }));

    // Sort by total sold descending
    return itemsWithSales.sort((a, b) => b.totalSold - a.totalSold).slice(0, 15);
  }, [menuData, orderData]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#222]">
        <h1 className="text-[#f5f5f5] text-sm font-semibold uppercase tracking-wider">
          Best Selling
        </h1>
        <span className="text-xs text-[#666] bg-[#222] px-2.5 py-1 rounded-full">
          {bestSellingDishes.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {bestSellingDishes.map((dish, index) => (
          <div
            key={dish.id}
            className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a] last:border-0"
          >
            <span className="text-[#333] text-xs font-mono w-5 text-right">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f6b100]/20 to-[#f6b100]/5 flex items-center justify-center">
              <span className={`w-2 h-2 rounded-sm ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[#e0e0e0] text-sm font-medium truncate">{dish.name}</h1>
              <p className="text-xs text-[#666]">{dish.totalSold > 0 ? `${dish.totalSold} sold` : 'No sales yet'}</p>
            </div>
            <span className="text-[#f6b100] text-sm font-semibold flex-shrink-0">₹{dish.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDishes;
