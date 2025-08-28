import { supabase } from './supabaseClient'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthChange(cb: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(cb)
}