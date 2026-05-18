import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'super_admin' | 'manager' | 'inventory' | 'support'
}

interface AdminAuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: AdminUser, token: string) => void
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('admin-token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('admin-token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'gabbar-admin-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) },
  ),
)
