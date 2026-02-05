import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface TestUser {
  label: string
  email: string
  icon: string
}

const TEST_USERS: TestUser[] = [
  { label: 'User', email: 'dev-user@test.com', icon: '👤' },
  { label: 'Artist', email: 'dev-artist@test.com', icon: '🎤' },
  { label: 'Venue', email: 'dev-venue@test.com', icon: '🏢' },
  { label: 'Admin', email: 'dev-admin@test.com', icon: '⚙️' },
]

const TEST_PASSWORD = 'TestPassword123!'

export function DevAuthPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { user, profile, signIn, signOut } = useAuth()

  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null
  }

  // Keyboard shortcut: Ctrl+Shift+D (or Cmd+Shift+D on Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsCollapsed((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleQuickLogin = async (testUser: TestUser) => {
    setIsLoading(testUser.email)

    const { error } = await signIn(testUser.email, TEST_PASSWORD)

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Test user not found. Create in Supabase Dashboard first.')
      } else {
        toast.error(`Login failed: ${error.message}`)
      }
    } else {
      toast.success(`Logged in as ${testUser.email}`)
    }

    setIsLoading(null)
  }

  const handleLogout = async () => {
    setIsLoading('logout')
    try {
      await signOut()
      toast.success('Logged out')
    } catch {
      toast.error('Logout failed, clearing session locally')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-zinc-900/90 text-white px-3 py-2 rounded-lg shadow-lg text-xs hover:bg-zinc-800 transition-colors"
          title="Dev Auth Panel (Ctrl+Shift+D)"
        >
          🔐 Dev
        </button>
      ) : (
        <div className="bg-zinc-900/90 text-white rounded-lg shadow-xl p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Dev Auth Panel</span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-zinc-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {user ? (
            <div className="space-y-3">
              <div className="bg-zinc-800 rounded p-2 text-xs">
                <div className="text-zinc-400">Logged in as:</div>
                <div className="font-mono truncate">{user.email}</div>
                {profile && (
                  <div className="text-zinc-400 mt-1">
                    Role:{' '}
                    <span className="text-emerald-400">{profile.role}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleLogout}
                disabled={isLoading === 'logout'}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {isLoading === 'logout' ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-zinc-400 mb-2">Quick login as:</div>
              <div className="grid grid-cols-2 gap-2">
                {TEST_USERS.map((testUser) => (
                  <Button
                    key={testUser.email}
                    onClick={() => handleQuickLogin(testUser)}
                    disabled={isLoading !== null}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    {isLoading === testUser.email ? (
                      '...'
                    ) : (
                      <>
                        {testUser.icon} {testUser.label}
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-zinc-700">
            <div className="text-[10px] text-zinc-500 text-center">
              Ctrl+Shift+D to toggle
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
