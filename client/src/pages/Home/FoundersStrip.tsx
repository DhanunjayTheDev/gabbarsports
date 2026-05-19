import CurvedLoop from '@/components/ui/CurvedLoop'

// Update mobile number here when ready
const MOBILE = '+91 98765 43210'

const MARQUEE =
  `GABBAR SPORTS ✦ JYOTHI PRASAD NAIDU TUNGALA ✦ VISHNU TEJA GADE ✦ ` +
  `KATAMAYYA SHANKAR ✦ BASU NAGA SESHU BABU ✦ ${MOBILE} ✦ `

export default function FoundersStrip() {
  return (
    /*
      Dark bg so the default fill:#ffffff from CurvedLoop.css shows perfectly.
      No fill override needed.
    */
    <section className="bg-[#111111] overflow-hidden">
      <CurvedLoop
        marqueeText={MARQUEE}
        speed={1.4}
        curveAmount={200}
        direction="left"
        interactive={true}
        hoverColor="#FF6B00"
      />
    </section>
  )
}
