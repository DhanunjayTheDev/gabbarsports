import { lazy, Suspense } from 'react'
import HeroSection from './HeroSection'
import FeaturedCategories from './FeaturedCategories'
import TrendingProducts from './TrendingProducts'
import AboutSection from './AboutSection'
import EquipmentSlider from './EquipmentSlider'
import FoundersStrip from './FoundersStrip'
import { SkeletonProductGrid } from '@/components/ui/SkeletonCard'

const BrandsSection = lazy(() => import('./BrandsSection'))
const ReviewsSection = lazy(() => import('./ReviewsSection'))
const PromoBanner = lazy(() => import('./PromoBanner'))
const CTABanner = lazy(() => import('./CTABanner'))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <TrendingProducts />
      <AboutSection />
      <EquipmentSlider />
      <Suspense fallback={<div className="h-32" />}>
        <PromoBanner />
      </Suspense>
      <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4"><SkeletonProductGrid count={8} /></div></div>}>
        <BrandsSection />
      </Suspense>
      <Suspense fallback={<div className="h-48" />}>
        <ReviewsSection />
      </Suspense>
      <FoundersStrip />
      <Suspense fallback={<div className="h-64 bg-[#111111]" />}>
        <CTABanner />
      </Suspense>
    </>
  )
}
