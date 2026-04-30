import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.menu_item_id === item.menu_item_id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.menu_item_id === item.menu_item_id
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.menu_item_id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.menu_item_id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.menu_item_id === id ? { ...i, quantity } : i
            ),
          };
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'zaiqa-cart-storage',
    }
  )
);
