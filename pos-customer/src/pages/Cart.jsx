import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Leaf,
  Drumstick,
  User,
  Phone,
  Users,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import { placeOrder } from "../api";

const TAX_RATE = 5; // GST %

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  const [form, setForm] = useState({ name: "", phone: "", guests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = getTotal();
  const tax = (total * TAX_RATE) / 100;
  const grandTotal = total + tax;

  const handleQuantity = (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) removeItem(id);
    else updateQuantity(id, newQty);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty!");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerDetails: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          guests: Number(form.guests) || 1,
        },
        orderStatus: "In Progress",
        orderType: "Dine In",
        bills: {
          total,
          tax,
          totalWithTax: grandTotal,
        },
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          pricePerQuantity: i.pricePerQuantity,
          price: i.price,
        })),
        table: null,
        paymentMethod: "Cash",
      };

      await placeOrder(payload);
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Order failed", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-gray-700 mb-4" size={56} />
        <h2 className="text-xl font-bold text-gray-300">Your cart is empty</h2>
        <p className="text-gray-500 mt-1 mb-6">Browse the menu and add some delicious dishes!</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-brand-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors"
        >
          <ArrowLeft size={18} /> Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to menu
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-gray-900 border border-gray-800/60 rounded-2xl p-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                {item.isVeg ? (
                  <Leaf size={12} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <Drumstick size={12} className="text-red-400 flex-shrink-0" />
                )}
                <span className="text-white font-medium text-sm truncate">{item.name}</span>
              </div>
              <p className="text-brand-400 font-bold text-sm">₹{item.pricePerQuantity} each</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuantity(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center font-bold text-white text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantity(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-500 text-gray-900 hover:bg-brand-600 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right w-16 flex-shrink-0">
              <p className="text-white font-bold text-sm">₹{item.price}</p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Bill Summary */}
      <div className="bg-gray-900 border border-gray-800/60 rounded-2xl p-5 mb-8">
        <h3 className="text-white font-bold mb-4">Bill Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-gray-200">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>GST ({TAX_RATE}%)</span>
            <span className="text-gray-200">₹{tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between text-white font-bold text-base">
            <span>Total</span>
            <span className="text-brand-400">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Details Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-5">
        <h3 className="text-white font-bold text-lg">Your Details</h3>

        <div className="space-y-3">
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full bg-gray-900 border border-gray-800 text-gray-200 pl-11 pr-4 py-3 rounded-2xl outline-none placeholder:text-gray-500 text-sm focus:border-brand-500/60 transition-colors"
            />
          </div>

          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
              maxLength={10}
              className="w-full bg-gray-900 border border-gray-800 text-gray-200 pl-11 pr-4 py-3 rounded-2xl outline-none placeholder:text-gray-500 text-sm focus:border-brand-500/60 transition-colors"
            />
          </div>

          <div className="relative">
            <Users
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="number"
              placeholder="Number of guests"
              value={form.guests}
              onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
              min={1}
              max={20}
              className="w-full bg-gray-900 border border-gray-800 text-gray-200 pl-11 pr-4 py-3 rounded-2xl outline-none placeholder:text-gray-500 text-sm focus:border-brand-500/60 transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-gray-900 font-bold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingBag size={18} /> Place Order — ₹{grandTotal.toFixed(2)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Cart;
