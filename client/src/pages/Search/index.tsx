import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, Sparkles } from 'lucide-react'
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
      api
        .get<ApiResponse<Product[]>>(
          query
            ? `/products?search=${encodeURIComponent(query)}&limit=48`
            : `/products?limit=48`,
        )
        .then((r) => r.data),
  })

  const products = data?.data || []

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-10">
          {query ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <SearchIcon className="w-6 h-6 text-brand-orange" />
                <h1 className="font-heading text-4xl text-gray-900 tracking-wider">SEARCH RESULTS</h1>
              </div>
              <p className="text-gray-400 font-accent">
                "{query}" {products.length} result{products.length !== 1 ? 's' : ''}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/8 border border-brand-orange/20">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="text-brand-orange text-xs font-accent font-bold uppercase tracking-widest">All Products</span>
                </div>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider uppercase mb-2">
                EXPLORE ALL <span className="text-brand-orange">GEAR</span>
              </h1>
              <p className="text-gray-400 font-accent text-sm">
                {isLoading ? 'Loading...' : `${products.length} products available`}
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <SkeletonProductGrid count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <SearchIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-heading text-4xl text-gray-200 tracking-wider">
              {query ? 'NO RESULTS' : 'NO PRODUCTS YET'}
            </p>
            <p className="text-gray-400 font-accent mt-2">
              {query ? 'Try a different search term' : 'Check back soon we\'re adding products daily'}
            </p>
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
