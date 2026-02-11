import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const artists = [
  {
    id: '1',
    name: 'DJ MARCUS',
    description:
      'dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    image: '/images/alexander-popov-f3e6YNo3Y98-unsplash.webp',
  },
  {
    id: '2',
    name: 'LISA VOICE',
    description:
      'dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    image: '/images/jazmin-quaynor-8ALMAJP0Ago-unsplash.webp',
  },
  {
    id: '3',
    name: 'MIKE BEATS',
    description:
      'dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    image: '/images/thiago-borrere-alvim-bf8APnBxoCk-unsplash.webp',
  },
  {
    id: '4',
    name: 'ANNA STRINGS',
    description:
      'dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    image: '/images/0df1b407-55a7-4251-99e9-b54723369de6.webp',
  },
  {
    id: '5',
    name: 'TOM WAVE',
    description:
      'dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    image: '/images/curtis-potvin-XBqp-UxhCVs-unsplash.webp',
  },
]

export default function ArtistsCarouselSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = 220 // Card width + gap

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.min(artists.length - 1, currentIndex + 1))
    }
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Image - Grayscale */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/latrach-med-jamil-VD0LgaqFf4U-unsplash.webp"
          alt="Concert background"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 italic">
            Artists
          </h2>
        </motion.div>

        {/* Upgrade Your Business Section */}
        <motion.div
          className="max-w-lg mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide mb-4">
            Upgrade Your Business
          </h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
            One of the most important challenges of each artist is not only to be an
            entrepreneur, but also be an influencer, content creator and others. We will help you
            achieve your goals.
          </p>
          <Link to="/artists">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3"
            >
              Find Out More
            </Button>
          </Link>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollTo('left')}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#610AD1]/80 hover:bg-[#610AD1] disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full transition-all"
            aria-label="Previous artist"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scrollTo('right')}
            disabled={currentIndex >= artists.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#610AD1]/80 hover:bg-[#610AD1] disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full transition-all"
            aria-label="Next artist"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-none px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {artists.map((artist, index) => (
              <motion.div
                key={artist.name}
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/artists/${artist.id}`} className="block group">
                  <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                    {/* Purple Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#610AD1] z-10" />

                    {/* Artist Image */}
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Purple Overlay on Hover with Name + Description */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-[#610AD1]/0 group-hover:bg-[#610AD1]/80 transition-all duration-300">
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
                        {artist.name}
                      </h4>
                      <p className="text-white/80 text-xs leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {artist.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
