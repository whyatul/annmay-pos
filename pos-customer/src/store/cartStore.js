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
              ? { ...i, quantity: i.quantity + 1, price: i.pricePerQuantity * (i.quantity + 1) }
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
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? { ...i, quantity, price: i.pricePerQuantity * quantity }
          : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useCartStore;
