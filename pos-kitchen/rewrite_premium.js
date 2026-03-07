const fs = require('fs');

const appContent = `import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTable } from './store';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Success from './pages/Success';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableId = params.get('table');
    if (tableId) {
      dispatch(setTable(tableId));
    }
  }, [location, dispatch]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FDFCF8] flex flex-col relative md:shadow-2xl md:shadow-zinc-200 overflow-x-hidden font-sans selection:bg-zinc-800 selection:text-white pb-safe">
      <header className="bg-white/90 backdrop-blur-xl px-5 md:px-8 h-[80px] z-30 sticky top-0 flex items-center justify-between shrink-0 border-b border-zinc-200 w-full">
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-serif text-zinc-900 tracking-wider">
            ANNAMAY
          </h1>
          <p className="text-[9px] uppercase text-zinc-500 tracking-[0.25em] font-medium mt-1">Culinary Excellence</p>
        </div>
        
        <div className="flex px-4 py-2 border-b border-zinc-300">
          <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-semibold">Table Order</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-4">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
`;
fs.writeFileSync('pos-customer/src/App.jsx', appContent);

let menuContent = fs.readFileSync('pos-customer/src/pages/Menu.jsx', 'utf-8');

// Replace standard stuff with premium styles
menuContent = menuContent.replace(/bg-orange-600 text-white/g, 'bg-zinc-900 text-white');
menuContent = menuContent.replace(/border-orange-600/g, 'border-zinc-900');
menuContent = menuContent.replace(/ring-orange-50/g, 'ring-zinc-100');
menuContent = menuContent.replace(/hover:border-orange-300/g, 'hover:border-zinc-400');
menuContent = menuContent.replace(/hover:bg-orange-50/g, 'hover:bg-zinc-50');
menuContent = menuContent.replace(/border-orange-100/g, 'border-zinc-200');
menuContent = menuContent.replace(/bg-orange-50/g, 'bg-zinc-50');
menuContent = menuContent.replace(/text-orange-600/g, 'text-zinc-900');
menuContent = menuContent.replace(/hover:bg-orange-600/g, 'hover:bg-zinc-900');
menuContent = menuContent.replace(/hover:text-white/g, 'hover:text-white');
menuContent = menuContent.replace(/from-orange-600 to-orange-500/g, 'from-zinc-900 to-zinc-800');
menuContent = menuContent.replace(/shadow-orange-600\/30/g, 'shadow-zinc-900/20');
menuContent = menuContent.replace(/hover:bg-orange-700/g, 'hover:bg-zinc-700');
menuContent = menuContent.replace(/active:bg-orange-800/g, 'active:bg-zinc-800');
menuContent = menuContent.replace(/text-orange-100/g, 'text-zinc-300');
menuContent = menuContent.replace(/border-orange-600/g, 'border-zinc-900');

// Structure tweaks in Menu
menuContent = menuContent.replace(/bg-gray-50/g, 'bg-transparent');
menuContent = menuContent.replace(/bg-gray-100/g, 'bg-zinc-100');
menuContent = menuContent.replace(/text-gray-900/g, 'text-zinc-900');
menuContent = menuContent.replace(/text-gray-500/g, 'text-zinc-500');
menuContent = menuContent.replace(/border-gray-200/g, 'border-zinc-200');
menuContent = menuContent.replace(/border-gray-100/g, 'border-zinc-100');
menuContent = menuContent.replace(/rounded-3xl/g, 'rounded-xl');
menuContent = menuContent.replace(/rounded-2xl/g, 'rounded-none');
menuContent = menuContent.replace(/font-extrabold/g, 'font-semibold');
menuContent = menuContent.replace(/font-black/g, 'font-bold font-serif');

// Tweak search bar
menuContent = menuContent.replace(/rounded-none py-3/g, 'rounded-sm py-4');

fs.writeFileSync('pos-customer/src/pages/Menu.jsx', menuContent);

let cartContent = fs.readFileSync('pos-customer/src/pages/Cart.jsx', 'utf-8');
cartContent = cartContent.replace(/bg-orange-600/g, 'bg-zinc-900');
cartContent = cartContent.replace(/text-orange-600/g, 'text-zinc-900');
cartContent = cartContent.replace(/bg-orange-50/g, 'bg-zinc-50');
cartContent = cartContent.replace(/border-orange-200/g, 'border-zinc-300');
cartContent = cartContent.replace(/border-orange-100/g, 'border-zinc-200');
cartContent = cartContent.replace(/hover:bg-orange-100/g, 'hover:bg-zinc-100');
cartContent = cartContent.replace(/hover:bg-orange-700/g, 'hover:bg-zinc-800');
cartContent = cartContent.replace(/bg-gray-50/g, 'bg-[#FDFCF8]');
cartContent = cartContent.replace(/rounded-3xl/g, 'rounded-xl');
fs.writeFileSync('pos-customer/src/pages/Cart.jsx', cartContent);

