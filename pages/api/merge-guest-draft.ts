// pages/api/merge-guest-draft.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { user_id, draft } = req.body as {
      user_id: string,
      draft: {
        name?: string,
        tagline?: string,
        description?: string,
        category?: string,
        heroUrl?: string,
        hasProduct?: boolean
      }
    }
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' })

    // derive a simple slug if needed
    const slug =
      (draft?.name || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || null

    // Upsert minimal brand row for this owner if none
    // NOTE: adapt column names to your `brands` table
    const { data: existingBrand } = await supabaseAdmin
      .from('brands')
      .select('id')
      .eq('owner_id', user_id)
      .maybeSingle()

    const payload: any = {
      owner_id: user_id,
      name: draft?.name ?? null,
      tagline: draft?.tagline ?? null,
      description: draft?.description ?? null,
      category: draft?.category ?? null,
      slug
    }

    if (existingBrand?.id) {
      await supabaseAdmin.from('brands').update(payload).eq('id', existingBrand.id)
    } else {
      await supabaseAdmin.from('brands').insert(payload)
    }

    // (Optional) You could also create a placeholder product if hasProduct is true.

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'merge failed' })
  }
}