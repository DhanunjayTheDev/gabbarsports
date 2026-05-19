import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Order, ApiResponse, OrderStatus } from '@/types'
import { Dropdown } from '@/components/ui/Dropdown'

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']

export default function OrderDetailPage() {
  const { id } = useParams()
  const [status, setStatus] = useState<OrderStatus>('pending')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => api.get<ApiResponse<Order>>(`/admin/orders/${id}`).then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: (newStatus: OrderStatus) => api.patch(`/admin/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] })
      toast.success('Order status updated')
    },
  })

  const order = data?.data

  useEffect(() => {
    if (order) setStatus(order.status)
  }, [order])

  if (isLoading) return <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 text-brand-blue animate-spin" /></div>
  if (!order) return <p className="text-gray-500">Order not found</p>

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-4">
        <Link to="/orders" className="text-gray-400 hover:text-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
        <h2 className="font-heading text-2xl text-gray-800 tracking-wider">ORDER #{order.orderNumber}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-lg text-gray-800 tracking-wider mb-4">ITEMS</h3>
            <div className="space-y-3">
              {order.items.map((item: import('@/types').OrderItem, i: number) => (
                <div key={i} className="flex gap-3">
                  <img src={item.image} className="w-14 h-14 object-cover rounded-lg" alt="" />
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-800 font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-lg text-gray-800 tracking-wider mb-3">DELIVERY ADDRESS</h3>
            <div className="text-gray-500 text-sm space-y-0.5">
              <p className="text-gray-800 font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-brand-blue">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-heading text-lg text-gray-800 tracking-wider">SUMMARY</h3>
            {[
              { label: 'Subtotal', value: formatPrice(order.subtotal) },
              { label: 'Shipping', value: formatPrice(order.shippingCharge) },
              { label: 'Discount', value: `-${formatPrice(order.discount)}` },
              { label: 'GST', value: formatPrice(order.gstAmount) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-heading text-xl text-gray-800">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <h3 className="font-heading text-lg text-gray-800 tracking-wider">UPDATE STATUS</h3>
            <Dropdown
              value={status}
              onChange={(v) => setStatus(v as OrderStatus)}
              options={ORDER_STATUSES.map((s) => ({
                value: s,
                label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              }))}
            />
            <button
              onClick={() => updateStatus.mutate(status)}
              disabled={updateStatus.isPending || status === order.status}
              className="w-full btn-admin flex items-center justify-center gap-2"
            >
              {updateStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
            </button>
          </div>

          <div className="glass-card p-5">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Placed On</p>
            <p className="text-gray-800 text-sm">{formatDate(order.createdAt)}</p>
            <p className="text-xs text-gray-400 mt-3 mb-1 uppercase tracking-wider">Payment</p>
            <p className="text-gray-800 text-sm capitalize">{order.paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
