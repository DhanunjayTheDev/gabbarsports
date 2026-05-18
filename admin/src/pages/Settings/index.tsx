import { useState } from 'react'
import { Truck, CreditCard, FileText, Globe } from 'lucide-react'

const TABS = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'tax', label: 'Tax & GST', icon: FileText },
  { id: 'seo', label: 'SEO', icon: Globe },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('shipping')

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === id ? 'bg-brand-blue text-gray-800' : 'text-gray-400 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 space-y-5">
        {tab === 'shipping' && (
          <>
            <h3 className="font-heading text-xl text-gray-800 tracking-wider flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-blue" /> SHIPPING SETTINGS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Free Shipping Threshold (₹)', placeholder: '999' },
                { label: 'Default Shipping Charge (₹)', placeholder: '99' },
                { label: 'Express Shipping Charge (₹)', placeholder: '199' },
                { label: 'Max Delivery Days', placeholder: '7' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input type="number" placeholder={placeholder} className="input-admin" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'payment' && (
          <>
            <h3 className="font-heading text-xl text-gray-800 tracking-wider flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-blue" /> PAYMENT SETTINGS
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Razorpay Key ID', placeholder: 'rzp_live_...' },
                { label: 'Razorpay Secret', placeholder: '••••••••' },
                { label: 'Payment Currency', placeholder: 'INR' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input placeholder={placeholder} className="input-admin" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'tax' && (
          <>
            <h3 className="font-heading text-xl text-gray-800 tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" /> TAX & GST
            </h3>
            <div className="space-y-4">
              {[
                { label: 'GSTIN', placeholder: '27AAXCG1234F1ZY' },
                { label: 'Business Legal Name', placeholder: 'Gabbar Sports LLP' },
                { label: 'Business Address', placeholder: 'Hyderabad, Telangana' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input placeholder={placeholder} className="input-admin" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <h3 className="font-heading text-xl text-gray-800 tracking-wider flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-blue" /> SEO SETTINGS
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Site Title', placeholder: 'Gabbar Sports - Premium Sports Gear India' },
                { label: 'Meta Description', placeholder: 'India\'s best sports store...' },
                { label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input placeholder={placeholder} className="input-admin" />
                </div>
              ))}
            </div>
          </>
        )}

        <button className="btn-admin px-6">
          Save Settings
        </button>
      </div>
    </div>
  )
}
