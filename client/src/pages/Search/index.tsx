import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { api } from '@/lib/axios'
import ProductCard from '@/components/ui/ProductCard'
import { SkeletonProductGrid } from '@/components/ui/SkeletonCard'
import type { ApiResponse, Product } from '@/types'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () =>
      api.get<ApiResponse<Product[]>>(`/products?search=${encodeURIComponent(query)}&limit=24`).then((r) => r.data),
    enabled: query.length > 0,
  })

  const products = data?.data || []

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-6 h-6 text-brand-orange" />
            <h1 className="font-heading text-4xl text-gray-900 tracking-wider">SEARCH RESULTS</h1>
          </div>
          <p className="text-gray-400 font-accent">
            {query ? `"${query}" ${products.length} results` : 'Enter a search term'}
          </p>
        </div>

        {isLoading ? (
          <SkeletonProductGrid count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-4xl text-gray-200 tracking-wider">NO RESULTS</p>
            <p className="text-gray-400 font-accent mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
