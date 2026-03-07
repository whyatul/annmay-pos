const fs = require('fs');

const menuContent = `
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, setOrderType } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';

const API_BASE = 'http://localhost:8000/api/v1';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartItems = useSelector(state => state.cart.items);
  const orderType = useSelector(state => state.cart.orderType);

  const tableNoParam = searchParams.get('table');

  useEffect(() => {
    if (tableNoParam) {
      dispatch(setOrderType('Dine In'));
      localStorage.setItem('scannedTable', tableNoParam);
    }
  }, [tableNoParam, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          axios.get(\`\${API_BASE}/category\`),
          axios.get(\`\${API_BASE}/menuItem\`),
        ]);
        setCategories(catRes.data.categories || []);
        setItems(itemRes.data.menuItems || []);
        if (catRes.data.categories?.length > 0) {
          setActiveCategory(catRes.data.categories[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory ? item.categoryId === activeCategory : true;
      return searchQuery ? matchesSearch : matchesCat;
    });
  }, [items, activeCategory, searchQuery]);

  const cartTotalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[calc(100vh-68px)]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-68px)] bg-gray-50 pb-24 lg:pb-0 overflow-hidden">
      
      {/* Search & Categories Sidebar (Desktop) / Top nav (Mobile) */}
      <div className="lg:w-64 xl:w-72 bg-white flex flex-col border-r border-gray-100/80 shadow-sm z-10 shrink-0">
        <div className="p-4 lg:p-5 sticky top-[68px] bg-white z-20 shadow-sm lg:shadow-none">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-transparent rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {!searchQuery && (
          <div className="flex-1 overflow-x-auto lg:overflow-y-auto no-scrollbar scroll-smooth p-2 lg:p-4 pt-0 lg:pt-0">
            <div className="flex lg:flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={\`whitespace-nowrap flex-shrink-0 lg:w-full text-left px-5 lg:px-4 py-2.5 lg:py-3.5 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 relative overflow-hidden \${
                    activeCategory === cat.id
                      ? 'text-orange-600 bg-orange-50/80 lg:bg-orange-50 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }\`}
                >
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="activeCat" 
                      className="absolute inset-y-0 left-0 w-1 lg:w-1.5 bg-orange-500 rounded-r-full"
                    />
                  )}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:h-[calc(100vh-68px)] overflow-y-auto p-4 lg:p-8 scroll-smooth" id="menu-scroll">
        <div className="max-w-4xl mx-auto">
          {!searchQuery && (
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 font-serif px-1 sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-10">
              {categories.find(c => c.id === activeCategory)?.name || 'Menu'}
            </h2>
          )}
          {searchQuery && (
             <h2 className="text-xl font-bold text-gray-900 mb-6 px-1"> Search results for "{searchQuery}" </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const inCartItem = cartItems.find(i => i.id === item.id);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id}
                    className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Item Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={\`w-4 h-4 border-2 flex items-center justify-center rounded-sm shrink-0 \${item.isVeg ? 'border-green-600' : 'border-red-600'}\`}>
                          <div className={\`w-2 h-2 rounded-full \${item.isVeg ? 'bg-green-600' : 'bg-red-600'}\`} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">{item.name}</h3>
                      </div>
                      
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 flex-1">
                        {item.description || "Fresh and delicious dish prepared with the finest ingredients."}
                      </p>
                      
                      <div className="flex items-end justify-between mt-auto">
                        <span className="font-bold text-gray-900 text-lg">₹{item.price}</span>
                        
                        <div className="h-9">
                          {!inCartItem ? (
                            <button
                              onClick={() => dispatch(addToCart(item))}
                              className="px-5 py-1.5 h-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-bold rounded-xl border border-orange-200 transition-colors shadow-sm"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center bg-orange-500/10 border border-orange-200 rounded-xl overflow-hidden h-full shadow-sm">
                              <button onClick={() => dispatch(removeFromCart(item.id))} className="px-3 h-full text-orange-600 hover:bg-orange-500/20 transition-colors flex items-center justify-center">
                                <FiMinus size={14} strokeWidth={3} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900 bg-white h-full flex items-center justify-center border-x border-orange-200/50">
                                {inCartItem.quantity}
                              </span>
                              <button onClick={() => dispatch(addToCart(item))} className="px-3 h-full text-orange-600 hover:bg-orange-500/20 transition-colors flex items-center justify-center">
                                <FiPlus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden shadow-sm relative bg-gray-100">
                      <img 
                        src={item.image ? \`http://localhost:8000\${item.image}\` : \`https://ui-avatars.com/api/?name=\${encodeURIComponent(item.name)}&background=f97316&color=fff&size=128\`} 
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(item.name)}&background=f97316&color=fff&size=128\` }}
                      />
                      {!item.isVeg && (
                         <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur backdrop-blur-sm p-1 rounded-md shadow-sm">
                           <div className="w-3 h-3 border-2 border-red-600 flex items-center justify-center rounded-sm">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                           </div>
                         </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredItems.length === 0 && !loading && (
              <div className="col-span-1 sm:col-span-2 py-20 text-center flex flex-col items-center justify-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <FiSearch size={32} className="text-gray-300" />
                 </div>
                 <p className="text-lg font-medium text-gray-900 mb-1">No dishes found</p>
                 <p className="text-sm">Try searching for something else or exploring other categories.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart for Mobile */}
      <AnimatePresence>
        {cartTotalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 lg:hidden z-50 pointer-events-none"
          >
            <div className="bg-gray-900 text-white p-3 px-5 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
               <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">{cartTotalItems} item{cartTotalItems > 1 ? 's' : ''} added</span>
                  <span className="font-bold text-lg">₹{cartTotalAmount.toFixed(2)}</span>
               </div>
               <button 
                 onClick={() => navigate('/cart')}
                 className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl font-bold shrink-0 transition-colors shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2"
               >
                 View Cart <FiShoppingCart />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fixed Sticky Cart Summary for Desktop Sidebar Right */}
      {cartTotalItems > 0 && (
        <div className="hidden lg:flex w-80 bg-white border-l border-gray-100 flex-col overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.03)] z-20">
          <div className="p-6 bg-white border-b border-gray-50 shadow-sm shrink-0 flex justify-between items-center z-10">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <FiShoppingCart className="text-orange-500" /> Your Order
            </h3>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 text-xs font-bold rounded-full">{orderType}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/50">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id} 
                  className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 pr-2">{item.name}</h4>
                    <span className="font-bold text-orange-600 text-sm">₹{item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center flex-col justify-between items-end gap-2 bg-gray-50 rounded-xl p-1 shrink-0">
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm hover:text-orange-600">
                      <FiMinus size={12} />
                    </button>
                    <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => dispatch(addToCart(item))} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm hover:text-orange-600">
                      <FiPlus size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
             <div className="flex justify-between items-center mb-5 text-gray-500 text-sm font-medium">
               <span>Subtotal</span>
               <span className="text-gray-900">₹{cartTotalAmount.toFixed(2)}</span>
             </div>
             
             <button 
               onClick={() => navigate('/cart')}
               className="w-full bg-gray-900 hover:bg-black text-white px-4 py-4 rounded-2xl font-bold shadow-xl shadow-gray-900/20 transition-all flex items-center justify-between group active:scale-[0.98]"
             >
               <span>Checkout</span>
               <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                  &rarr;
               </span>
             </button>
          </div>
        </div>
      )}

    </div>
  );
}
`

fs.writeFileSync('pos-customer/src/pages/Menu.jsx', menuContent);
console.log("Menu page rewritten fully!");
