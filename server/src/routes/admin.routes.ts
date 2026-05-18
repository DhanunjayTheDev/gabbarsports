import { Router } from 'express'
import {
  getDashboardStats,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
  adminUpdateBrand,
  adminDeleteBrand,
  getInventory,
  updateStock,
  getBanners,
  createBanner as adminCreateBanner,
  updateBanner,
  deleteBanner,
  getReturnRequests,
  updateReturnStatus,
} from '../controllers/admin.controller'
import { getCustomers, getCustomerById, toggleCustomerStatus } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth'
import { isAdmin, isSuperAdmin, isInventoryStaff } from '../middleware/role'

const router = Router()

router.use(authenticate, isAdmin)

// Dashboard
router.get('/stats', getDashboardStats)

// Products
router.get('/products', adminGetProducts)
router.post('/products', adminCreateProduct)
router.patch('/products/:id', adminUpdateProduct)
router.delete('/products/:id', adminDeleteProduct)

// Orders
router.get('/orders', adminGetOrders)
router.get('/orders/:id', adminGetOrderById)
router.patch('/orders/:id/status', adminUpdateOrderStatus)

// Customers
router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomerById)
router.patch('/customers/:id/toggle-status', isSuperAdmin, toggleCustomerStatus)

// Categories
router.post('/categories', adminCreateCategory)
router.patch('/categories/:id', adminUpdateCategory)
router.delete('/categories/:id', isSuperAdmin, adminDeleteCategory)

// Brands
router.post('/brands', adminCreateBrand)
router.patch('/brands/:id', adminUpdateBrand)
router.delete('/brands/:id', isSuperAdmin, adminDeleteBrand)

// Inventory
router.get('/inventory', isInventoryStaff, getInventory)
router.patch('/inventory/:id/stock', isInventoryStaff, updateStock)

// Banners
router.get('/banners', getBanners)
router.post('/banners', adminCreateBanner)
router.patch('/banners/:id', updateBanner)
router.delete('/banners/:id', deleteBanner)

// Returns
router.get('/returns', getReturnRequests)
router.patch('/returns/:id/status', updateReturnStatus)

export default router
