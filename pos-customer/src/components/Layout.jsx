import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useCartStore from "../store/cartStore";
import logo from "../assets/annamay-logo.svg";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const isCartPage = location.pathname === "/cart";
  const isSuccessPage = location.pathname === "/order-success";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src={logo} alt="Annamay" className="h-9 w-9 rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-white">
              Anna<span className="text-brand-500">may</span>
            </span>
          </button>

          {!isSuccessPage && (
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700/60 text-white px-4 py-2 rounded-full transition-colors"
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-gray-900 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating Cart Bar (mobile) — only on Menu page when cart has items */}
      {!isCartPage && !isSuccessPage && totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:hidden">
          <button
            onClick={() => navigate("/cart")}
            className="w-full flex items-center justify-between bg-brand-500 text-gray-900 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-brand-500/30"
          >
            <span>{totalItems} item{totalItems !== 1 ? "s" : ""} added</span>
            <span className="flex items-center gap-1">
              View Cart <ShoppingCart size={18} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
