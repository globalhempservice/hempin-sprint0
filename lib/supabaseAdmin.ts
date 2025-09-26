import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server secret

if (!url) console.error('[supabaseAdmin] Missing NEXT_PUBLIC_SUPABASE_URL');
if (!key) console.error('[supabaseAdmin] Missing SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});