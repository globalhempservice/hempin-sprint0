// pages/account/profile.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import SidebarLayout from '../../components/SidebarLayout'

type ProfileRow = {
  id?: string
  user_id?: string
  display_name?: string | null
  persona?: string | null            // e.g., "Eco Explorer" (from onboarding)
  interests?: string[] | null        // array of tags from onboarding
  goals?: string[] | null            // array of goals from onboarding
  location?: string | null
  created_at?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!alive) return

      if (!user) {
        router.replace(`/signin?next=${encodeURIComponent('/account/profile')}`)
        return
      }
      setEmail(user.email || '')

      // Try to load profile; be resilient if columns don’t exist yet
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!alive) return
      setProfile((data as ProfileRow) ?? null)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [router])

  const initials = (() => {
    const base = profile?.display_name || email.split('@')[0] || ''
    return base ? base.slice(0, 2).toUpperCase() : 'HI'
  })()

  return (
    <SidebarLayout variant="account">
      <Head><title>Profile • HEMPIN</title></Head>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/20 text-emerald-200 font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.display_name || 'Your profile'}</h1>
            <div className="text-sm opacity-75">{email}</div>
          </div>
        </div>

        <div className="card space-y-3">
          {loading && <div className="opacity-70">Loading your profile…</div>}

          {!loading && !profile && (
            <div className="space-y-3">
              <div className="opacity-80">
                We don’t have your profile details yet.
              </div>
              <Link href="/experiments/onboarding" className="btn btn-primary">
                Complete onboarding
              </Link>
            </div>
          )}

          {!loading && profile && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-60">Persona</div>
                <div className="mt-1">{profile.persona || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider opacity-60">Location</div>
                <div className="mt-1">{profile.location || '—'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs uppercase tracking-wider opacity-60">Interests</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(profile.interests || []).length
                    ? (profile.interests || []).map((t, i) => (
                        <span key={i} className="rounded-full bg-white/5 px-2 py-1 text-sm">{t}</span>
                      ))
                    : '—'}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs uppercase tracking-wider opacity-60">Goals</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(profile.goals || []).length
                    ? (profile.goals || []).map((t, i) => (
                        <span key={i} className="rounded-full bg-white/5 px-2 py-1 text-sm">{t}</span>
                      ))
                    : '—'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/experiments/onboarding" className="btn btn-outline">Edit (via onboarding)</Link>
          <Link href="/account" className="btn btn-link">← Back to account</Link>
        </div>
      </div>
    </SidebarLayout>
  )
}