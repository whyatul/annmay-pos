const fs = require('fs');

const cartContent = `
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart, setOrderType } from '../store';
import { FiArrowLeft, FiUser, FiPhone, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api';

export default function Cart() {
  const { items, orderType } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [table, setTable] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PhonePe UPI / Card');

  useEffect(() => {
    const scannedTable = localStorage.getItem('scannedTable');
    if (scannedTable) setTable(scannedTable);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }
    if (!name || (!phone && orderType === 'Takeaway')) {
      alert("Please enter Name and Phone");
      return;
    }
    if (orderType === 'Dine In' && !table) {
      alert("Please enter a Table Number");
      return;
    }

    setLoading(true);

    try {
      // Initiate PhonePe
      if (paymentMethod === 'PhonePe UPI / Card') {
         const res = await axios.post(\`\${API_BASE}/payment/phonepe/initiate\`, {
           amount: total,
           customerName: name,
           customerPhone: phone || "GUEST",
         });
         
         if (res.data.success && res.data.redirectUrl) {
            // First we place order
            await placeOrderBackend(res.data.merchantTransactionId);
            window.location.href = res.data.redirectUrl;
         } else {
            // Fallback
            await placeOrderBackend(null);
            navigate('/success');
         }
      } else {
         await placeOrderBackend(null);
         navigate('/success');
      }
    } catch (err) {
      console.error("Checkout error:", err);
      // Fallback
      await placeOrderBackend(null);
      navigate('/success');
    } finally {
      setLoading(false);
    }
  };

  const placeOrderBackend = async (txnId) => {
    const payload = {
      customerDetails: { name, phone, guests: 1 },
      orderStatus: "In Progress",
      orderType,
      bills: { total: subtotal, tax, totalWithTax: total },
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      table: table || null,
      paymentMethod,
      paymentData: txnId ? { phonepe_transaction_id: txnId } : undefined,
    };
    
    await axios.post(\`\${API_BASE}/order/customer\`, payload);
    if (!txnId) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-68px)]">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiShoppingCart size={32} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/20 active:scale-95"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 min-h-[calc(100vh-68px)]">
      
      {/* Left Column: Details */}
      <div className="flex-1 flex flex-col gap-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 font-semibold max-w-max hover:text-gray-900 transition-colors">
          <FiArrowLeft size={18} /> Back to Menu
        </button>
        
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
           
           <div className="flex gap-4 mb-8">
             <button 
                onClick={() => dispatch(setOrderType('Dine In'))}
                className={\`flex-1 py-4 rounded-2xl font-bold border-2 transition-all \${
                  orderType === 'Dine In'
                    ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-inner'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }\`}
             >
               Dine In
             </button>
             <button 
                onClick={() => dispatch(setOrderType('Takeaway'))}
                className={\`flex-1 py-4 rounded-2xl font-bold border-2 transition-all \${
                  orderType === 'Takeaway'
                    ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-inner'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }\`}
             >
               Takeaway
             </button>
           </div>
           
           <div className="space-y-5">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
               <div className="relative">
                 <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe"
                   className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                 />
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
                
                {orderType === 'Dine In' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                       Table Number
                       {localStorage.getItem('scannedTable') && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px]">Scanned</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                      <input 
                        type="number" value={table} onChange={e => setTable(e.target.value)} placeholder="Table No."
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                        disabled={!!localStorage.getItem('scannedTable')}
                      />
                    </div>
                  </div>
                )}
             </div>
             
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Payment Method</label>
               <div className="flex flex-col gap-3">
                 <label className="flex items-center gap-3 p-4 border border-orange-200 bg-orange-50/50 rounded-2xl cursor-pointer">
                   <input type="radio" checked={paymentMethod === 'PhonePe UPI / Card'} onChange={() => setPaymentMethod('PhonePe UPI / Card')} className="w-5 h-5 text-orange-600 focus:ring-orange-500 accent-orange-500" />
                   <div className="flex-1 font-bold text-gray-900">Online - PhonePe <span className="block text-xs text-gray-500 font-medium mt-0.5">UPI, Credit/Debit Cards, NetBanking</span></div>
                 </label>
                 <label className="flex items-center gap-3 p-4 border border-gray-100 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors">
                   <input type="radio" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} className="w-5 h-5 text-orange-600 focus:ring-orange-500 accent-orange-500" />
                   <div className="flex-1 font-bold text-gray-900">Cash / Pay at Counter <span className="block text-xs text-gray-500 font-medium mt-0.5">Pay physically to the cashier</span></div>
                 </label>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:w-[400px] shrink-0">
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar mb-6 -mx-2 px-2">
            <AnimatePresence>
              {items.map(item => (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  key={item.id} 
                  className="flex gap-4 items-center bg-white border border-gray-50 rounded-2xl p-3 shadow-sm"
                >
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img 
                        src={item.image ? \`http://localhost:8000\${item.image}\` : \`https://ui-avatars.com/api/?name=\${encodeURIComponent(item.name)}&background=f97316&color=fff&size=128\`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(item.name)}&background=f97316&color=fff&size=128\` }}
                      />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h4>
                      <span className="font-bold text-orange-600 text-sm">₹{item.price}</span>
                   </div>
                   <div className="flex flex-col items-center bg-gray-50 rounded-lg p-1 shrink-0">
                     <button onClick={() => dispatch(addToCart(item))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600"><FiPlus size={14}/></button>
                     <span className="text-xs font-bold py-1 min-w-[20px] text-center">{item.quantity}</span>
                     <button onClick={() => dispatch(removeFromCart(item.id))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600"><FiMinus size={14}/></button>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
            <div className="flex justify-between text-gray-500 font-medium text-sm">
               <span>Subtotal</span>
               <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium text-sm">
               <span>Taxes (5%)</span>
               <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-900 font-bold text-xl pt-3">
               <span>Total</span>
               <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-8 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Place Order <FiArrowLeft className="rotate-180" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Ensure an import for FiShoppingCart exists
// FiShoppingCart needs to be added to react-icons/fi import
`

let updatedCartContent = cartContent.replace(
  "import { FiArrowLeft, FiUser, FiPhone, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';", 
  "import { FiArrowLeft, FiUser, FiPhone, FiMinus, FiPlus, FiCreditCard, FiShoppingCart } from 'react-icons/fi';"
);

fs.writeFileSync('pos-customer/src/pages/Cart.jsx', updatedCartContent);
console.log("Cart page rewritten fully!");
