import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, MessageCircle,
  Clock, Navigation, ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import BeamCircle from '@/components/ui/BeamCircle'

const CONTACT_INFO = [
  { Icon: Phone, label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat 10am–9pm', href: 'tel:+919876543210' },
  { Icon: Mail, label: 'Email Us', value: 'hello@gabbarsports.in', sub: 'Reply within 24 hours', href: 'mailto:hello@gabbarsports.in' },
  { Icon: MapPin, label: 'Visit Us', value: 'Kukatpally, Hyderabad', sub: 'Telangana 500072, India', href: '#location' },
]

const BEAM_ORBITS = [
  { id: 1, radiusFactor: 0.28, speed: 7, icon: <Instagram />, iconSize: 34, orbitColor: '#E1306C55', orbitThickness: 1.5 },
  { id: 2, radiusFactor: 0.46, speed: 12, icon: <Facebook />, iconSize: 38, orbitColor: '#1877F255', orbitThickness: 1.5 },
  { id: 3, radiusFactor: 0.64, speed: 9, icon: <Twitter />, iconSize: 42, orbitColor: '#1DA1F255', orbitThickness: 1 },
  { id: 4, radiusFactor: 0.82, speed: 16, icon: <MessageCircle />, iconSize: 46, orbitColor: '#25D36655', orbitThickness: 2 },
]

const HOURS = [
  { day: 'Monday – Friday', time: '10:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 9:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 7:00 PM' },
]

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475.6665511707548!2d78.3975742846519!3d17.49163853214253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91a84bc1f3c3%3A0xf1f393a4912bcc53!2sGABBAR%20SPORTZ%20pvt%20ltd!5e0!3m2!1sen!2sin!4v1779177779198!5m2!1sen!2sin'
const MAP_LINK = 'https://www.google.com/maps/place/GABBAR+SPORTZ+pvt+ltd/@17.4916385,78.3975743,17z'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.")
      setForm({ name: '', email: '', subject: '', message: '' })
      setSending(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/8 border border-brand-orange/20 mb-5"
          >
            <span className="text-brand-orange text-xs font-accent font-bold uppercase tracking-widest">Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-6xl md:text-7xl tracking-wider text-gray-900 uppercase"
          >
            Contact <span className="text-brand-orange">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-body mt-3 max-w-xl mx-auto"
          >
            Questions about gear, orders, or partnerships? We're here to help.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">

          {/* Left: Contact info cards */}
          <div className="space-y-4">
            {CONTACT_INFO.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="block bg-white border border-gray-100 rounded-3xl p-6 hover:border-brand-orange/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
                    <c.Icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-accent uppercase tracking-widest mb-1">{c.label}</p>
                    <p className="text-gray-900 font-heading text-lg tracking-wider leading-tight">{c.value}</p>
                    <p className="text-gray-400 text-xs font-accent mt-1">{c.sub}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="bg-gray-900 text-white rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-brand-orange" />
                  <p className="text-brand-orange text-xs font-accent font-bold uppercase tracking-widest">Store Hours</p>
                </div>
                <div className="space-y-2">
                  {HOURS.map((h) => (
                    <div key={h.day} className="flex justify-between items-center text-sm">
                      <span className="text-white/70 font-accent">{h.day}</span>
                      <span className="text-white font-semibold font-accent">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* BeamCircle socials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-950 border border-gray-800 rounded-3xl p-4 flex flex-col items-center overflow-hidden"
            >
              <p className="text-gray-500 text-xs font-accent uppercase tracking-widest mb-1 self-start px-2">Follow Us</p>
              <BeamCircle orbits={BEAM_ORBITS} size={220} />
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 border border-gray-100 rounded-3xl p-8"
          >
            <h2 className="font-heading text-2xl text-gray-900 tracking-wider mb-1">SEND MESSAGE</h2>
            <p className="text-gray-500 text-sm font-body mb-6">We typically respond within 24 hours.</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                required
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-accent focus:outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 transition-all"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-accent focus:outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 transition-all"
              />
            </div>

            <input
              required
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-accent focus:outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 transition-all mb-4"
            />

            <textarea
              required
              rows={5}
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-accent focus:outline-none focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 transition-all resize-none mb-5"
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white font-accent font-semibold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(255,107,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,0,0.45)]"
            >
              {sending ? 'Sending...' : (<>Send Message <Send className="w-4 h-4" /></>)}
            </button>

            {/* FAQ section to fill column height */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-400 text-xs font-accent uppercase tracking-widest mb-4">Common Questions</p>
              <div className="space-y-3">
                {[
                  { q: 'How long does delivery take?', a: '2–5 business days across India. Same-day available in Hyderabad.' },
                  { q: 'Do you offer bulk or team discounts?', a: 'Yes! Contact us for orders of 10+ units — we offer up to 20% off.' },
                  { q: 'Can I return or exchange products?', a: '7-day hassle-free returns on all unused, original-packaged items.' },
                  { q: 'Are all products genuine?', a: '100% authentic gear from official brand distributors only.' },
                ].map((faq) => (
                  <div key={faq.q} className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-orange/20 transition-colors">
                    <p className="text-gray-800 text-sm font-accent font-semibold mb-1">{faq.q}</p>
                    <p className="text-gray-400 text-xs font-accent leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.form>
        </div>

        {/* ── Map Section ── */}
        <motion.section
          id="location"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          {/* Map header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
            <div>
              <p className="text-brand-orange font-accent text-sm font-semibold uppercase tracking-widest mb-1">Find Us</p>
              <h2 className="font-heading text-3xl md:text-4xl text-gray-900 tracking-wider">
                VISIT OUR <span className="text-brand-orange">STORE</span>
              </h2>
              <p className="text-gray-500 font-body mt-2 text-sm">
                Kukatpally, Hyderabad, Telangana 500072 flagship retail store
              </p>
            </div>

            <a
              href={MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-accent font-semibold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Map embed */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-[0_16px_50px_rgba(0,0,0,0.08)] bg-gray-100">
            <iframe
              title="Gabbar Sports Store Location"
              src={MAP_EMBED}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-[380px] md:h-[460px]"
            />

            {/* Floating address card overlay */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-5 pointer-events-none">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading text-base text-gray-900 tracking-wider">GABBAR SPORTZ</p>
                  <p className="text-gray-500 text-xs font-accent leading-relaxed mt-0.5">
                    Kukatpally, KPHB Phase 1<br />
                    Hyderabad, Telangana 500072
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
