import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, Award } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import type { Brand, ApiResponse } from '@/types'

export default function BrandsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: () => api.get<ApiResponse<Brand[]>>('/brands').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (d: typeof form) => api.post('/admin/brands', d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] }); setShowForm(false); toast.success('Brand created!') },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/brands/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] }); toast.success('Brand deleted') },
  })

  const brands = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-admin flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>
      {showForm && (
        <div className="glass-card p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Name</label>
              <input value={form.name} onChange={(e) => setForm({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="input-admin" placeholder="Nike" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Slug</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input-admin" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => createMutation.mutate(form)} className="btn-admin">Create</button>
            <button onClick={() => setShowForm(false)} className="btn-admin-ghost">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card p-4 h-20 animate-pulse" />) : brands.map((brand) => (
          <div key={brand._id} className="glass-card p-4 flex items-center justify-between group hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-brand-orange" />
              <div>
                <p className="text-gray-800 font-medium text-sm">{brand.name}</p>
                <p className="text-gray-400 text-xs">/{brand.slug}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteMutation.mutate(brand._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
