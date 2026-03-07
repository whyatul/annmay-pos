const fs = require('fs');
const content = `
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiPlusCircle, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [eta, setEta] = useState(25);
  
  const txnId = searchParams.get('txn');
  const { orderId, stateEta } = location.state || {};
  
  const displayId = txnId ? txnId.slice(-6).toUpperCase() : (orderId ? orderId.toString().slice(-6).toUpperCase() : Math.floor(Math.random()*90000 + 10000));

  useEffect(() => {
    if (stateEta) setEta(stateEta);
    else setEta(Math.floor(Math.random() * 15) + 15); // Random ETA between 15-30 mins
  }, [stateEta]);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-4 lg:p-8 min-h-[calc(100vh-68px)] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="z-10 bg-white p-6 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 w-full max-w-md text-center"
      >
         <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.2, type: "spring" }}
           className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50/50"
         >
            <FiCheckCircle size={48} strokeWidth={2.5} />
         </motion.div>
         
         <h1 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Order Placed!</h1>
         
         <p className="text-gray-500 mb-8 leading-relaxed">
           Your order <strong className="text-gray-900 border-b border-gray-300 border-dashed pb-0.5">#{displayId}</strong> has been received by the kitchen and is being prepared.
         </p>
         
         <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex items-center gap-5 text-left shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
               <FiClock size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-orange-800/60 uppercase tracking-wider mb-1">Estimated Prep Time</p>
               <p className="text-2xl font-black text-orange-600 font-serif">{eta} <span className="text-lg font-medium">mins</span></p>
            </div>
         </div>

         <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-wide shadow-xl shadow-gray-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FiPlusCircle size={20} /> Add More Items
            </button>
            <p className="text-xs text-gray-400 font-medium px-4">Mid-meal? You can add items seamlessly to your existing table order.</p>
         </div>
      </motion.div>
    </div>
  );
}
`
fs.writeFileSync('pos-customer/src/pages/Success.jsx', content);
