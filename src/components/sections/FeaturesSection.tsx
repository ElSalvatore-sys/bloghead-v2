import { motion } from 'framer-motion'
import { Users, Music, Briefcase, CalendarDays } from 'lucide-react'

const userTypes = [
  {
    icon: Users,
    title: 'COMMUNITY',
    description:
      'Du willst wissen, was bei deinen Lieblingsacts abgeht und neue Artists entdecken, ohne zehn Apps zu checken? Mit deinem kostenlosen Profil folgst und supportest du Artists, findest Events & Tickets an einem Ort, staerkst lokale Acts, triffst Gleichgesinnte und bekommst exklusive Einblicke & Specials.',
  },
  {
    icon: Music,
    title: 'ARTIST',
    description:
      'Dein Artist-Profil buendelt Buchungen, Gigs, Kontakte & Rechnungen und hilft dir gleichzeitig, Reichweite, Fanbase und Einnahmen ueber Gigs, Links & Merch auszubauen.',
  },
  {
    icon: Briefcase,
    title: 'DIENSTLEISTER',
    description:
      'Mit deinem Dienstleister-Profil nutzt du alle Office-Funktionen fuer Angebote, Vertraege, Rechnungen & Kontakte und wirst gleichzeitig fuer Events gefunden, gebucht und baust deinen Kundenstamm systematisch aus.',
  },
  {
    icon: CalendarDays,
    title: 'VERANSTALTER',
    description:
      'Mit deinem Veranstalter-Profil planst du deine Events einfach auf einer Plattform, buendelst Anfragen, Buchungen, Vertraege & Rechnungen und hast passende Artists und Dienstleister direkt an deiner Seite.',
  },
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
            Fuer wen ist Bloghead?
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
