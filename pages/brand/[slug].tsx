import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import SidebarLayout from '../../components/SidebarLayout'

type Row = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  cover_url: string | null
  category: string | null
  website: string | null
  approved: boolean
}

export default function BrandPublic() {
  const router = useRouter()
  const { slug } = router.query
  const [row, setRow] = useState<Row | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id,name,slug,description,logo_url,cover_url,category,website,approved')
        .eq('slug', slug)
        .eq('approved', true)
        .maybeSingle()
      if (error) console.warn(error.message)
      setRow(data || null)
      setNotFound(!data)
    })()
  }, [slug])

  return (
    <SidebarLayout variant="account">
      <Head><title>{row?.name || 'Brand'} • HEMPIN</title></Head>
      {!row && !notFound && <div className="p-6">Loading…</div>}
      {notFound && <div className="p-6">Brand not found or not approved yet.</div>}
      {row && (
        <div className="p-4 grid gap-4">
          {row.cover_url && <img src={row.cover_url} className="rounded-xl object-cover max-h-80 w-full" />}
          <div className="flex items-center gap-3">
            {row.logo_url ? <img src={row.logo_url} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-white/10" />}
            <div>
              <h1 className="text-2xl font-semibold">{row.name}</h1>
              <div className="text-sm text-[var(--text-2)]">{row.category || '—'}</div>
            </div>
          </div>
          {row.description && <p className="text-[var(--text-2)] whitespace-pre-line">{row.description}</p>}
          {row.website && <a className="underline" href={row.website} target="_blank" rel="noreferrer">Visit website →</a>}
        </div>
      )}
    </SidebarLayout>
  )
}