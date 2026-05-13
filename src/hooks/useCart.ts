import { create } from "zustand";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  selectedIds: string[]; // <-- MỚI: Mảng lưu ID các sản phẩm được tích chọn
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;

  // <-- CÁC HÀM XỬ LÝ CHECKBOX MỚI -->
  toggleSelectItem: (id: string) => void;
  selectAllItems: (selectAll: boolean) => void;
  clearSelectedItems: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  selectedIds: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      // Khi thêm sản phẩm mới vào giỏ, tự động tích chọn nó luôn
      return {
        items: [...state.items, item],
        selectedIds: [...state.selectedIds, item.id],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      // Xóa luôn khỏi danh sách đang chọn nếu có
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    })),

  clearCart: () => set({ items: [], selectedIds: [] }),

  // Tích/Bỏ tích 1 sản phẩm
  toggleSelectItem: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),

  // Chọn tất cả / Bỏ chọn tất cả
  selectAllItems: (selectAll) =>
    set((state) => ({
      selectedIds: selectAll ? state.items.map((item) => item.id) : [],
    })),

  clearSelectedItems: () => set({ selectedIds: [] }),
}));
