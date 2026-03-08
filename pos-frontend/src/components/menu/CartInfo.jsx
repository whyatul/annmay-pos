import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleIncrement = (item) => {
    if (item.quantity >= 20) return;
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) {
      dispatch(removeItem(item.id));
      return;
    }
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
  };

  return (
    <div className="h-full flex flex-col pt-2 pb-2">
      <div
        className="overflow-y-auto scrollbar-hide flex-1 space-y-3 px-4"
        ref={scrollRef}
      >
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <p className="text-xs">No items currently</p>
          </div>
        ) : (
          cartData.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-gray-900 p-2"
            >
              {/* Image placeholder for cart */}
               <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 border border-gray-800">
                  🍔
               </div>
               
               <div className="flex-1 min-w-0 pr-2">
                  <h2 className="text-gray-100 text-sm font-bold truncate">
                    {item.name}
                  </h2>
                  <p className="text-amber-600 text-xs font-bold mt-0.5">
                    ₹{item.pricePerQuantity}
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-800 rounded-full border border-gray-700 shadow-sm shrink-0">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="text-gray-500 w-7 h-7 flex items-center justify-center hover:bg-gray-700 hover:text-amber-600 rounded-full transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="text-gray-200 text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="text-gray-500 w-7 h-7 flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 rounded-full transition-colors text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;
