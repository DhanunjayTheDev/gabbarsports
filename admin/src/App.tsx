import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import LoginPage from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import ProductsPage from '@/pages/Products'
import ProductFormPage from '@/pages/Products/ProductForm'
import OrdersPage from '@/pages/Orders'
import OrderDetailPage from '@/pages/Orders/OrderDetail'
import CustomersPage from '@/pages/Customers'
import CustomerDetailPage from '@/pages/Customers/CustomerDetail'
import CouponsPage from '@/pages/Coupons'
import CategoriesPage from '@/pages/Categories'
import BrandsPage from '@/pages/Brands'
import InventoryPage from '@/pages/Inventory'
import BannersPage from '@/pages/Banners'
import SettingsPage from '@/pages/Settings'
import { useAdminAuthStore } from '@/stores/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
