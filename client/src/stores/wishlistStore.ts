import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice: number
  brand: string
  inStock: boolean
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => ({
          items: state.items.some((i) => i.productId === item.productId)
            ? state.items
            : [...state.items, item],
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.productId)
        if (exists) {
          get().removeItem(item.productId)
        } else {
          get().addItem(item)
        }
      },

      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'gabbar-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
