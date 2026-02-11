import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function MemberCTASection() {
  return (
    <section className="py-24 px-4 gradient-bloghead">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-8">
            Starte jetzt mit deinem Profil auf Bloghead
          </h2>

          <Link
            to="/auth/register"
            className="inline-block bg-white text-[#610AD1] px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:scale-105"
          >
            Kostenlos Registrieren
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
