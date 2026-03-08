import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  pricePerQuantity: item.pricePerQuantity,
                  quantity: i.quantity + 1,
                  price: item.pricePerQuantity * (i.quantity + 1),
                }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...item, quantity: 1, price: item.pricePerQuantity },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const safeQty = Math.floor(Number(quantity));
      if (!Number.isFinite(safeQty) || safeQty <= 0) {
        return { items: state.items.filter((i) => i.id !== id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, quantity: safeQty, price: i.pricePerQuantity * safeQty }
            : i
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useCartStore;
