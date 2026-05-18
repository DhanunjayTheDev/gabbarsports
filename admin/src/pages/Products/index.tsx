import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Eye, Package } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import { formatPrice } from '@/lib/utils'
import type { Product, ApiResponse } from '@/types'

interface AdminProduct extends Product {
  isActive: boolean
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', search, page],
    queryFn: () =>
      api.get<ApiResponse<AdminProduct[]>>(`/admin/products?search=${search}&page=${page}&limit=20`).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Delete failed'),
  })

  const products = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-admin pl-9 w-64"
          />
        </div>
        <Link to="/products/new" className="btn-admin flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Product', 'SKU', 'Price', 'Stock', 'Category', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-white/2 group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-gray-800 text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-gray-400 text-xs">{product.brand?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{product.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${product.stockQuantity <= 5 ? 'text-red-400' : product.stockQuantity <= 20 ? 'text-yellow-400' : 'text-brand-green'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.category?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-50 text-gray-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/product/${product.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link to={`/products/${product._id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) {
                              deleteMutation.mutate(product._id)
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-sm">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-admin-ghost px-3 py-1.5 text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="btn-admin-ghost px-3 py-1.5 text-xs disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
