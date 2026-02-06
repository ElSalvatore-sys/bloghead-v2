import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { supabase } from '@/services/supabase'
import { queryClient } from '@/lib/query-client'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; role?: string }
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, signal?: AbortSignal) => {
    console.log('[Auth] fetchProfile called for:', userId)
    try {
      // Use provided signal (from useEffect cleanup) or create a local 5s timeout
      let localController: AbortController | undefined
      let timeoutId: ReturnType<typeof setTimeout> | undefined
      const effectiveSignal = signal ?? (() => {
        localController = new AbortController()
        timeoutId = setTimeout(() => localController!.abort(), 5000)
        return localController.signal
      })()

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .abortSignal(effectiveSignal)
        .single()

      if (timeoutId) clearTimeout(timeoutId)

      if (error) {
        // AbortError from StrictMode cleanup — ignore silently
        if (error.message?.includes('aborted')) {
          console.debug('[Auth] Profile fetch aborted (expected during cleanup)')
          return  // Don't set profile to null — the re-mount will fetch it
        }
        // Profile might not exist yet (new user) or RLS blocked
        console.warn('[Auth] Could not fetch profile:', error.message)
        setProfile(null)
        return
      }

      console.log('[Auth] Profile loaded:', data?.email)
      setProfile(data)
    } catch (err) {
      // AbortError is expected during StrictMode cleanup — ignore silently
      if (err instanceof Error && (err.name === 'AbortError' || err.message?.includes('aborted'))) {
        console.debug('[Auth] Profile fetch aborted (expected during cleanup)')
        return
      }
      console.error('[Auth] Error fetching profile:', err)
      setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    const abortController = new AbortController()

    // Get initial session
    const initializeAuth = async () => {
      console.log('[Auth] Initializing...')
      try {
        console.log('[Auth] Getting session...')
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          if (sessionError.message?.includes('aborted')) {
            console.debug('[Auth] Session fetch aborted (expected during cleanup)')
            return
          }
          console.error('[Auth] Session error:', sessionError)
        }

        console.log('[Auth] Session:', initialSession ? 'found' : 'none')
        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          console.log('[Auth] Fetching profile...')
          await fetchProfile(initialSession.user.id, abortController.signal)
          console.log('[Auth] Profile fetched')
        }
      } catch (err) {
        if (err instanceof Error && (err.name === 'AbortError' || err.message?.includes('aborted'))) {
          console.debug('[Auth] Auth init aborted (expected during cleanup)')
          return
        }
        console.error('[Auth] Error initializing auth:', err)
      } finally {
        console.log('[Auth] Done, setting loading=false')
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }

      // Handle specific events
      if (event === 'SIGNED_OUT') {
        setProfile(null)
      }
    })

    return () => {
      abortController.abort()
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; role?: string }
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { error }
  }

  const signOut = async (): Promise<void> => {
    // Clear React state immediately
    setUser(null)
    setSession(null)
    setProfile(null)

    // Clear React Query cache
    queryClient.clear()

    // Use scope:'local' to clear localStorage without a network call (can't hang)
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch {
      // Ignore - hard redirect below will reset everything
    }

    // Hard redirect to guarantee clean state
    window.location.href = '/login'
  }

  const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const resetPassword = async (
    email: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.updateUser({
      password,
    })
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
