import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/axios'
import { formatDate, formatPrice } from '@/lib/utils'
import { SkeletonText } from '@/components/ui/SkeletonCard'
import type { ApiResponse, Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50 border border-yellow-200',
  confirmed: 'text-blue-600 bg-blue-50 border border-blue-200',
  processing: 'text-blue-600 bg-blue-50 border border-blue-200',
  shipped: 'text-purple-600 bg-purple-50 border border-purple-200',
  out_for_delivery: 'text-brand-orange bg-orange-50 border border-orange-200',
  delivered: 'text-green-600 bg-green-50 border border-green-200',
  cancelled: 'text-red-500 bg-red-50 border border-red-200',
  returned: 'text-gray-500 bg-gray-50 border border-gray-200',
  refunded: 'text-gray-500 bg-gray-50 border border-gray-200',
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<ApiResponse<Order[]>>('/orders/my-orders').then((r) => r.data),
  })

  const orders = data?.data || []

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-4xl text-gray-900 tracking-wider">MY ORDERS</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
                <SkeletonText className="h-5 w-40" />
                <SkeletonText className="h-4 w-64" />
                <SkeletonText className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <p className="font-heading text-3xl text-gray-300 tracking-wider">NO ORDERS YET</p>
            <Link to="/" className="btn-primary mt-8 inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-accent font-bold text-gray-800">#{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-accent capitalize ${STATUS_COLORS[order.status] || 'text-gray-500 bg-gray-50'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-accent">{formatDate(order.createdAt)}</p>
                    <p className="text-gray-500 text-sm font-accent mt-1">{order.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl text-gray-900">{formatPrice(order.total)}</p>
                    <Link
                      to={`/dashboard/orders/${order._id}`}
                      className="inline-flex items-center gap-1 text-brand-orange text-sm font-accent mt-2 hover:gap-2 transition-all duration-200"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  {order.items.slice(0, 4).map((item, j) => (
                    <img
                      key={j}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
