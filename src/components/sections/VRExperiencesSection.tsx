import { motion } from 'framer-motion'

export default function VRExperiencesSection() {
  return (
    <section className="py-24 px-4 bg-[#171717]">
      <div className="max-w-7xl mx-auto">
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Image with Orange Accent Bar */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-lg overflow-hidden">
              {/* Orange Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FB7A43] z-10" />

              {/* VR Image */}
              <img
                src="/images/minh-pham-jSAb1ifwf8Y-unsplash.webp"
                alt="VR Experience"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Gradient Card with Text */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 md:p-12 rounded-2xl gradient-bloghead">
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                VR Experiences
              </h2>

              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                Hier Steht Noch Blindtext
              </p>

              <p className="text-white/80 mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>

              <button className="bg-white text-[#610AD1] px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105">
                Find Out More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
