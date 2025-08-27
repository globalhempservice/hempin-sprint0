// lib/useEntitlements.ts
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export type Entitlements = {
  brand_page: boolean
  product_slots: number
  popup_bkk_2025: boolean
  popup_extras: number
}

export function useEntitlements() {
  const [data, setData] = useState<Entitlements | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setData(null)
          setLoading(false)
          return
        }
        const { data: eData, error: eErr } = await supabase
          .from('entitlements')
          .select('brand_page,product_slots,popup_bkk_2025,popup_extras')
          .eq('user_id', user.id)
          .maybeSingle()
        if (eErr) throw eErr
        setData(
          (eData as any) ?? {
            brand_page: false,
            product_slots: 0,
            popup_bkk_2025: false,
            popup_extras: 0,
          }
        )
      } catch (e: any) {
        setError(e?.message || 'Failed to load entitlements.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { data, loading, error }
}
