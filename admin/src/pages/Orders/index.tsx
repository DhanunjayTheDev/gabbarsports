import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Eye, ShoppingCart } from 'lucide-react'
import { api } from '@/lib/axios'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Order, ApiResponse } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  confirmed: 'bg-brand-blue/10 text-brand-blue',
  processing: 'bg-brand-blue/10 text-brand-blue',
  shipped: 'bg-purple-400/10 text-purple-400',
  out_for_delivery: 'bg-brand-orange/10 text-brand-orange',
  delivered: 'bg-brand-green/10 text-brand-green',
  cancelled: 'bg-red-400/10 text-red-400',
  returned: 'bg-gray-100 text-gray-400',
  refunded: 'bg-gray-100 text-gray-400',
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', search, statusFilter, page],
    queryFn: () =>
      api.get<ApiResponse<Order[]>>(`/admin/orders?search=${search}&status=${statusFilter}&page=${page}&limit=20`).then((r) => r.data),
  })

  const orders = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-admin pl-9 w-64"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="input-admin w-44"
        >
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map((s) => (
            <option key={s} value={s} className="bg-white capitalize">{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-50 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12">
                  <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No orders found</p>
                </td></tr>
              ) : (
                orders.map((order) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-100 hover:bg-white/2 group">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{typeof order.user === 'object' ? (order.user as unknown as { name: string }).name : order.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.items.length}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-brand-green/10 text-brand-green' : 'bg-yellow-400/10 text-yellow-400'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/orders/${order._id}`} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all inline-flex">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-sm">{meta.total} total orders</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-admin-ghost px-3 py-1.5 text-xs disabled:opacity-30">Prev</button>
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="btn-admin-ghost px-3 py-1.5 text-xs disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
