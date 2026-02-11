import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useAuthModal } from '@/context/AuthModalContext'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { signIn, signInWithGoogle } = useAuth()
  const { closeModal } = useAuthModal()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    const { error: authError } = await signIn(data.email, data.password)

    if (authError) {
      setError(authError.message || 'Anmeldung fehlgeschlagen')
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

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <h2 className="font-display text-3xl font-bold text-white text-center uppercase italic">
        LETS WORK TOGETHER!
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="EMAIL"
            disabled={isSubmitting}
            className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder="PASSWORT"
            disabled={isSubmitting}
            className="bg-white/5 border-2 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
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
              Anmelden...
            </>
          ) : (
            'LOGIN!'
          )}
        </Button>
      </div>

      {/* Forgot Password */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Passwort vergessen?
        </button>
      </div>

      {/* Divider */}
      <div className="text-center text-white/50 text-sm">oder</div>

      {/* Social Logins */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full bg-white text-gray-700 border-none hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
          Mit Google anmelden
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="w-full bg-[#1877F2] text-white border-none hover:bg-[#166FE5] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Mit Facebook anmelden
        </Button>
      </div>

      {/* Toggle to Register */}
      <button
        type="button"
        onClick={onSwitchToRegister}
        disabled={isSubmitting}
        className="w-full text-white/70 hover:text-white text-sm transition-colors text-center disabled:opacity-50"
      >
        Noch kein Mitglied?{' '}
        <span className="text-purple-400 hover:text-purple-300 font-semibold">Registrieren</span>
      </button>
    </motion.form>
  )
}
