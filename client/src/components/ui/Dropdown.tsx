import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

export function Dropdown({
  options,
  value = '',
  onChange,
  placeholder = 'Select...',
  className,
  label,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function pick(v: string) {
    onChange?.(v)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <span className="text-gray-400 text-sm font-accent mr-2">{label}</span>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-accent transition-all duration-150',
          open
            ? 'border border-brand-orange/40 ring-2 ring-brand-orange/10 text-gray-900'
            : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900',
        )}
      >
        <span className="whitespace-nowrap">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full right-0 mt-1.5 min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt.value)}
                className={cn(
                  'w-full flex items-center justify-between gap-6 px-4 py-2.5 text-sm font-accent transition-colors',
                  value === opt.value
                    ? 'text-brand-orange bg-orange-50 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <span className="whitespace-nowrap">{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
