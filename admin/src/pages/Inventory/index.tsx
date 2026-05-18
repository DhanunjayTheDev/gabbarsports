import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Package } from 'lucide-react'
import { api } from '@/lib/axios'

interface InventoryItem {
  _id: string
  product: { name: string; sku: string; thumbnail: string }
  stockQuantity: number
  reservedQuantity: number
  lowStockThreshold: number
}

export default function InventoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: () => api.get('/admin/inventory').then((r) => r.data.data as InventoryItem[]),
  })

  const items = data || []
  const lowStock = items.filter((i) => i.stockQuantity <= i.lowStockThreshold)

  return (
    <div className="space-y-5">
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-medium text-sm">{lowStock.length} products need restocking</span>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Product', 'SKU', 'In Stock', 'Reserved', 'Available', 'Status'].map((h) => (
                <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-50 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12">
                <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No inventory data</p>
              </td></tr>
            ) : (
              items.map((item) => {
                const available = item.stockQuantity - item.reservedQuantity
                const isLow = item.stockQuantity <= item.lowStockThreshold
                return (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.product.thumbnail} className="w-9 h-9 rounded-lg object-cover" alt="" />
                        <p className="text-gray-800 text-sm font-medium line-clamp-1">{item.product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.product.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.stockQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.reservedQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{available}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.stockQuantity === 0 ? 'bg-red-400/20 text-red-400' :
                        isLow ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-brand-green/10 text-brand-green'
                      }`}>
                        {item.stockQuantity === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
