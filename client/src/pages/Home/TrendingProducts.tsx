import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import ProductCard from '@/components/ui/ProductCard'
import { SkeletonProductGrid } from '@/components/ui/SkeletonCard'
import type { ApiResponse, Product } from '@/types'

export default function TrendingProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () =>
      api.get<ApiResponse<Product[]>>('/products?isTrending=true&limit=8').then((r) => r.data),
  })

  const products = data?.data ?? []

  if (!isLoading && products.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-2"
            >
              <TrendingUp className="w-4 h-4 text-brand-orange" />
              <p className="text-brand-orange font-accent text-sm font-semibold tracking-widest uppercase">
                Trending Now
              </p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl text-gray-900 tracking-widest uppercase"
            >
              HOT <span className="text-brand-orange">PICKS</span>
            </motion.h2>
          </div>
          <Link
            to="/search?sort=popularity"
            className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm font-accent font-medium transition-colors duration-200"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonProductGrid count={8} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
