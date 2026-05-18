import { Plus, Image, Trash2, Eye, EyeOff } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'
import { toast } from 'sonner'
import type { Banner, ApiResponse } from '@/types'

export default function BannersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: () => api.get<ApiResponse<Banner[]>>('/admin/banners').then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }); toast.success('Banner deleted') },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/banners/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  })

  const banners = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="btn-admin flex items-center gap-2"><Plus className="w-4 h-4" /> Add Banner</button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card aspect-video animate-pulse" />)}</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24">
          <Image className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No banners yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="glass-card overflow-hidden group">
              <div className="relative aspect-video">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                {!banner.isActive && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-gray-500 font-heading tracking-wider">INACTIVE</span></div>}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium text-sm">{banner.title}</p>
                  {banner.ctaText && <p className="text-gray-400 text-xs">{banner.ctaText}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleMutation.mutate({ id: banner._id, isActive: !banner.isActive })} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all">
                    {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => deleteMutation.mutate(banner._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
