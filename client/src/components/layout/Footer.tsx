import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
]

const BRAND_TEXT = 'GABBAR SPORTZ'

function OutlineBrand() {
  const [hovered, setHovered] = useState<number | null>(null)
  const letters = BRAND_TEXT.split('')

  return (
    <div className="overflow-hidden py-4">
      <div
        className="font-heading uppercase select-none leading-none whitespace-nowrap"
        style={{ fontSize: 'clamp(60px, 12vw, 180px)', letterSpacing: '-0.01em' }}
      >
        {letters.map((char, i) =>
          char === ' ' ? (
            <span key={i} style={{ display: 'inline-block', width: '0.3em' }} />
          ) : (
            <span
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                WebkitTextStroke: hovered === i ? '2px #FF6B00' : '2px #111827',
                color: hovered === i ? '#FF6B00' : 'transparent',
                transition: 'color 0.15s ease, -webkit-text-stroke-color 0.15s ease',
                cursor: 'default',
                display: 'inline-block',
              }}
            >
              {char}
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Newsletter */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-3xl text-gray-900 tracking-wider">
                JOIN THE <span className="text-brand-orange">GABBAR</span> SQUAD
              </h3>
              <p className="text-gray-500 mt-1 font-accent">
                Get exclusive deals, new arrivals & sports updates
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-orange/40 transition-all duration-200 font-accent text-sm"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer — brand info only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-xl text-white">
              G
            </div>
            <span className="font-heading text-2xl tracking-widest text-gray-900">
              GABBAR <span className="text-brand-orange">SPORTZ</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm font-accent leading-relaxed">
            India's premier destination for premium sports equipment. Gear up. Level up.
          </p>
          <div className="mt-4 space-y-2">
            <a href="mailto:support@gabbarsports.in" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-accent transition-colors duration-200">
              <Mail className="w-4 h-4 text-brand-orange" />
              support@gabbarsports.in
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-accent transition-colors duration-200">
              <Phone className="w-4 h-4 text-brand-orange" />
              +91 98765 43210
            </a>
            <span className="flex items-center gap-2 text-gray-500 text-sm font-accent">
              <MapPin className="w-4 h-4 text-brand-orange" />
              Hyderabad, Telangana, India
            </span>
          </div>
          <div className="flex gap-3 mt-6">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white hover:bg-brand-orange/5 hover:text-brand-orange border border-gray-200 hover:border-brand-orange/20 flex items-center justify-center text-gray-400 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Big outline brand name — vertically centered ── */}
      <div className="border-t border-gray-100 flex items-center justify-center py-10" style={{ minHeight: '180px' }}>
        <div style={{ width: '90vw' }}>
          <OutlineBrand />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-accent">
            &copy; {new Date().getFullYear()} Gabbar Sportz. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-sm font-accent">
            <span>Secured Payments</span>
            <span className="text-brand-orange font-semibold">Razorpay</span>
            <span>|</span>
            <span>100% Genuine Products</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
