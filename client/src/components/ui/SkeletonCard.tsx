import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse', className)}>
      <div className="h-[200px] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-4/5" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded-lg w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ className }: { className?: string }) {
  return <div className={cn('bg-gray-100 rounded animate-pulse', className)} />
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
