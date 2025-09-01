// pages/account/profile.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Profile = {
  id: string
  email: string | null
  name: string | null
  display_name: string | null
  avatar_url: string | null
  persona: string | null
  interests: string[] | null
  country: string | null
  city: string | null
  session_count: number | null
  last_seen_at: string | null
}

type Badge = {
  id: string
  slug: string | null
  title: string | null
  description: string | null
  icon: string | null
  awarded_at?: string | null
}

export default function AccountProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [error, setError] = useState<string | null>(null)

  // Local edit form state
  const [form, setForm] = useState({
    display_name: '',
    avatar_url: '',
    country: '',
    city: '',
  })

  const initials = useMemo(() => {
    const base = profile?.display_name || profile?.name || profile?.email || ''
    const cleaned = base.replace(/@.*/, '')
    const parts = cleaned.split(/[.\s_-]+/).filter(Boolean)
    if (parts.length === 0) return base.slice(0, 1).toUpperCase()
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  }, [profile])

  useEffect(() => {
    let alive = true

    const ensureProfileRow = async (userId: string, email: string | null) => {
      // Try to get an existing profile first
      const { data: pRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (pRow) return pRow as Profile

      // Create a minimal row if missing (RLS allows self insert per policy)
      const insert = {
        id: userId,
        email,
        display_name: email,
        session_count: 1,
        last_seen_at: new Date().toISOString(),
      }
      const { data, error } = await supabase.from('profiles').insert(insert).select('*').single()
      if (error) throw error
      return data as Profile
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: userRes, error: userErr } = await supabase.auth.getUser()
        if (userErr) throw userErr
        const user = userRes.user
        if (!user) throw new Error('Not signed in')

        const p = await ensureProfileRow(user.id, user.email ?? null)

        // Pull user badges (two-step to be safe with relationships)
        const { data: ub, error: ubErr } = await supabase
          .from('user_badges')
          .select('badge_id,awarded_at')
          .eq('user_id', user.id)
          .order('awarded_at', { ascending: false })

        if (ubErr) throw ubErr
        let badgeList: Badge[] = []
        if (ub && ub.length) {
          const ids = ub.map((r) => r.badge_id)
          const { data: bRows, error: bErr } = await supabase
            .from('badges')
            .select('id,slug,title,description,icon')
            .in('id', ids)

          if (bErr) throw bErr
          const map = new Map<string, { awarded_at: string | null }>()
          ub.forEach((r) => map.set(r.badge_id as string, { awarded_at: r.awarded_at }))
          badgeList = (bRows ?? []).map((b) => ({
            ...b,
            awarded_at: map.get(b.id)?.awarded_at ?? null,
          })) as Badge[]
        }

        if (!alive) return
        setProfile(p)
        setBadges(badgeList)
        // Seed edit form
        setForm({
          display_name: p.display_name ?? '',
          avatar_url: p.avatar_url ?? '',
          country: p.country ?? '',
          city: p.city ?? '',
        })
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || 'Failed to load profile')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)
    try {
      const updates = {
        display_name: form.display_name.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
        country: form.country.trim() || null,
        city: form.city.trim() || null,
        last_seen_at: new Date().toISOString(),
      }
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select('*')
        .single()
      if (error) throw error
      setProfile(data as Profile)
      setEditOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const niceDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString() : '—'

  // ---------- UI ----------
  return (
    <>
      <Head>
        <title>Profile • HEMPIN</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* HERO — holographic feel */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_-10%,rgba(34,197,94,0.35),transparent_60%),radial-gradient(60%_50%_at_90%_-10%,rgba(168,85,247,0.25),transparent_60%),radial-gradient(80%_70%_at_50%_110%,rgba(16,185,129,0.25),transparent_60%)]" />
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-16 md:pt-20">
            {/* Top row */}
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl ring-1 ring-emerald-400/40 sm:h-24 sm:w-24">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-emerald-300">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-2xl font-bold md:text-3xl">
                  {profile?.display_name || profile?.name || 'Your profile'}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                  <span className="truncate">{profile?.email ?? '—'}</span>
                  {profile?.persona && (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                      {profile.persona}
                    </span>
                  )}
                  {profile?.city || profile?.country ? (
                    <span className="rounded-full border border-zinc-700 bg-zinc-800/70 px-2 py-0.5">
                      {(profile.city ? `${profile.city}, ` : '') +
                        (profile.country ?? '')}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditOpen(true)}
                className="btn btn-outline btn-sm shrink-0"
              >
                Edit
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <StatChip label="Leaves" value={profile?.session_count ?? 0} />
              <StatChip label="Badges" value={badges.length} />
              <StatChip label="Last seen" value={niceDate(profile?.last_seen_at)} />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="mx-auto max-w-6xl px-4 pb-20">
          {loading ? (
            <div className="mt-8 text-zinc-400">Loading profile…</div>
          ) : error ? (
            <div className="mt-8 text-red-400">{error}</div>
          ) : (
            <>
              {/* About card */}
              <section className="card">
                <h2 className="mb-2 text-lg font-semibold">About</h2>
                <div className="space-y-3 text-sm text-zinc-300">
                  <Row label="Display name" value={profile?.display_name || '—'} />
                  <Row label="Email" value={profile?.email || '—'} />
                  <Row label="Location" value={(profile?.city ? `${profile.city}, ` : '') + (profile?.country ?? '—')} />
                  <Row
                    label="Interests"
                    value={
                      profile?.interests?.length
                        ? profile.interests.join(' • ')
                        : '—'
                    }
                  />
                </div>
              </section>

              {/* Badges scroller */}
              <section className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Badges</h2>
                  <span className="text-sm text-zinc-400">
                    {badges.length ? `${badges.length} earned` : 'No badges yet'}
                  </span>
                </div>

                {badges.length ? (
                  <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        className="snap-start rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30">
                            {/* Simple icon fallback */}
                            <span className="text-lg">{(b.icon ?? '🌿').slice(0, 2)}</span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {b.title || b.slug || 'Badge'}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {b.awarded_at
                                ? new Date(b.awarded_at).toLocaleDateString()
                                : '—'}
                            </div>
                          </div>
                        </div>
                        {b.description && (
                          <p className="mt-2 max-w-xs text-sm text-zinc-400">
                            {b.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <p className="text-sm text-zinc-400">
                      Complete onboarding and explore HEMPIN to earn your first
                      badge.
                    </p>
                    <div className="mt-3">
                      <Link href="/experiments/onboarding" className="btn btn-primary btn-sm">
                        Start onboarding
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {/* Helpful links */}
              <section className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link href="/account" className="card hover:ring-emerald-500/30">
                  <div className="text-sm font-semibold">Account home →</div>
                  <p className="mt-1 text-sm text-zinc-400">
                    Manage your brand, products, and services.
                  </p>
                </Link>
                <Link href="/experiments" className="card hover:ring-emerald-500/30">
                  <div className="text-sm font-semibold">Experiments →</div>
                  <p className="mt-1 text-sm text-zinc-400">
                    Try new features early and earn achievements.
                  </p>
                </Link>
              </section>
            </>
          )}
        </div>

        {/* EDIT SHEET */}
        {editOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-5 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[520px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit profile</h3>
                <button
                  className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:text-white"
                  onClick={() => setEditOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-zinc-400">Display name</span>
                  <input
                    className="input mt-1 w-full"
                    value={form.display_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, display_name: e.target.value }))
                    }
                    placeholder="How people will see you"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-zinc-400">Avatar URL</span>
                  <input
                    className="input mt-1 w-full"
                    value={form.avatar_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, avatar_url: e.target.value }))
                    }
                    placeholder="https://…"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-zinc-400">City</span>
                    <input
                      className="input mt-1 w-full"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="Your city"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-zinc-400">Country</span>
                    <input
                      className="input mt-1 w-full"
                      value={form.country}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, country: e.target.value }))
                      }
                      placeholder="Country"
                    />
                  </label>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="mt-2 flex items-center justify-end gap-3">
                  <button
                    className="btn btn-outline"
                    onClick={() => setEditOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={saveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ---------- little UI helpers ----------
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-400">{label}</span>
      <span className="text-right">{value || '—'}</span>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}