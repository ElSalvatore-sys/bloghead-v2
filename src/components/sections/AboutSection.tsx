import { motion } from 'framer-motion'

export default function AboutSection() {
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
            Eine Plattform
          </h2>
          <p className="text-2xl text-white/70">Zwei Welten</p>
        </motion.div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Frontstage Card - Red/Orange Gradient */}
          <motion.div
            className="p-8 md:p-12 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #F92B02 0%, #FB7A43 100%)'
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(249, 43, 2, 0.2)' }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">Frontstage</h3>
            <p className="text-white/90 mb-2">Artists & ihre Community</p>
            <p className="text-white/80">
              Frontstage bringt Bloghead Artists und Community zusammen:
              Kuenstlerprofile treffen auf ihre Community, die Events, Tickets
              und Aktionen an einem Ort finden - fuer mehr Naehe, gemeinsamen
              Vibe und eine wachsende Crowd.
            </p>
          </motion.div>

          {/* Backstage Card - Purple */}
          <motion.div
            className="p-8 md:p-12 rounded-2xl bg-[#610AD1]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(97, 10, 209, 0.2)' }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">Backstage</h3>
            <p className="text-white/90 mb-2">Organisation & Verwaltung</p>
            <p className="text-white/80">
              Backstage bietet Bloghead alles fuer die Event-Orga: Angebote,
              Vertraege, Rechnungen und Frageboegen laufen mit Kontakten,
              E-Mails und Workflows in einem System zusammen - statt in
              verstreuten Postfaechern und Excel-Listen.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
