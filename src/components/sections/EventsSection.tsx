import { motion } from 'framer-motion'

const eventImages = [
  { src: '/images/joshua-fuller-ta7rN3NcWyM-unsplash.webp', alt: 'Event 1' },
  { src: '/images/miguel-davis-V6K83zGHkUE-unsplash.webp', alt: 'Event 2' },
  { src: '/images/luis-reynoso-J5a0MRXVnUI-unsplash.webp', alt: 'Event 3' },
  { src: '/images/german-lopez-sP45Es070zI-unsplash.webp', alt: 'Event 4', featured: true },
  { src: '/images/leonardo-zorzi-vVtkT4ny8hM-unsplash.webp', alt: 'Event 5' },
  { src: '/images/niclas-moser-OjWNwULqFek-unsplash.webp', alt: 'Event 6' }
]

export default function EventsSection() {
  return (
    <section className="py-24 px-4 bg-[#171717]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
            Events
          </h2>
        </motion.div>

        {/* Complex 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Column 1: Single image bottom-left aligned */}
          <motion.div
            className="md:row-span-2 flex items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden group">
              <img
                src={eventImages[0].src}
                alt={eventImages[0].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>

          {/* Column 2: Two stacked images */}
          <div className="flex flex-col gap-4 md:gap-6">
            <motion.div
              className="relative h-[200px] md:h-[195px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <img
                src={eventImages[1].src}
                alt={eventImages[1].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>

            <motion.div
              className="relative h-[200px] md:h-[195px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={eventImages[2].src}
                alt={eventImages[2].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Purple accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#610AD1]" />
            </motion.div>
          </div>

          {/* Column 3: Large featured image with text overlay */}
          <motion.div
            className="md:row-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group">
              <img
                src={eventImages[3].src}
                alt={eventImages[3].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Purple accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#610AD1]" />
              {/* Text overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-center p-6">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    Featured Event
                  </h3>
                  <p className="text-white/80 text-sm">
                    Erlebe unvergessliche Momente
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Two stacked images */}
          <div className="flex flex-col gap-4 md:gap-6">
            <motion.div
              className="relative h-[200px] md:h-[195px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={eventImages[4].src}
                alt={eventImages[4].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>

            <motion.div
              className="relative h-[200px] md:h-[195px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <img
                src={eventImages[5].src}
                alt={eventImages[5].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Purple accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#610AD1]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
