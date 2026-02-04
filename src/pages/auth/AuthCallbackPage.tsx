import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase puts it there after OAuth)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('OAuth callback error:', error)
          navigate('/login?error=oauth_failed', { replace: true })
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          navigate('/dashboard', { replace: true })
        } else {
          // No session found, redirect to login with error
          navigate('/login?error=oauth_failed', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        navigate('/login?error=oauth_failed', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  )
}
