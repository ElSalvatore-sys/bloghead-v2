import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Database } from '@/types/database'

type ProfileRole = Database['public']['Enums']['profile_role']

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
          // Handle pending role from OAuth signup
          const pendingRole = localStorage.getItem('pending_signup_role')
          if (pendingRole) {
            localStorage.removeItem('pending_signup_role')

            // Validate and cast to ProfileRole
            const validRoles: ProfileRole[] = ['USER', 'ARTIST', 'VENUE', 'ADMIN']
            const role = validRoles.includes(pendingRole as ProfileRole)
              ? (pendingRole as ProfileRole)
              : 'USER'

            // Retry logic for race condition with trigger
            // The trigger may not have created the profile yet
            const maxRetries = 3
            for (let i = 0; i < maxRetries; i++) {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', data.session.user.id)

              if (!updateError) break

              if (i < maxRetries - 1) {
                // Wait 500ms before retry
                await new Promise((r) => setTimeout(r, 500))
              } else {
                console.error('Failed to update role after retries:', updateError)
              }
            }
          }

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
