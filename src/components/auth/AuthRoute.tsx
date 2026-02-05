import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { ReactNode } from 'react'

interface AuthRouteProps {
  children: ReactNode
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (user) {
    // Redirect to the page they tried to visit or dashboard
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
