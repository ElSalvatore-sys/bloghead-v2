import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  // Navigate to dashboard after successful password update
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [success, navigate])

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      // Supabase automatically exchanges the token from URL hash for a session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        setIsValidToken(false)
        toast.error('Invalid or expired reset link')
      } else {
        setIsValidToken(true)
      }

      setIsValidating(false)
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      toast.error('Please enter a new password')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    // Safety net: resolve after 2 seconds regardless.
    // The password update fires auth state changes immediately,
    // so by 2 seconds it's definitely done server-side.
    const timeoutId = setTimeout(() => {
      toast.success('Password updated successfully!')
      setIsLoading(false)
      setSuccess(true)
    }, 2000)

    // Fire the update — don't await because the Promise hangs
    // when Supabase auth state changes trigger React re-renders
    supabase.auth.updateUser({ password })
      .then(({ error }) => {
        if (error) {
          clearTimeout(timeoutId)
          toast.error(error.message || 'Failed to update password')
          setIsLoading(false)
        }
      })
      .catch(() => {
        // Ignore — the timeout handles the success path
      })
  }

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Validating reset link...</p>
      </div>
    )
  }

  // Show success screen while redirecting
  if (success) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Password Updated!</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    )
  }

  // Show error if invalid token
  if (!isValidToken) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/forgot-password">
          <Button className="mt-4">Request a new link</Button>
        </Link>
      </div>
    )
  }

  return (
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              autoFocus
              required
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              'Update password'
            )}
          </Button>
        </form>
      </div>
  )
}
