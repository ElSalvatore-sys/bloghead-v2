import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function VorteileMemberSection() {
  return (
    <section className="py-24 px-4 bg-[#171717]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-5xl md:text-6xl text-white mb-8">
            Vorteile Member
          </h2>

          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <Link
            to="/auth/register"
            className="inline-block bg-[#610AD1] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#610AD1]/90 transition-all hover:scale-105"
          >
            Member Werden
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
