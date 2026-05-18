import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const REVIEWS_ROW1 = [
  {
    name: 'Arjun Sharma',
    role: 'Club Cricket Player',
    avatar: 'AS',
    rating: 5,
    text: 'Got my SG cricket bat from Gabbar Sports. Quality is top-notch and delivery was lightning fast. Will definitely order again!',
  },
  {
    name: 'Rahul Mehta',
    role: 'Football Coach',
    avatar: 'RM',
    rating: 5,
    text: 'Bought Nike football boots for my team. All 11 pairs arrived in 2 days. Incredible service and 100% genuine products.',
  },
  {
    name: 'Vikas Kumar',
    role: 'State Cricket Captain',
    avatar: 'VK',
    rating: 5,
    text: "DSC Krunch cricket bat is phenomenal. Picked it up from Gabbar Sports and it's been my best purchase this season. Highly recommended!",
  },
  {
    name: 'Deepak Patel',
    role: 'Club Cricket Player',
    avatar: 'DP',
    rating: 5,
    text: 'Kookaburra batting pads and gloves — everything arrived in perfect condition. Gabbar Sports is now my go-to for all cricket equipment.',
  },
  {
    name: 'Ravi Chandran',
    role: 'Cricket Coach',
    avatar: 'RC',
    rating: 5,
    text: 'Ordered MRF bats for my academy. All students are happy with the quality. Best prices online and super fast dispatch from Gabbar.',
  },
  {
    name: 'Aditya Nair',
    role: 'Tennis Player',
    avatar: 'AN',
    rating: 5,
    text: 'Wilson racket at a great price. Shipping was 2 days and they even sent a thank-you card. Amazing customer experience!',
  },
]

const REVIEWS_ROW2 = [
  {
    name: 'Sneha Patel',
    role: 'Badminton Player',
    avatar: 'SP',
    rating: 5,
    text: 'Yonex racket at the best price I found online. Came with original strings. Gabbar Sports is 100% authentic. Love this store!',
  },
  {
    name: 'Priya Nair',
    role: 'Cricket Enthusiast',
    avatar: 'PN',
    rating: 5,
    text: 'Ordered a Kookaburra cricket ball set and batting gloves. Great quality at fair prices. Packaging was excellent too.',
  },
  {
    name: 'Anjali Singh',
    role: 'State Badminton Player',
    avatar: 'AS',
    rating: 5,
    text: 'Victor badminton shoes fit perfectly. Fast delivery and the shoe quality is outstanding. Will shop here for all my sports gear!',
  },
  {
    name: 'Meera Iyer',
    role: 'Football Player',
    avatar: 'MI',
    rating: 5,
    text: 'Adidas football jersey and shin guards arrived within 24 hours. The jersey quality is exactly as shown. Loved the experience!',
  },
  {
    name: 'Kavita Reddy',
    role: 'Hockey Player',
    avatar: 'KR',
    rating: 5,
    text: 'Great selection of hockey sticks. Got my order the next day. Product is 100% genuine and the price was unbeatable. 5 stars!',
  },
  {
    name: 'Suresh Babu',
    role: 'Cricket Umpire',
    avatar: 'SB',
    rating: 5,
    text: 'Gray-Nicolls cricket gear for my son. The quality blew us away. Gabbar Sports is the Amazon of sports — fast, genuine, affordable.',
  },
]

interface Review {
  name: string
  role: string
  avatar: string
  rating: number
  text: string
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white border border-gray-100 rounded-2xl p-5 mx-3 relative hover:border-gray-200 hover:shadow-md transition-all duration-300">
      <Quote className="absolute top-4 right-4 w-7 h-7 text-brand-orange/10" />
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-500 text-sm font-accent leading-relaxed mb-4 line-clamp-3">
        "{review.text}"
      </p>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold font-heading flex-shrink-0">
          {review.avatar}
        </div>
        <div>
          <p className="text-gray-800 font-accent font-semibold text-sm leading-tight">{review.name}</p>
          <p className="text-gray-400 text-xs font-accent">{review.role}</p>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const doubled = [...reviews, ...reviews]
  return (
    <div className="overflow-hidden">
      <div
        className="flex items-stretch"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee-forward'} 45s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-brand-orange font-accent text-xs font-bold tracking-[0.3em] uppercase mb-3"
        >
          What Athletes Say
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-5xl md:text-6xl text-gray-900 tracking-widest uppercase"
        >
          REAL <span className="text-brand-orange">REVIEWS</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 font-accent text-sm mt-3"
        >
          12,000+ verified reviews from athletes across India
        </motion.p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="mb-4">
        <MarqueeRow reviews={REVIEWS_ROW1} reverse={false} />
      </div>

      {/* Row 2 — scrolls right (opposite) */}
      <MarqueeRow reviews={REVIEWS_ROW2} reverse={true} />

      <style>{`
        @keyframes marquee-forward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
