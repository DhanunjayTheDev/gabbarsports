import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/Home'
import CategoryPage from '@/pages/Category'
import ProductPage from '@/pages/Product'
import CartPage from '@/pages/Cart'
import CheckoutPage from '@/pages/Checkout'
import LoginPage from '@/pages/Auth/Login'
import RegisterPage from '@/pages/Auth/Register'
import ForgotPasswordPage from '@/pages/Auth/ForgotPassword'
import DashboardPage from '@/pages/Dashboard'
import OrdersPage from '@/pages/Dashboard/Orders'
import WishlistPage from '@/pages/Dashboard/Wishlist'
import AddressesPage from '@/pages/Dashboard/Addresses'
import ProfilePage from '@/pages/Dashboard/Profile'
import NotFoundPage from '@/pages/NotFound'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import SearchPage from '@/pages/Search'
import AboutPage from '@/pages/About'
import GalleryPage from '@/pages/Gallery'
import ContactPage from '@/pages/Contact'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard/addresses" element={
          <ProtectedRoute>
            <AddressesPage />
          </ProtectedRoute>
        } />
        <Route path="dashboard/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
