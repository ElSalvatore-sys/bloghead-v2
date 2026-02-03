/**
 * Seed Test Users Script
 *
 * Creates test users for development using Supabase Admin API.
 * Run with: npm run db:seed-users
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables:')
  console.error('   - VITE_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to .env.local')
  console.error('Get it from: Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

// Admin client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface TestUser {
  email: string
  password: string
  role: 'USER' | 'ARTIST' | 'VENUE' | 'ADMIN'
  firstName: string
  lastName: string
}

const TEST_USERS: TestUser[] = [
  {
    email: 'dev-user@test.com',
    password: 'TestPassword123!',
    role: 'USER',
    firstName: 'Test',
    lastName: 'User'
  },
  {
    email: 'dev-artist@test.com',
    password: 'TestPassword123!',
    role: 'ARTIST',
    firstName: 'Test',
    lastName: 'Artist'
  },
  {
    email: 'dev-venue@test.com',
    password: 'TestPassword123!',
    role: 'VENUE',
    firstName: 'Test',
    lastName: 'Venue'
  },
  {
    email: 'dev-admin@test.com',
    password: 'TestPassword123!',
    role: 'ADMIN',
    firstName: 'Test',
    lastName: 'Admin'
  }
]

async function createTestUser(user: TestUser): Promise<boolean> {
  console.log(`\nCreating user: ${user.email}`)

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const exists = existingUsers?.users?.find(u => u.email === user.email)

  if (exists) {
    console.log(`   User already exists, updating role...`)

    // Update profile role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: user.role,
        first_name: user.firstName,
        last_name: user.lastName
      })
      .eq('id', exists.id)

    if (updateError) {
      console.error(`   Failed to update profile: ${updateError.message}`)
      return false
    }

    console.log(`   Profile updated with role: ${user.role}`)
    return true
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      first_name: user.firstName,
      last_name: user.lastName
    }
  })

  if (error) {
    console.error(`   Failed to create user: ${error.message}`)
    return false
  }

  console.log(`   User created with ID: ${data.user.id}`)

  // Wait a moment for the trigger to create the profile
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update profile with correct role
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName
    })
    .eq('id', data.user.id)

  if (profileError) {
    console.error(`   User created but profile update failed: ${profileError.message}`)
    return false
  }

  console.log(`   Profile updated with role: ${user.role}`)
  return true
}

async function main() {
  console.log('Seeding test users for development...\n')
  console.log('='.repeat(50))

  let successCount = 0
  let failCount = 0

  for (const user of TEST_USERS) {
    const success = await createTestUser(user)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`\nResults: ${successCount} succeeded, ${failCount} failed`)

  if (successCount === TEST_USERS.length) {
    console.log('\nAll test users ready!')
    console.log('\nTest credentials:')
    TEST_USERS.forEach(u => {
      console.log(`   ${u.role.padEnd(6)} | ${u.email} | ${u.password}`)
    })
  }
}

main().catch(console.error)
