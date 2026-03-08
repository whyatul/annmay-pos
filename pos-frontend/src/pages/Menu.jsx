import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector, useDispatch } from "react-redux";

const Menu = () => {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const cartData = useSelector((state) => state.cart) || [];
  const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    document.title = "Annamay | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="bg-[#141414] h-full overflow-hidden flex relative">
      {/* Left — Menu Browser */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 shadow-[-10px_0_15px_rgba(0,0,0,0.03)] rounded-l-3xl">
        <MenuContainer />
      </div>

      {/* Floating cart button when closed */}
      {!isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="absolute bottom-8 right-8 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-4 shadow-2xl flex items-center justify-center z-50 transition-all transform hover:scale-105"
        >
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#141414]">
              {totalItems}
            </span>
          )}
        </button>
      )}

      {/* Right — Cart Panel (Overlay or Side panel like reference) */}
      {isCartOpen && (
        <div className="w-[340px] bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-[-4px_0_15px_rgba(0,0,0,0.02)] z-20 transition-all duration-300">
        
        {/* Header of Cart */}
        <div className="px-6 py-6 pb-2">
           <div className="flex items-center justify-between mb-1">
             <h2 className="text-xl font-bold text-gray-100">My Order</h2>
             <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full border border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"><FaTimes size={14} /></button>
           </div>
           <p className="text-sm text-gray-500 font-medium">
             {customerData.orderType || "Take out"} · {customerData.customerName || "Walk-in"}
           </p>
        </div>

        <div className="flex-1 overflow-hidden relative px-2">
          <CartInfo />
        </div>
        
        <div className="px-6 pt-4 pb-6 bg-gray-900 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Bill />
        </div>
      </div>
      )}
    </section>
  );
};

export default Menu;
