import { useState, useEffect } from "react";
import { Search, Plus, Minus, Leaf, Drumstick, ChevronRight } from "lucide-react";
import { getCategories, getMenuItems } from "../api";
import useCartStore from "../store/cartStore";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCatId, setActiveCatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { items: cartItems, addItem, removeItem, updateQuantity } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([getCategories(), getMenuItems()]);
        setCategories(catRes.data?.data?.categories || []);
        setMenuItems(itemRes.data?.data?.menuItems || []);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCartQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      pricePerQuantity: item.price,
      image: item.image,
      isVeg: item.isVeg,
    });
  };

  const handleDecrease = (item) => {
    const qty = getCartQty(item.id);
    if (qty <= 1) removeItem(item.id);
    else updateQuantity(item.id, qty - 1);
  };

  // Filtering
  const filtered = menuItems.filter((item) => {
    const matchCat = activeCatId ? item.categoryId === activeCatId : true;
    const matchSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  const activeCategory = categories.find((c) => c.id === activeCatId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-28 md:pb-10">
      {/* Search */}
      <div className="sticky top-[57px] z-30 bg-gray-950/80 backdrop-blur-lg pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 pl-11 pr-4 py-3 rounded-2xl outline-none placeholder:text-gray-500 text-sm focus:border-brand-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Category Chips */}
      {!searchQuery && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-3">
          <Chip
            label="All"
            active={activeCatId === null}
            onClick={() => setActiveCatId(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              active={activeCatId === cat.id}
              onClick={() => setActiveCatId(cat.id)}
              count={menuItems.filter((i) => i.categoryId === cat.id).length}
            />
          ))}
        </div>
      )}

      {/* Section Heading */}
      <div className="flex items-center justify-between mt-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory
              ? activeCategory.name
              : "All Dishes"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No dishes found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const qty = getCartQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors group"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}${item.image}`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-4">
                  {/* Veg / Non-Veg badge */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {item.isVeg ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <Leaf size={12} /> VEG
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                        <Drumstick size={12} /> NON-VEG
                      </span>
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-base leading-snug">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-brand-400 font-bold text-lg">
                      ₹{item.price}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => handleAdd(item)}
                        className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-gray-900 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                      >
                        <Plus size={16} /> ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-white text-sm">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-500 text-gray-900 hover:bg-brand-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
      active
        ? "bg-brand-500 text-gray-900 shadow-sm"
        : "bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-1.5 text-xs ${active ? "text-gray-800" : "text-gray-600"}`}>
        ({count})
      </span>
    )}
  </button>
);

export default Menu;
