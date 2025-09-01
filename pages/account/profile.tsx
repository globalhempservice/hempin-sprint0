// pages/account/profile.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Profile = {
  id: string
  email: string | null
  display_name: string | null
  name: string | null
  country: string | null
  persona: string | null
  interests: string[] | null
  avatar_url: string | null
  session_count: number | null
  last_seen_at: string | null
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type AvatarState = { uploading: boolean; error: string | null }

const PERSONAS = [
  { value: 'consumer', label: 'Explorer (consumer)' },
  { value: 'brand', label: 'Brand / Maker' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'farmer', label: 'Farmer / Grower' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'investor', label: 'Investor / Supporter' },
]

export default function AccountProfile() {
  const [authUserId, setAuthUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    display_name: '',
    name: '',
    country: '',
    persona: '',
    interests_text: '',
  })
  const [avatar, setAvatar] = useState<AvatarState>({ uploading: false, error: null })
  const [save, setSave] = useState<SaveState>('idle')
  const [error, setError] = useState<string | null>(null)

  // --- Load session + profile
  useEffect(() => {
    let alive = true
    const load = async () => {
      const { data: s } = await supabase.auth.getSession()
      const uid = s.session?.user?.id ?? null
      if (!alive) return
      if (!uid) {
        // AccountRouteGuard should already protect, but just in case:
        window.location.href = '/signin?next=%2Faccount%2Fprofile'
        return
      }
      setAuthUserId(uid)

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id,email,display_name,name,country,persona,interests,avatar_url,session_count,last_seen_at'
        )
        .eq('id', uid)
        .maybeSingle()

      if (!alive) return
      if (error) {
        setError(error.message)
        return
      }

      const p: Profile = data || {
        id: uid,
        email: s.session?.user?.email ?? null,
        display_name: null,
        name: null,
        country: null,
        persona: null,
        interests: null,
        avatar_url: null,
        session_count: null,
        last_seen_at: null,
      }
      setProfile(p)
      setForm({
        display_name: p.display_name ?? '',
        name: p.name ?? '',
        country: p.country ?? '',
        persona: p.persona ?? '',
        interests_text: (p.interests ?? []).join(', '),
      })
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  const initials = useMemo(() => {
    const src = profile?.display_name || profile?.name || profile?.email || ''
    const handle = src.replace(/@.*/, '')
    const parts = handle.split(/[.\s_-]+/).filter(Boolean)
    const a = (parts[0]?.[0] || '').toUpperCase()
    const b = (parts[1]?.[0] || '').toUpperCase()
    return (a + b) || (handle[0]?.toUpperCase() || 'U')
  }, [profile])

  // --- Handlers
  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setSave('idle')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUserId) return
    setSave('saving')
    setError(null)
    try {
      const interests = form.interests_text
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: authUserId,
            display_name: form.display_name || null,
            name: form.name || null,
            country: form.country || null,
            persona: form.persona || null,
            interests: interests.length ? interests : null,
          },
          { onConflict: 'id' }
        )
        .select(
          'id,email,display_name,name,country,persona,interests,avatar_url,session_count,last_seen_at'
        )
        .maybeSingle()

      if (error) throw error
      if (data) setProfile(data)
      setSave('saved')
      setTimeout(() => setSave('idle'), 1500)
    } catch (err: any) {
      setSave('error')
      setError(err?.message || 'Could not save profile')
    }
  }

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!authUserId) return
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar({ uploading: true, error: null })
    setSave('idle')

    try {
      // bucket must exist: create a public bucket named "avatars" in Supabase
      const ext = file.name.split('.').pop() || 'png'
      const path = `user-${authUserId}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = pub?.publicUrl
      if (!publicUrl) throw new Error('Could not get public URL for avatar.')

      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', authUserId)
        .select(
          'id,email,display_name,name,country,persona,interests,avatar_url,session_count,last_seen_at'
        )
        .maybeSingle()

      if (error) throw error
      if (data) setProfile(data)
    } catch (err: any) {
      setAvatar({ uploading: false, error: err?.message || 'Upload failed' })
      return
    }
    setAvatar({ uploading: false, error: null })
  }

  return (
    <div className="min-h-screen">
      <Head><title>Profile • HEMPIN</title></Head>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your profile</h1>
            <p className="text-sm text-zinc-400">Tune your identity, vibe, and preferences.</p>
          </div>
        </div>

        {/* Card: identity */}
        <div className="rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur p-4 md:p-6 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)]">
          {/* Avatar + basics */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="relative h-20 w-20 shrink-0">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full bg-zinc-800 text-lg font-semibold ring-1 ring-white/10">
                  {initials}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-semibold text-black ring-1 ring-emerald-300 hover:opacity-90">
                {avatar.uploading ? 'Uploading…' : 'Change'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarPick}
                />
              </label>
            </div>

            <div className="flex-1">
              <div className="text-sm text-zinc-400">Signed in as</div>
              <div className="text-base font-medium">{profile?.email || '—'}</div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
                <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
                  Sessions: {profile?.session_count ?? 0}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
                  Last seen: {profile?.last_seen_at ? new Date(profile.last_seen_at).toLocaleString() : '—'}
                </span>
              </div>
            </div>
          </div>

          {avatar.error && (
            <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
              {avatar.error}
            </div>
          )}

          {/* Editable form */}
          <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-zinc-300">Display name</span>
              <input
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                value={form.display_name}
                onChange={handleChange('display_name')}
                placeholder="Public handle"
                autoComplete="nickname"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-300">Full name</span>
              <input
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-300">Country</span>
              <input
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                value={form.country}
                onChange={handleChange('country')}
                placeholder="Where are you based?"
                autoComplete="country-name"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-300">Persona</span>
              <select
                className="input mt-1 w-full text-white"
                value={form.persona}
                onChange={handleChange('persona')}
              >
                <option value="" className="bg-black">Choose your vibe…</option>
                {PERSONAS.map(p => (
                  <option key={p.value} value={p.value} className="bg-black">
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 block">
              <span className="text-sm text-zinc-300">Interests</span>
              <input
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                value={form.interests_text}
                onChange={handleChange('interests_text')}
                placeholder="e.g., fashion, home, food, cosmetics"
                autoComplete="off"
              />
              <div className="mt-1 text-xs text-zinc-500">Comma-separated.</div>
            </label>

            {/* Save actions */}
            <div className="md:col-span-2 mt-2 flex items-center justify-between gap-3">
              <div className="text-sm">
                {save === 'error' && error && (
                  <span className="text-red-300">{error}</span>
                )}
                {save === 'saved' && <span className="text-emerald-300">Saved ✓</span>}
              </div>
              <button
                type="submit"
                disabled={save === 'saving'}
                className="btn btn-primary"
              >
                {save === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Badges */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Badges & achievements</h2>
            <a href="/experiments/badges" className="text-sm text-emerald-300 hover:underline">
              How badges work
            </a>
          </div>
          {/* Placeholder: wire once badge tables are live */}
          <div className="text-sm text-zinc-400">
            Your badges will show up here as you explore HEMPIN.
          </div>
        </div>
      </div>
    </div>
  )
}