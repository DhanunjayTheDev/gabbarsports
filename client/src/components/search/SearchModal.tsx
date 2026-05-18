import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'
import { debounce } from '@/lib/utils'

const TRENDING_SEARCHES = ['Cricket Bat', 'Football Boots', 'Cricket Helmet', 'Badminton Racket', 'Running Shoes']

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isSearchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  const handleSearch = debounce((q: string) => {
    if (q.length > 2) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
  }, 300) as (q: string) => void

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setSearchOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
              <form onSubmit={onSubmit} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-brand-orange flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  placeholder="Search for cricket bats, football boots..."
                  className="flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 text-base font-accent focus:outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-gray-400 text-xs font-mono border border-gray-200">
                  ESC
                </kbd>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="flex items-center gap-2 text-gray-400 text-xs font-accent uppercase tracking-wider mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term)
                        navigate(`/search?q=${encodeURIComponent(term)}`)
                        setSearchOpen(false)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-brand-orange/5 hover:text-brand-orange border border-gray-200 hover:border-brand-orange/20 rounded-full text-gray-500 text-sm font-accent transition-all duration-150"
                    >
                      {term}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
