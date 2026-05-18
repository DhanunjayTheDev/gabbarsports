import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TrendingUp, ShoppingCart, Users, Package, AlertTriangle,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { api } from '@/lib/axios'
import { formatPrice, formatNumber } from '@/lib/utils'

const MOCK_REVENUE = [
  { month: 'Apr', revenue: 285000 },
  { month: 'May', revenue: 342000 },
  { month: 'Jun', revenue: 298000 },
  { month: 'Jul', revenue: 415000 },
  { month: 'Aug', revenue: 387000 },
  { month: 'Sep', revenue: 452000 },
  { month: 'Oct', revenue: 521000 },
]

const MOCK_ORDERS = [
  { day: 'Mon', orders: 45 },
  { day: 'Tue', orders: 62 },
  { day: 'Wed', orders: 38 },
  { day: 'Thu', orders: 71 },
  { day: 'Fri', orders: 84 },
  { day: 'Sat', orders: 96 },
  { day: 'Sun', orders: 53 },
]

interface StatsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
  lowStockCount: number
  pendingOrders: number
}

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    color: '#111827',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  itemStyle: { color: '#FF6B00' },
}

const ORDER_TOOLTIP_STYLE = {
  ...TOOLTIP_STYLE,
  itemStyle: { color: '#FF6B00' },
}

const STATUS_STYLE: Record<string, string> = {
  delivered: 'bg-green-50 text-green-700 border border-green-100',
  shipped: 'bg-purple-50 text-purple-700 border border-purple-100',
  processing: 'bg-blue-50 text-blue-700 border border-blue-100',
  confirmed: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
}

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<{ data: StatsData }>('/admin/stats').then((r) => r.data.data),
  })

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(data?.totalRevenue || 2850000),
      change: data?.revenueChange || 18.5,
      icon: TrendingUp,
      color: 'text-brand-orange',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
    },
    {
      label: 'Total Orders',
      value: formatNumber(data?.totalOrders || 1247),
      change: data?.ordersChange || 12.3,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Total Customers',
      value: formatNumber(data?.totalCustomers || 8432),
      change: 8.7,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Total Products',
      value: formatNumber(data?.totalProducts || 512),
      change: 3.2,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Alert */}
      {(data?.lowStockCount || 8) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl"
        >
          <AlertTriangle className="w-4 h-4 text-brand-orange flex-shrink-0" />
          <span className="text-sm text-gray-700">
            <span className="text-brand-orange font-semibold">{data?.lowStockCount || 8} products</span> are running low on stock
          </span>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(change)}%
              </div>
            </div>
            <p className="font-heading text-2xl text-gray-900">{value}</p>
            <p className="text-gray-400 text-xs mt-1 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-heading text-lg text-gray-900 tracking-wider mb-5">REVENUE TREND</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MOCK_REVENUE}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${formatNumber(v)}`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatPrice(v), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-heading text-lg text-gray-900 tracking-wider mb-5">ORDERS THIS WEEK</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_ORDERS}>
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...ORDER_TOOLTIP_STYLE} formatter={(v: number) => [v, 'Orders']} />
              <Bar dataKey="orders" fill="#FF6B00" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-gray-900 tracking-wider">RECENT ORDERS</h3>
          <a href="/orders" className="text-brand-orange text-sm font-accent font-medium hover:underline">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider pb-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'GS-1042', customer: 'Arjun Sharma', amount: 4299, status: 'delivered', date: '15 Oct 2025' },
                { id: 'GS-1041', customer: 'Priya Nair', amount: 1899, status: 'shipped', date: '14 Oct 2025' },
                { id: 'GS-1040', customer: 'Rahul Mehta', amount: 8750, status: 'processing', date: '13 Oct 2025' },
                { id: 'GS-1039', customer: 'Sneha Patel', amount: 2499, status: 'confirmed', date: '12 Oct 2025' },
              ].map((order) => (
                <tr key={order.id} className="table-row-hover">
                  <td className="py-3 text-sm text-gray-800 font-medium">{order.id}</td>
                  <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                  <td className="py-3 text-sm text-gray-800 font-medium">{formatPrice(order.amount)}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_STYLE[order.status] || 'bg-gray-50 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
