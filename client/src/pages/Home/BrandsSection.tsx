const BRANDS_ROW1 = [
  'Nike', 'Adidas', 'Puma', 'Reebok', 'Yonex', 'MRF', 'SG Cricket', 'DSC',
  'Kookaburra', 'Gray-Nicolls', 'GM Cricket', 'New Balance',
]

const BRANDS_ROW2 = [
  'Under Armour', 'Asics', 'Wilson', 'Victor', 'Li-Ning', 'Nivia',
  'Spartan', 'SS Cricket', 'Cosco', 'Hummel', 'Umbro', 'Sparx',
]

function BrandMarquee({ brands, reverse = false }: { brands: string[]; reverse?: boolean }) {
  const doubled = [...brands, ...brands]
  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: `${reverse ? 'brand-reverse' : 'brand-forward'} 30s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((name, i) => (
          <span key={`${name}-${i}`} className="inline-flex items-center">
            <span className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-widest uppercase text-gray-900 px-6 md:px-8 hover:text-brand-orange transition-colors duration-300 cursor-default">
              {name}
            </span>
            <span className="text-brand-orange text-4xl md:text-5xl font-bold select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12">
        <p className="text-brand-orange font-accent text-xs font-bold tracking-[0.3em] uppercase mb-3">
          Trusted By 50,000+ Athletes
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-widest uppercase">
          TOP BRANDS
        </h2>
        <p className="text-gray-400 font-accent text-sm mt-3">
          100% genuine products from world's leading sports brands
        </p>
      </div>

      <div className="space-y-3">
        {/* Row 1 — scrolls left */}
        <BrandMarquee brands={BRANDS_ROW1} reverse={false} />
        {/* Row 2 — scrolls right */}
        <BrandMarquee brands={BRANDS_ROW2} reverse={true} />
      </div>

      <style>{`
        @keyframes brand-forward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes brand-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
