import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import SidebarLayout from '../../components/SidebarLayout'

type Row = {
  id: string
  title: string
  slug: string
  summary: string | null
  venue_name: string | null
  city: string | null
  country: string | null
  starts_at: string | null
  ends_at: string | null
  cover_url: string | null
  status: string
}

export default function EventPublic() {
  const router = useRouter()
  const { slug } = router.query
  const [row, setRow] = useState<Row | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id,title,slug,summary,venue_name,city,country,starts_at,ends_at,cover_url,status')
        .eq('slug', slug)
        .eq('status', 'approved')
        .maybeSingle()
      if (error) console.warn(error.message)
      setRow(data || null)
      setNotFound(!data)
    })()
  }, [slug])

  return (
    <SidebarLayout variant="account">
      <Head><title>{row?.title || 'Event'} • HEMPIN</title></Head>
      {!row && !notFound && <div className="p-6">Loading…</div>}
      {notFound && <div className="p-6">Event not found or not approved yet.</div>}
      {row && (
        <div className="p-4 grid gap-4">
          {row.cover_url && <img src={row.cover_url} className="rounded-xl object-cover max-h-80 w-full" />}
          <div>
            <h1 className="text-2xl font-semibold">{row.title}</h1>
            <div className="text-sm text-[var(--text-2)]">{row.city || '—'}, {row.country || '—'}</div>
          </div>
          {row.summary && <p className="text-[var(--text-2)] whitespace-pre-line">{row.summary}</p>}
          <div className="text-sm text-[var(--text-2)]">
            {row.starts_at ? new Date(row.starts_at).toLocaleString() : '—'} → {row.ends_at ? new Date(row.ends_at).toLocaleString() : '—'}
          </div>
          {row.venue_name && <div className="text-sm">Venue: {row.venue_name}</div>}
        </div>
      )}
    </SidebarLayout>
  )
}