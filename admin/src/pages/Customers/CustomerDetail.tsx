import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CustomerDetailPage() {
  const { id } = useParams()
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customers" className="text-gray-400 hover:text-gray-800"><ArrowLeft className="w-5 h-5" /></Link>
        <h2 className="font-heading text-2xl text-gray-800 tracking-wider">CUSTOMER DETAIL</h2>
      </div>
      <p className="text-gray-400">Customer ID: {id}</p>
    </div>
  )
}
