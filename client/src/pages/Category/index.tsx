import { useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfiniteQuery } from '@tanstack/react-query'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { api } from '@/lib/axios'
import ProductCard from '@/components/ui/ProductCard'
import { SkeletonProductGrid } from '@/components/ui/SkeletonCard'
import type { ApiResponse, Product, FilterOptions } from '@/types'
import { useUIStore } from '@/stores/uiStore'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 100000 },
]

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const { setFilterOpen, isFilterOpen } = useUIStore()

  const [filters, setFilters] = useState<FilterOptions>({
    sort: (searchParams.get('sort') as FilterOptions['sort']) || 'newest',
    priceMin: undefined,
    priceMax: undefined,
    rating: undefined,
    inStock: undefined,
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products', slug, filters],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        category: slug || '',
        page: String(pageParam),
        limit: '12',
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.priceMin !== undefined && { priceMin: String(filters.priceMin) }),
        ...(filters.priceMax !== undefined && { priceMax: String(filters.priceMax) }),
        ...(filters.rating !== undefined && { rating: String(filters.rating) }),
        ...(filters.inStock !== undefined && { inStock: String(filters.inStock) }),
      })
      return api.get<ApiResponse<Product[]>>(`/products?${params}`).then((r) => r.data)
    },
    getNextPageParam: (last) => {
      const meta = last.meta
      return meta?.hasNextPage ? meta.page + 1 : undefined
    },
    initialPageParam: 1,
  })

  const allProducts = data?.pages.flatMap((p) => p.data) || []
  const total = data?.pages[0]?.meta?.total || 0

  const updateFilter = useCallback((key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const categoryName = slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'All Products'

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-5xl md:text-6xl text-gray-900 tracking-wider">
            {categoryName}
          </h1>
          <p className="text-gray-400 font-accent mt-2">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <button
            onClick={() => setFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-300 text-sm font-accent transition-all duration-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-accent">Sort:</span>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value as FilterOptions['sort'])}
                className="appearance-none px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-accent focus:outline-none focus:border-brand-orange/40 transition-all duration-200 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-[280px] bg-white border border-gray-100 rounded-2xl p-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg text-gray-900 tracking-wider">FILTERS</h3>
                    <button onClick={() => setFilterOpen(false)}>
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
                    </button>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="text-sm font-accent font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range) => (
                        <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="price"
                            onChange={() => {
                              updateFilter('priceMin', range.min)
                              updateFilter('priceMax', range.max)
                            }}
                            className="accent-brand-orange"
                          />
                          <span className="text-sm font-accent text-gray-500 group-hover:text-gray-900 transition-colors">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-accent font-semibold text-gray-500 uppercase tracking-wider mb-3">Min Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="rating"
                            onChange={() => updateFilter('rating', rating)}
                            className="accent-brand-orange"
                          />
                          <span className="text-sm font-accent text-gray-500 group-hover:text-gray-900 transition-colors">
                            {rating}+ Stars
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* In Stock */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                        className="accent-brand-orange w-4 h-4"
                      />
                      <span className="text-sm font-accent text-gray-500 group-hover:text-gray-900 transition-colors">
                        In Stock Only
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => setFilters({ sort: 'newest' })}
                    className="w-full btn-ghost text-sm py-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <SkeletonProductGrid count={12} />
            ) : allProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-heading text-4xl text-gray-200 tracking-wider">NO PRODUCTS</p>
                <p className="text-gray-400 font-accent mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {allProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="btn-ghost px-10"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
