import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Users } from 'lucide-react'
import { api } from '@/lib/axios'
import { formatDate, formatPrice } from '@/lib/utils'

interface Customer {
  _id: string
  name: string
  email: string
  phone?: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  isVerified: boolean
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', search, page],
    queryFn: () => api.get(`/admin/customers?search=${search}&page=${page}&limit=20`).then((r) => r.data),
  })

  const customers: Customer[] = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-5">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="input-admin pl-9" />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Verified', ''].map((h) => (
                <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-50 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No customers found</p>
              </td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-b border-gray-100 hover:bg-white/2 group">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{c.name}</p>
                      <p className="text-gray-400 text-xs">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.phone || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatPrice(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.isVerified ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-50 text-gray-400'}`}>
                      {c.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/customers/${c._id}`} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all inline-flex">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-sm">{meta.total} customers</p>
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
