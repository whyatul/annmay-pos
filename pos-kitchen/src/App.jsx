import { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Utensils, LayoutGrid } from 'lucide-react';
import annamayLogo from './assets/annamay-logo.svg';

const API_BASE = 'http://localhost:8000/api';
const SOCKET_URL = 'http://localhost:8000';

function App() {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [crossedItems, setCrossedItems] = useState({}); // { [orderId_itemIndex]: boolean }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/order/kitchen/active`);
        if (res.data && res.data.data) {
          const active = res.data.data.filter(o => o.orderStatus !== 'Completed');
          setOrders(active);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();

    const socket = io(SOCKET_URL);
    socket.on("orderUpdated", (updatedOrder) => {
      if (updatedOrder.orderStatus === 'Completed' || updatedOrder.orderStatus === 'Cancelled') {
        setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
      } else {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    });
    socket.on("newOrder", (order) => {
      setOrders(prev => [...prev, order]);
      const audio = new Audio('/bell.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    });

    return () => socket.disconnect();
  }, []);

  // Update time every minute to refresh elapsed time displays
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const markReady = async (id) => {
    try {
      await axios.put(`${API_BASE}/order/kitchen/${id}/status`, { orderStatus: 'Completed' });
      setOrders(prev => prev.filter(o => o.id !== id));
      
      // cleanup crossed items for this order
      setCrossedItems(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (key.startsWith(`${id}_`)) delete next[key];
        });
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleItemStrikethrough = (orderId, itemIndex) => {
    setCrossedItems(prev => {
       const key = `${orderId}_${itemIndex}`;
       return { ...prev, [key]: !prev[key] };
    });
  };

  const getUrgencyColor = (dateString) => {
    if (!dateString) return 'bg-emerald-500';
    const mins = differenceInMinutes(currentTime, new Date(dateString));
    if (mins >= 20) return 'bg-red-600';
    if (mins >= 10) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getUrgencyBg = (dateString) => {
    if (!dateString) return 'from-emerald-900/40 to-slate-800';
    const mins = differenceInMinutes(currentTime, new Date(dateString));
    if (mins >= 20) return 'from-red-900/40 to-slate-800 border-red-500/50 shadow-red-900/20';
    if (mins >= 10) return 'from-amber-900/40 to-slate-800 border-amber-500/50 shadow-amber-900/20';
    return 'from-emerald-900/40 to-slate-800 border-emerald-500/20 shadow-emerald-900/10';
  };

  // Sort orders: oldest orders first
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return new Date(a.orderDate || a.createdAt) - new Date(b.orderDate || b.createdAt);
    });
  }, [orders, currentTime]); // force re-sort occasionally if needed

  return (
    <div className="h-screen w-full flex flex-col bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-20 shrink-0 bg-slate-900 border-b border-slate-700/50 flex justify-between items-center px-6 lg:px-10 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-orange-500/30 overflow-hidden">
            <img src={annamayLogo} alt="Annamay" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              Kitchen Display
            </h1>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
               <span className="text-sm font-semibold text-slate-300">{'<'} 10m Target</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
               <span className="text-sm font-semibold text-slate-300">10-20m Warning</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
               <span className="text-sm font-semibold text-slate-300">{'>'} 20m Critical</span>
             </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-sm font-medium text-slate-400">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-6 pb-4">
          {sortedOrders.length === 0 ? (
            <div className="w-full h-full flex flex-col justify-center items-center text-slate-500 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
                <Utensils size={40} className="opacity-40" />
              </div>
              <p className="text-2xl font-bold text-slate-400 mb-2">Kitchen is all caught up!</p>
              <p className="text-slate-500">Waiting for new orders from the floor...</p>
            </div>
          ) : (
            sortedOrders.map((order, idx) => {
               const timeKey = order.orderDate || order.createdAt;
               const urgencyColor = getUrgencyColor(timeKey);
               const isCritical = differenceInMinutes(currentTime, new Date(timeKey)) >= 20;

               return (
                <div 
                  key={order.id} 
                  // Adding a generic slide-in wrapper, plus the flash animation if it's super new
                  className={`flex-shrink-0 w-[360px] md:w-[400px] h-full flex flex-col rounded-3xl bg-gradient-to-b ${getUrgencyBg(timeKey)} border transform transition-all duration-300 hover:shadow-2xl ${idx === sortedOrders.length - 1 ? 'animate-in slide-in-from-bottom-8' : ''}`}
                >
                  <div className={`p-5 rounded-t-3xl border-b border-white/5 relative overflow-hidden`}>
                    {/* Urgency Top Bar Indicator */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${urgencyColor}`}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter drop-shadow-md">
                          TABLE {order.tableId || order.Table?.tableNo || 'N/A'}
                        </h2>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 bg-slate-900/60 rounded-lg text-sm font-medium text-slate-300 border border-slate-700/50">
                          <LayoutGrid size={14} className="text-orange-400" />
                          Order #{order.id}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-white shadow-lg ${urgencyColor} ${isCritical ? 'animate-pulse' : ''}`}>
                          <Clock size={16} className={isCritical ? 'animate-spin-slow' : ''} />
                          {differenceInMinutes(currentTime, new Date(timeKey))} min
                        </div>
                        <span className="text-xs font-semibold text-slate-400 mt-2">
                           {formatDistanceToNow(new Date(timeKey), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-slate-800/80 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 border border-slate-700/50">
                         {order.orderType || 'Dine-in'}
                       </span>
                       <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                         {order.paymentStatus || 'Pending'}
                       </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                      {order.items?.map((item, index) => {
                        const isCrossed = crossedItems[`${order.id}_${index}`];
                        return (
                          <div 
                            key={index} 
                            onClick={() => toggleItemStrikethrough(order.id, index)}
                            className={`group relative flex items-start gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border
                              ${isCrossed 
                                ? 'bg-slate-800/40 border-slate-800/50 opacity-50' 
                                : 'bg-slate-800/80 border-slate-600/30 hover:border-orange-500/40 hover:bg-slate-750 shadow-sm'
                              }`}
                          >
                             <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0
                               ${isCrossed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-slate-600 text-transparent group-hover:border-orange-500/50'}
                             `}>
                               {isCrossed && <CheckCircle2 size={18} strokeWidth={3} />}
                             </div>
                             
                             <div className="flex-1 pt-0.5 relative">
                                <div className={`flex justify-between items-start ${isCrossed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                  <span className="text-[17px] font-bold leading-tight">{item.name}</span>
                                  <span className="text-xl font-black tabular-nums bg-slate-900/50 px-2.5 py-0.5 rounded-lg border border-slate-700">
                                    x{item.quantity}
                                  </span>
                                </div>
                                {item.notes && (
                                  <p className="text-sm font-medium text-amber-400 mt-1 flex items-center gap-1.5">
                                    <AlertCircle size={14} /> {item.notes}
                                  </p>
                                )}
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-5 pt-0 mt-auto">
                    <button 
                      onClick={() => markReady(order.id)}
                      className="w-full relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl tracking-wider uppercase py-5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 active:translate-y-0 flex justify-center items-center gap-3"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <CheckCircle2 size={24} strokeWidth={2.5} />
                        Mark Ready
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>
                  </div>
                </div>
               );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
