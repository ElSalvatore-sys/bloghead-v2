import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL || 'dev-user@test.com'
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!'

export { TEST_EMAIL, TEST_PASSWORD }

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: {
    id: string
    email?: string
    [key: string]: unknown
  }
}

/**
 * Authenticate via Supabase API (no browser needed).
 * Useful for pre-flight checks or future storageState-based auth.
 */
export async function getTestSession(): Promise<AuthSession> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars. ' +
        'Set them in .env.local or pass as environment variables.'
    )
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })

  if (error || !data.session) {
    throw new Error(
      `E2E auth failed for ${TEST_EMAIL}: ${error?.message ?? 'No session returned'}. ` +
        'Ensure the test user exists — run: npm run db:seed-users'
    )
  }

  return data.session as AuthSession
}

/**
 * Derive the localStorage key Supabase uses for storing the session.
 * Format: sb-<project-ref>-auth-token
 */
export function getSupabaseStorageKey(): string {
  const url = new URL(SUPABASE_URL)
  const projectRef = url.hostname.split('.')[0]
  return `sb-${projectRef}-auth-token`
}
