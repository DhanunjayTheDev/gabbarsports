import { useState, useRef, useEffect, useId } from 'react'
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
  disabled?: boolean
}

export function Dropdown({
  options,
  value = '',
  onChange,
  placeholder = 'Select...',
  className,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const uid = useId()

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
      <button
        id={uid}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2',
          'px-3 py-2.5 bg-white border rounded-xl text-sm transition-all duration-150',
          open
            ? 'border-brand-orange/50 ring-2 ring-brand-orange/10 text-gray-800'
            : 'border-gray-200 text-gray-700 hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className={cn('truncate', !selected && 'text-gray-400')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1">
            {placeholder && (
              <button
                type="button"
                onClick={() => pick('')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                  value === '' ? 'text-brand-orange bg-orange-50/60' : 'text-gray-400 hover:bg-gray-50',
                )}
              >
                <span>{placeholder}</span>
                {value === '' && <Check className="w-3.5 h-3.5" />}
              </button>
            )}
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                  value === opt.value
                    ? 'text-brand-orange bg-orange-50/60 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
