import { Link } from 'react-router-dom'
import { Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  'Shop': [
    { label: 'Cricket', href: '/category/cricket' },
    { label: 'Football', href: '/category/football' },
    { label: 'Badminton', href: '/category/badminton' },
    { label: 'Hockey', href: '/category/hockey' },
    { label: 'Shoes', href: '/category/shoes' },
    { label: 'Jerseys', href: '/category/jerseys' },
  ],
  'Support': [
    { label: 'Track Order', href: '/dashboard/orders' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
]

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

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center font-heading text-xl text-white">
                G
              </div>
              <span className="font-heading text-2xl tracking-widest text-gray-900">
                GABBAR <span className="text-brand-orange">SPORTS</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm font-accent leading-relaxed max-w-xs">
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

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-lg text-gray-900 tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-gray-500 hover:text-gray-900 text-sm font-accent transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-accent">
            &copy; {new Date().getFullYear()} Gabbar Sports. All rights reserved.
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
