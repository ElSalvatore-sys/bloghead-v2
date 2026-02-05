import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div
      data-testid="auth-layout"
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
    >
      <Link to="/" className="mb-8" data-testid="auth-logo">
        <h1 className="text-2xl font-bold text-primary">bloghead</h1>
      </Link>
      <Outlet />
    </div>
  )
}
