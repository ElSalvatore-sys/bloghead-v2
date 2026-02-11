import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Grayscale */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/alexandre-st-louis-IlfpKwRMln0-unsplash.webp"
          alt="Artist performing"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* BLOGHEAD in Hyperwave One script font */}
        <h1
          className="font-display text-white mb-4 italic"
          style={{
            fontSize: 'clamp(60px, 12vw, 160px)',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
          }}
        >
          BLOGHEAD
        </h1>

        {/* Tagline */}
        <p
          className="text-white text-2xl md:text-3xl mb-8 tracking-wider"
          style={{ letterSpacing: '0.1em' }}
        >
          BACKSTAGE CONTROL, FRONTSTAGE CONNECTION
        </p>

        {/* Subtitle */}
        <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto">
          Von der ersten Anfrage bis zum letzten Applaus: Bloghead bringt
          Eventbuero, Dienstleisternetzwerk, Artists und Community auf eine
          gemeinsame Plattform.
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  )
}
