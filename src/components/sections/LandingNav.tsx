import { motion } from 'framer-motion'
import { useAuthModal } from '@/context/AuthModalContext'

export default function LandingNav() {
  const { openModal } = useAuthModal()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-[#171717]/95 backdrop-blur-sm border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="font-display text-2xl text-white italic">BLOGHEAD</div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('register')}
            className="px-6 py-2 bg-[#610AD1] text-white rounded-full font-bold hover:bg-[#610AD1]/90 transition-colors uppercase text-sm tracking-wide"
          >
            REGISTRIEREN
          </button>
          <button
            onClick={() => openModal('login')}
            className="px-6 py-2 border border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors uppercase text-sm tracking-wide"
          >
            SIGN IN
          </button>
        </div>
      </div>
    </motion.header>
  )
}
