/**
 * Creates the hardcoded free-access account in Supabase Auth.
 * Run once: npx tsx scripts/createFreeUser.ts
 * Requires .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set.
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email: 'krikormher@gmail.com',
  password: 'Manar300@',
  email_confirm: true,
})

if (error) {
  if (error.message.includes('already been registered')) {
    console.log('✓ User already exists.')
  } else {
    console.error('✗ Error:', error.message)
  }
} else {
  console.log('✓ Free user created:', data.user?.id)
}
