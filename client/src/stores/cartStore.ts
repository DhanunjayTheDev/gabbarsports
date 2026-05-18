import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  variantId?: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  size?: string
  color?: string
  stock: number
}

interface CartState {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  savedItems: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  saveForLater: (productId: string, variantId?: string) => void
  moveToCart: (productId: string, variantId?: string) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  total: () => number
  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      savedItems: [],

      addItem: (item) => {
        set((state) => {
          const key = `${item.productId}-${item.variantId || ''}`
          const existing = state.items.find(
            (i) => `${i.productId}-${i.variantId || ''}` === key,
          )

          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}-${i.variantId || ''}` === key
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i,
              ),
            }
          }

          return { items: [...state.items, item] }
        })
      },

      removeItem: (productId, variantId) => {
        const key = `${productId}-${variantId || ''}`
        set((state) => ({
          items: state.items.filter(
            (i) => `${i.productId}-${i.variantId || ''}` !== key,
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        const key = `${productId}-${variantId || ''}`
        set((state) => ({
          items: state.items.map((i) =>
            `${i.productId}-${i.variantId || ''}` === key
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i,
          ),
        }))
      },

      saveForLater: (productId, variantId) => {
        const key = `${productId}-${variantId || ''}`
        set((state) => {
          const item = state.items.find((i) => `${i.productId}-${i.variantId || ''}` === key)
          if (!item) return state
          return {
            items: state.items.filter((i) => `${i.productId}-${i.variantId || ''}` !== key),
            savedItems: [...state.savedItems, item],
          }
        })
      },

      moveToCart: (productId, variantId) => {
        const key = `${productId}-${variantId || ''}`
        set((state) => {
          const item = state.savedItems.find((i) => `${i.productId}-${i.variantId || ''}` === key)
          if (!item) return state
          return {
            savedItems: state.savedItems.filter((i) => `${i.productId}-${i.variantId || ''}` !== key),
            items: [...state.items, item],
          }
        })
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      subtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      total: () => {
        const subtotal = get().subtotal()
        return subtotal - get().couponDiscount
      },

      itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'gabbar-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
