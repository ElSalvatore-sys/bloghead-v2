import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import App from './App'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthRoute } from '@/components/auth/AuthRoute'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Lazy load pages for better performance
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage }))
)
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const AuthCallbackPage = lazy(() =>
  import('@/pages/auth/AuthCallbackPage').then((m) => ({
    default: m.AuthCallbackPage,
  }))
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)

// Wrapper for lazy-loaded components
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public - no layout
      {
        index: true,
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },

      // Auth pages - AuthLayout
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: (
              <AuthRoute>
                <LazyPage>
                  <LoginPage />
                </LazyPage>
              </AuthRoute>
            ),
          },
          {
            path: 'signup',
            element: (
              <AuthRoute>
                <LazyPage>
                  <SignupPage />
                </LazyPage>
              </AuthRoute>
            ),
          },
          {
            path: 'forgot-password',
            element: (
              <AuthRoute>
                <LazyPage>
                  <ForgotPasswordPage />
                </LazyPage>
              </AuthRoute>
            ),
          },
          {
            path: 'reset-password',
            element: (
              <LazyPage>
                <ResetPasswordPage />
              </LazyPage>
            ),
          },
        ],
      },

      // Auth callback - no layout (just redirect logic)
      {
        path: 'auth/callback',
        element: (
          <LazyPage>
            <AuthCallbackPage />
          </LazyPage>
        ),
      },

      // Protected pages - MainLayout
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
