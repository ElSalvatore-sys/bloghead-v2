import { motion } from 'framer-motion'
import { Users, Music, Briefcase, CalendarDays } from 'lucide-react'

const userTypes = [
  {
    icon: Users,
    title: 'Community',
    description: 'Entdecke Artists, Events und Aktionen an einem Ort. Bleib in Kontakt mit deinen Lieblingskuenstlern und verpasse nie wieder ein Event.'
  },
  {
    icon: Music,
    title: 'Artist',
    description: 'Verwalte dein Profil, teile Events und baue deine Community auf. Alle Tools fuer deinen Erfolg in einer Plattform.'
  },
  {
    icon: Briefcase,
    title: 'Dienstleister',
    description: 'Biete deine Services an, vernetze dich mit Artists und Veranstaltern. Erweitere dein Netzwerk und gewinne neue Kunden.'
  },
  {
    icon: CalendarDays,
    title: 'Veranstalter',
    description: 'Organisiere Events, manage Buchungen und arbeite mit Artists zusammen. Alles was du brauchst fuer erfolgreiche Events.'
  }
]

export default function FeaturesSection() {
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
            Für wen ist Bloghead?
          </h2>
        </motion.div>

        {/* 2x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              className="relative p-8 md:p-10 rounded-2xl overflow-hidden group"
              style={{ background: 'rgba(35, 35, 35, 0.6)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(97, 10, 209, 0.15)' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#610AD1]/10 to-[#F92B02]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <type.icon className="w-12 h-12 text-[#610AD1]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
