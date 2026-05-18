import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="font-heading text-[150px] md:text-[200px] leading-none text-gray-100 select-none">
          404
        </div>
        <h1 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider -mt-8 mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-gray-400 font-accent mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
