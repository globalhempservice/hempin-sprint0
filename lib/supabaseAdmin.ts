// lib/supabaseAdmin.ts (unchanged if you already have it)
// Included here for completeness of the patch.
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false }
})
