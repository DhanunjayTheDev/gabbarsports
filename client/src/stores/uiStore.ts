import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  isFilterOpen: boolean
  searchQuery: string
  setMobileMenu: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setFilterOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  searchQuery: '',

  setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setFilterOpen: (open) => set({ isFilterOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
