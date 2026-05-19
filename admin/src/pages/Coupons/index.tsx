import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Tag, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Coupon, ApiResponse } from '@/types'
import { Dropdown } from '@/components/ui/Dropdown'

export default function CouponsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 0, minOrderAmount: 0, expiresAt: '', usageLimit: 100 })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => api.get<ApiResponse<Coupon[]>>('/admin/coupons').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/coupons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      toast.success('Coupon created!')
      setShowForm(false)
      setForm({ code: '', type: 'percentage', value: 0, minOrderAmount: 0, expiresAt: '', usageLimit: 100 })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      toast.success('Coupon deleted')
    },
  })

  const coupons = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-admin flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="font-heading text-lg text-gray-800 tracking-wider mb-4">NEW COUPON</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'code', label: 'Code', type: 'text', placeholder: 'GABBAR10' },
              { key: 'value', label: 'Value', type: 'number', placeholder: '10' },
              { key: 'minOrderAmount', label: 'Min Order (₹)', type: 'number', placeholder: '500' },
              { key: 'usageLimit', label: 'Usage Limit', type: 'number', placeholder: '100' },
              { key: 'expiresAt', label: 'Expires At', type: 'date', placeholder: '' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  placeholder={placeholder}
                  className="input-admin"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Type</label>
              <Dropdown
                value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed (₹)' },
                ]}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => createMutation.mutate(form)} className="btn-admin">Create Coupon</button>
            <button onClick={() => setShowForm(false)} className="btn-admin-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Code', 'Type', 'Value', 'Min Order', 'Used', 'Expires', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-50 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12">
                <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No coupons yet</p>
              </td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-100 hover:bg-white/2 group">
                  <td className="px-4 py-3 text-sm text-brand-blue font-bold font-mono">{coupon.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{coupon.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatPrice(coupon.minOrderAmount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{coupon.usedCount}/{coupon.usageLimit}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(coupon.expiresAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(coupon._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
