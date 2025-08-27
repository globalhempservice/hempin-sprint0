// lib/useBrand.ts
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export type BrandRow = {
  id: string
  owner_id: string
  name: string | null
  description: string | null
  category: string | null
  website_url: string | null
  hero_image_url: string | null
  logo_url: string | null
  slug: string | null
}

export function useBrand() {
  const [brand, setBrand] = useState<BrandRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let sub: any
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setBrand(null); setLoading(false); return }

        // initial fetch
        const { data, error } = await supabase
          .from('brands')
          .select('id,owner_id,name,description,category,website_url,hero_image_url,logo_url,slug')
          .eq('owner_id', user.id)
          .maybeSingle()
        if (error) throw error
        setBrand(data as any ?? null)

        // realtime updates on this user's brand
        sub = supabase
          .channel('brand-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'brands',
            filter: `owner_id=eq.${user.id}`,
          }, (payload) => {
            if (payload.eventType === 'DELETE') setBrand(null)
            else setBrand(payload.new as any)
          })
          .subscribe()
      } catch (e: any) {
        setError(e?.message || 'Failed to load brand')
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      if (sub) supabase.removeChannel(sub)
    }
  }, [])

  return { brand, loading, error }
}
