import os

menu_code = """
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMinus, FiPlus, FiInfo } from 'react-icons/fi';

const API_BASE = 'http://localhost:8000/api';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // QR Code feature: Catch table from URL
  useEffect(() => {
    const tableId = searchParams.get('table');
    if (tableId) {
      localStorage.setItem('currentTable', tableId);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          axios.get(`${API_BASE}/category`),
          axios.get(`${API_BASE}/menu-item`),
        ]);
        setCategories(catRes.data.categories || []);
        
        // Enrich items with fake images, allergens if needed
        const enrichedItems = (itemRes.data.menuItems || []).map(i => ({
          ...i,
          image: i.imageUrl || `https://source.unsplash.com/400x300/?${encodeURIComponent(i.name.split(' ')[0] + ' food')}`,
          allergens: i.allergens || (Math.random() > 0.7 ? ['Nuts', 'Dairy'] : [])
        }));
        
        setItems(enrichedItems);
        setActiveCategory(null);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCartItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const existingOrder = localStorage.getItem('currentOrderId');

  const filteredItems = items.filter(i => {
    const matchesCat = activeCategory === null ? true : i.categoryId === activeCategory;
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return search ? matchesSearch : matchesCat;
  });

  const getQuantity = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const getCategoryCount = (catId) => items.filter(i => i.categoryId === catId).length;

  const groupedItems = {};
  filteredItems.forEach(item => {
    const cat = categories.find(c => c.id === item.categoryId);
    const catName = cat?.name || 'Other';
    if (!groupedItems[catName]) groupedItems[catName] = [];
    groupedItems[catName].push(item);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full relative font-sans">
      {/* Header Area */}
      <div className="bg-white px-4 md:px-8 pt-6 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Our Menu</h1>
            {existingOrder && <p className="text-sm text-green-600 font-medium tracking-wide mt-1">Adding to existing order ✓</p>}
          </div>
        </div>

        <div className="relative max-w-3xl w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100/80 border-transparent rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all placeholder:text-gray-500 font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      {!search && (
        <div className="px-4 md:px-8 py-3 bg-white border-b border-gray-100 flex gap-3 overflow-x-auto no-scrollbar sticky top-[110px] z-30">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeCategory === null
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-500'
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeCategory === c.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-500/50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      <div className="flex-1 w-full px-4 md:px-8 py-6 pb-40">
         {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-amber-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-6xl mb-4 opacity-30">🍽️</p>
              <h2 className="text-xl font-bold text-gray-800">No dishes found</h2>
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {Object.entries(groupedItems).map(([catName, catItems]) => (
                <div key={catName} className="mb-8">
                  {(activeCategory === null || search) && (
                    <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight capitalize">{catName}</h2>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catItems.map(item => {
                      const qty = getQuantity(item.id);
                      return (
                        <div key={item.id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                          {/* Image */}
                          <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-gray-100">
                             {/* Uses actual photo URL if real */}
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'; }} />
                             {/* Veg/Non-veg on top of image */}
                             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
                               <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                               </div>
                             </div>
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 flex flex-col py-1">
                             <h3 className="font-bold text-gray-900 leading-tight mb-1 text-[15px]">{item.name}</h3>
                             {item.description && (
                               <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{item.description}</p>
                             )}
                             
                             {item.allergens && item.allergens.length > 0 && (
                               <div className="flex gap-1 mb-2">
                                 {item.allergens.map((alg, i) => (
                                   <span key={i} className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 flex items-center gap-0.5"><FiInfo size={8}/>{alg}</span>
                                 ))}
                               </div>
                             )}

                             <div className="mt-auto flex items-center justify-between">
                                <span className="font-extrabold text-gray-900">₹{item.price}</span>
                                
                                {qty === 0 ? (
                                  <button
                                    onClick={() => dispatch(addToCart(item))}
                                    className="px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 font-bold rounded-lg text-sm hover:bg-amber-500 hover:text-white transition-all"
                                  >
                                    ADD
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1 bg-amber-500 rounded-lg p-0.5 shadow-sm">
                                    <button onClick={() => dispatch(removeFromCart(item.id))} className="w-7 h-7 flex items-center justify-center text-white hover:bg-amber-600 rounded-md transition-colors"><FiMinus size={14} /></button>
                                    <span className="w-5 text-center text-white text-sm font-bold">{qty}</span>
                                    <button onClick={() => dispatch(addToCart(item))} className="w-7 h-7 flex items-center justify-center text-white hover:bg-amber-600 rounded-md transition-colors"><FiPlus size={14} /></button>
                                  </div>
                                )}
                             </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Floating Cart */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-900 hover:bg-black text-white p-4 rounded-2xl font-bold flex justify-between items-center shadow-2xl active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FiShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">{totalCartItems}</span>
                </div>
                <div className="flex flex-col items-start border-l border-white/20 pl-4">
                  <span className="text-sm font-semibold text-gray-300">Total</span>
                  <span className="text-xl font-black">₹{totalCartValue}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-amber-500 text-gray-900 px-5 py-2.5 rounded-xl font-black uppercase text-sm">
                View Cart &rarr;
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"""

cart_code = """
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart, addToCart, removeFromCart } from '../store';
import { FiArrowLeft, FiMinus, FiPlus, FiClock } from 'react-icons/fi';

const API_BASE = 'http://localhost:8000/api';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');

  const totalValue = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const taxes = Math.round(totalValue * 0.05);
  const grandTotal = totalValue + taxes;
  const estimatedTime = 20 + cartItems.length * 2; // Rough estimate based on items

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    const tableNo = localStorage.getItem('currentTable') || "Guest";
    const existingOrderId = localStorage.getItem('currentOrderId');

    const orderData = {
      tableNo: tableNo,
      items: cartItems.map((i) => ({ menuItemId: i.id, quantity: i.quantity, price: i.price, name: i.name })),
      totalAmount: grandTotal,
      paymentMethod: paymentMethod === 'phonepe' ? 'UPI' : 'Card',
      status: 'Pending',
      existingOrderId: existingOrderId // For adding mid-meal
    };

    try {
      // Create order
      const res = await axios.post(`${API_BASE}/order`, orderData);
      const newOrder = res.data.order;
      
      // Save order id for adding items later
      localStorage.setItem('currentOrderId', newOrder.id || newOrder._id || 'ORD123');
      
      dispatch(clearCart());
      
      // Open PhonePe generic flow or success directly
      if (paymentMethod === 'phonepe') {
         // Mock phonepe / PG redirect
         setTimeout(() => {
           navigate('/success', { state: { orderId: newOrder.id || 'ORD123', eta: estimatedTime } });
         }, 1000);
      } else {
         navigate('/success', { state: { orderId: newOrder.id || 'ORD123', eta: estimatedTime } });
      }

    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
           <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything yet. Let's fix that!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 text-gray-900 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide w-full max-w-sm shadow-md shadow-amber-500/30"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans flex flex-col">
      <div className="bg-white px-4 py-5 shadow-sm sticky top-0 z-40 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <FiArrowLeft size={20} className="text-gray-700"/>
        </button>
        <h1 className="text-xl font-black text-gray-900">Checkout</h1>
      </div>

      <div className="p-4 md:p-6 md:max-w-3xl md:mx-auto w-full flex-1">
        
        {/* Estimated Time Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <FiClock className="text-amber-600 mt-1" size={20} />
          <div>
             <h3 className="font-bold text-amber-900">Estimated Prep Time: {estimatedTime} mins</h3>
             <p className="text-sm text-amber-700 mt-0.5">We prepare your food fresh to order!</p>
          </div>
        </div>

        {/* Selected Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 uppercase tracking-widest text-xs mb-4 border-b pb-3">Your Items</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-2">
                
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs font-bold text-gray-500">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-inner">
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="w-7 h-7 flex items-center justify-center text-gray-700 bg-white rounded shadow-sm"><FiMinus size={14} /></button>
                  <span className="w-5 text-center text-gray-900 text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => dispatch(addToCart(item))} className="w-7 h-7 flex items-center justify-center text-gray-700 bg-white rounded shadow-sm"><FiPlus size={14} /></button>
                </div>
                
                <div className="w-16 text-right font-bold text-gray-900 text-sm">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/')} className="mt-5 w-full py-2.5 bg-amber-50 text-amber-700 font-bold rounded-xl text-sm border hover:bg-amber-100 transition-colors border-amber-200 border-dashed">
            + Add more items
          </button>
        </div>

        {/* Payment Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 uppercase tracking-widest text-xs mb-4 border-b pb-3">Pay Via</h2>
          <div className="flex flex-col gap-3">
             <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'phonepe' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
                <input type="radio" value="phonepe" checked={paymentMethod === 'phonepe'} onChange={() => setPaymentMethod('phonepe')} className="accent-purple-600" />
                <div className="flex-1 font-bold text-gray-900">PhonePe / UPI</div>
                <div className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded">FAST</div>
             </label>
             <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}`}>
                <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-amber-600" />
                <div className="font-bold text-gray-900">Credit / Debit Card</div>
             </label>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-gray-800 uppercase tracking-widest text-xs mb-3 border-b pb-3">Bill Details</h2>
          <div className="space-y-2 text-sm text-gray-600 font-medium pb-3 border-b border-dashed border-gray-200">
            <div className="flex justify-between"><span>Item Total</span><span>₹{totalValue}</span></div>
            <div className="flex justify-between"><span>Taxes & Charges</span><span>₹{taxes}</span></div>
          </div>
          <div className="flex justify-between items-center pt-3 font-black text-lg text-gray-900">
            <span>To Pay</span><span>₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white p-4.5 rounded-2xl font-bold flex justify-between items-center shadow-xl active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
          >
            <div className="flex flex-col items-start bg-white/10 px-4 py-1.5 rounded-lg">
               <span className="text-[10px] uppercase tracking-wider text-gray-300">Total</span>
               <span className="text-lg">₹{grandTotal}</span>
            </div>
            <span className="uppercase tracking-widest text-sm flex gap-2 items-center text-amber-400">
              {loading ? 'Processing...' : 'Place Order & Pay'} &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
"""

success_code = """
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiPlusCircle } from 'react-icons/fi';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, eta } = location.state || {}; // In a real app we'd fetch this using orderId check if empty.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden">
      
      {/* Success Confetti Effect (Simple CSS visual) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="z-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm">
         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiCheckCircle size={40} />
         </div>
         
         <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h1>
         <p className="text-gray-500 font-medium mb-6">Your order #{orderId?.slice(-6).toUpperCase() || '10293'} has been successfully placed by our kitchen.</p>

         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center gap-4 text-left shadow-sm">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
               <FiClock size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">Estimated Prep Time</p>
               <p className="text-xl font-black text-amber-900">{eta || 25} Minutes</p>
            </div>
         </div>

         <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-4 rounded-xl font-black uppercase tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FiPlusCircle size={20} /> Add more items
            </button>
            <p className="text-xs text-gray-400 font-medium mt-3">You can add items seamlessly to your existing table order!</p>
         </div>
      </div>
    </div>
  );
}
"""

with open("pos-customer/src/pages/Menu.jsx", "w") as f:
    f.write(menu_code)

with open("pos-customer/src/pages/Cart.jsx", "w") as f:
    f.write(cart_code)

with open("pos-customer/src/pages/Success.jsx", "w") as f:
    f.write(success_code)

print("Files rewritten successfully")
