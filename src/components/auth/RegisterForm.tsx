import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthModal } from '@/context/AuthModalContext'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import type { Database } from '@/types/database'

type ProfileRole = Database['public']['Enums']['profile_role']

const roles = [
  {
    id: 'fan' as ProfileRole,
    emoji: '🎵',
    title: 'Fan / Community',
    desc: 'Entdecke Künstler & unvergessliche Events',
    gradient: 'from-blue-600/30 to-blue-800/30',
    border: 'border-blue-500/50',
    hoverBorder: 'hover:border-blue-400',
    hoverShadow: 'hover:shadow-lg hover:shadow-blue-500/30',
    selectedBorder: 'border-blue-400',
    selectedBg: 'bg-blue-500/20',
  },
  {
    id: 'artist' as ProfileRole,
    emoji: '🎤',
    title: 'Künstler',
    desc: 'Zeig dein Talent und werde gebucht',
    gradient: 'from-purple-600/30 to-purple-800/30',
    border: 'border-purple-500/50',
    hoverBorder: 'hover:border-purple-400',
    hoverShadow: 'hover:shadow-lg hover:shadow-purple-500/30',
    selectedBorder: 'border-purple-400',
    selectedBg: 'bg-purple-500/20',
  },
  {
    id: 'service_provider' as ProfileRole,
    emoji: '🛠️',
    title: 'Dienstleister',
    desc: 'Verbinde dich mit Event-Planern',
    gradient: 'from-orange-700/30 to-amber-800/30',
    border: 'border-orange-500/50',
    hoverBorder: 'hover:border-orange-400',
    hoverShadow: 'hover:shadow-lg hover:shadow-orange-500/30',
    selectedBorder: 'border-orange-400',
    selectedBg: 'bg-orange-500/20',
  },
  {
    id: 'event_organizer' as ProfileRole,
    emoji: '🎉',
    title: 'Event-Veranstalter',
    desc: 'Plane perfekte Events mit den richtigen Leuten',
    gradient: 'from-teal-600/30 to-cyan-700/30',
    border: 'border-teal-500/50',
    hoverBorder: 'hover:border-teal-400',
    hoverShadow: 'hover:shadow-lg hover:shadow-teal-500/30',
    selectedBorder: 'border-teal-400',
    selectedBg: 'bg-teal-500/20',
  },
  {
    id: 'venue_owner' as ProfileRole,
    emoji: '🏢',
    title: 'Location-Inhaber',
    desc: 'Vermiete deine Location an Veranstalter',
    gradient: 'from-amber-700/30 to-orange-800/30',
    border: 'border-amber-500/50',
    hoverBorder: 'hover:border-amber-400',
    hoverShadow: 'hover:shadow-lg hover:shadow-amber-500/30',
    selectedBorder: 'border-amber-400',
    selectedBg: 'bg-amber-500/20',
  },
]

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp, signInWithGoogle } = useAuth()
  const { closeModal } = useAuthModal()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [selectedRole, setSelectedRole] = useState<ProfileRole | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const handleRoleSelect = (roleId: ProfileRole) => {
    setSelectedRole(roleId)
    setValue('role', roleId)
    setStep('details')
  }

  const onSubmit = async (data: SignupInput) => {
    setError(null)
    const { error: authError } = await signUp(data.email, data.password, {
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role,
    })

    if (authError) {
      setError(authError.message || 'Registrierung fehlgeschlagen')
      return
    }

    // Success! Close modal and navigate to home
    closeModal()
    navigate('/')
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)
    const { error: authError } = await signInWithGoogle()

    if (authError) {
      setError(authError.message || 'Google-Anmeldung fehlgeschlagen')
      setIsGoogleLoading(false)
      return
    }

    // Google OAuth will redirect, so no need to close modal or navigate
  }

  if (step === 'role') {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-2 uppercase italic">
            WILLKOMMEN BEI BLOGHEAD
          </h2>
          <p className="text-white/70">Wähle deinen Account-Typ</p>
        </div>

        {/* Role Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => handleRoleSelect(role.id)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex items-start gap-4 p-5 rounded-xl
                bg-gradient-to-br ${role.gradient}
                border-2 ${role.border} ${role.hoverBorder}
                ${role.hoverShadow}
                transition-all duration-300
                text-left
                ${index === 4 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto' : ''}
              `}
            >
              {/* Emoji */}
              <span className="text-4xl">{role.emoji}</span>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">{role.title}</h3>
                <p className="text-white/70 text-sm leading-snug">{role.desc}</p>
              </div>

              {/* Arrow Icon */}
              <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0 mt-1" />
            </motion.button>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="text-center text-white/50 text-sm uppercase tracking-wide">
          oder schnell mit
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="bg-white text-gray-700 border-none hover:bg-gray-100 font-medium disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-[#1877F2] text-white border-none hover:bg-[#166FE5] font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Toggle to Login */}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-white/70 hover:text-white text-sm transition-colors text-center"
        >
          Bereits registriert?{' '}
          <span className="text-purple-400 hover:text-purple-300 font-semibold">Anmelden</span>
        </button>
      </motion.div>
    )
  }

  // Details form step
  const selectedRoleData = roles.find((r) => r.id === selectedRole)

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with selected role */}
      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={() => setStep('role')}
          className="text-white/70 hover:text-white text-sm transition-colors"
        >
          ← Zurück zur Auswahl
        </button>
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br ${selectedRoleData?.gradient} border-2 ${selectedRoleData?.selectedBorder}`}>
          <span className="text-2xl">{selectedRoleData?.emoji}</span>
          <div className="text-left">
            <h3 className="text-white font-bold text-sm">{selectedRoleData?.title}</h3>
          </div>
          <Check className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              {...register('firstName')}
              placeholder="VORNAME"
              disabled={isSubmitting}
              className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register('lastName')}
              placeholder="NACHNAME"
              disabled={isSubmitting}
              className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="EMAIL"
            disabled={isSubmitting}
            className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder="PASSWORT (min. 8 Zeichen)"
            disabled={isSubmitting}
            className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="PASSWORT BESTÄTIGEN"
            disabled={isSubmitting}
            className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrieren...
            </>
          ) : (
            'KONTO ERSTELLEN'
          )}
        </Button>
      </div>

      {/* Toggle to Login */}
      <button
        type="button"
        onClick={onSwitchToLogin}
        disabled={isSubmitting}
        className="w-full text-white/70 hover:text-white text-sm transition-colors text-center disabled:opacity-50"
      >
        Bereits registriert?{' '}
        <span className="text-purple-400 hover:text-purple-300 font-semibold">Anmelden</span>
      </button>
    </motion.form>
  )
}
