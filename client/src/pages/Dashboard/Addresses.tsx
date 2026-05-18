import { ArrowLeft, Plus, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AddressesPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading text-4xl text-gray-900 tracking-wider">ADDRESSES</h1>
          </div>
          <button className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        <div className="text-center py-24">
          <MapPin className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <p className="font-heading text-3xl text-gray-300 tracking-wider">NO ADDRESSES</p>
          <p className="text-gray-400 font-accent mt-2">Add a delivery address to get started</p>
        </div>
      </div>
    </div>
  )
}
