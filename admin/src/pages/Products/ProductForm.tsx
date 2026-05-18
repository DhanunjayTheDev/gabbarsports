import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/axios'

const productSchema = z.object({
  name: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  sku: z.string().min(3),
  category: z.string().min(1),
  brand: z.string().min(1),
  stockQuantity: z.number().int().nonnegative(),
  gstRate: z.number(),
  hsn: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  tags: z.string().optional(),
})

type ProductForm = z.infer<typeof productSchema>

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [images, setImages] = useState<File[]>([])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
  })

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get('/brands').then((r) => r.data.data),
  })

  const { data: productData } = useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => api.get(`/admin/products/${id}`).then((r) => r.data.data),
    enabled: isEdit,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: productData,
  })

  const mutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)))
      images.forEach((img) => formData.append('images', img))

      if (isEdit) {
        return api.put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      return api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      navigate('/products')
    },
    onError: () => toast.error('Failed to save product'),
  })

  const FIELD_CLASS = 'input-admin'
  const LABEL_CLASS = 'block text-xs text-gray-500 mb-1.5 uppercase tracking-wider'

  const GST_RATES = [0, 5, 12, 18, 28]

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-gray-400 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-heading text-2xl text-gray-800 tracking-wider">
          {isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
        </h2>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg text-gray-800 tracking-wider border-b border-gray-100 pb-3">BASIC INFO</h3>

          <div>
            <label className={LABEL_CLASS}>Product Name</label>
            <input {...register('name')} className={FIELD_CLASS} placeholder="e.g. SS Ton Cricket Bat" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS}>Short Description</label>
            <input {...register('shortDescription')} className={FIELD_CLASS} placeholder="One-line description" />
          </div>

          <div>
            <label className={LABEL_CLASS}>Full Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className={`${FIELD_CLASS} resize-none`}
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Category</label>
              <select {...register('category')} className={FIELD_CLASS}>
                <option value="">Select Category</option>
                {(categoriesData || []).map((c: { _id: string; name: string }) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>Brand</label>
              <select {...register('brand')} className={FIELD_CLASS}>
                <option value="">Select Brand</option>
                {(brandsData || []).map((b: { _id: string; name: string }) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg text-gray-800 tracking-wider border-b border-gray-100 pb-3">PRICING & INVENTORY</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Sale Price (₹)</label>
              <input {...register('price', { valueAsNumber: true })} type="number" className={FIELD_CLASS} placeholder="1499" />
            </div>
            <div>
              <label className={LABEL_CLASS}>Original Price (₹)</label>
              <input {...register('originalPrice', { valueAsNumber: true })} type="number" className={FIELD_CLASS} placeholder="1999" />
            </div>
            <div>
              <label className={LABEL_CLASS}>SKU</label>
              <input {...register('sku')} className={FIELD_CLASS} placeholder="SS-BAT-001" />
            </div>
            <div>
              <label className={LABEL_CLASS}>Stock Quantity</label>
              <input {...register('stockQuantity', { valueAsNumber: true })} type="number" className={FIELD_CLASS} placeholder="50" />
            </div>
            <div>
              <label className={LABEL_CLASS}>GST Rate (%)</label>
              <select {...register('gstRate', { valueAsNumber: true })} className={FIELD_CLASS}>
                {GST_RATES.map((rate) => <option key={rate} value={rate}>{rate}%</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>HSN Code</label>
              <input {...register('hsn')} className={FIELD_CLASS} placeholder="9506" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg text-gray-800 tracking-wider border-b border-gray-100 pb-3">IMAGES</h3>
          <div
            className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center hover:border-brand-blue/30 transition-colors cursor-pointer"
            onClick={() => document.getElementById('img-input')?.click()}
          >
            <input
              id="img-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
            <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Click to upload product images</p>
            <p className="text-gray-300 text-xs mt-1">PNG, JPG up to 5MB each</p>
          </div>
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {images.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} className="w-20 h-20 object-cover rounded-xl" alt="" />
                  <button
                    type="button"
                    onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg text-gray-800 tracking-wider border-b border-gray-100 pb-3">FLAGS</h3>
          <div className="flex gap-6 flex-wrap">
            {[
              { field: 'isFeatured' as const, label: 'Featured' },
              { field: 'isNew' as const, label: 'New Arrival' },
              { field: 'isTrending' as const, label: 'Trending' },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register(field)} className="accent-brand-blue w-4 h-4" />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className={LABEL_CLASS}>Tags (comma separated)</label>
            <input {...register('tags')} className={FIELD_CLASS} placeholder="cricket, bat, ss ton" />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link to="/products" className="btn-admin-ghost px-6">Cancel</Link>
          <button type="submit" disabled={mutation.isPending} className="btn-admin px-8 flex items-center gap-2">
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
