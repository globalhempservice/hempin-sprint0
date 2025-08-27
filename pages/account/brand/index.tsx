
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuthGuard } from '../../../lib/authGuard'
import { Stepper } from '../../../components/Stepper'
import { Alert } from '../../../components/Alert'

type BrandDraft = {
  id?: string
  name: string
  slug: string
  tagline?: string
  description?: string
  category?: 'Fashion'|'Beauty'|'Homeware'|'Food & Drinks'|'Wellness'|'Innovation'|'Cannabis'
  website?: string
}

export default function BrandOnboarding() {
  const { ready, user } = useAuthGuard()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [brand, setBrand] = useState<BrandDraft>({ name: '', slug: '' })
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState<{kind:'info'|'success'|'error', text:string}|null>(null)

  useEffect(() => {
    if (!ready || !user) return
    const load = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle()
      if (!error && data) {
        setBrand({
          id: data.id,
          name: data.name || '',
          slug: data.slug || '',
          tagline: data.tagline || '',
          description: data.description || '',
          category: data.category,
          website: data.website || ''
        })
      }
    }
    load()
  }, [ready, user])

  const slugify = (s:string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')

  const ensureDraft = async () => {
    if (!user) throw new Error('Not signed in.')
    if (!brand.name?.trim()) throw new Error('Please provide a brand name.')
    setSaving(true)
    try {
      const payload = {
        id: brand.id,
        name: brand.name,
        slug: brand.slug || slugify(brand.name),
        tagline: brand.tagline,
        description: brand.description,
        category: brand.category || 'Fashion',
        website: brand.website,
        owner_id: user.id,
        approved: false,
        embargo_date: '2025-11-01'
      }
      const { data, error } = await supabase.from('brands').upsert(payload).select().single()
      if (error) throw error
      setBrand(b => ({...b, id: data.id, slug: data.slug}))
      return data.id as string
    } finally {
      setSaving(false)
    }
  }

  const saveDraft = async () => {
    try {
      await ensureDraft()
      setMessage({ kind:'success', text:'Draft saved.' })
      setTimeout(()=>setMessage(null), 2500)
    } catch (e:any) {
      setMessage({ kind:'error', text: e?.message || 'Save failed.' })
    }
  }

  const nextStep = async () => {
    try {
      await ensureDraft()
      setStep(s => Math.min(3, s+1))
    } catch (e:any) {
      setMessage({ kind:'error', text: e?.message || 'Please fill required fields.' })
    }
  }

  const submitForReview = async () => {
    if (!user) { setMessage({kind:'error', text:'Please sign in first.'}); return }
    setSaving(true)
    try {
      const brandId = await ensureDraft()
      const { data: existing, error: exErr } = await supabase
        .from('submissions')
        .select('id,status')
        .eq('brand_id', brandId)
        .in('status',['submitted','approved'])
        .limit(1)
      if (exErr) throw exErr
      if (existing && existing.length) {
        setSubmitted(true)
        setMessage({ kind:'success', text:'Already submitted. We’ll review shortly.' })
        return
      }
      const { error: subErr } = await supabase.from('submissions').insert({
        user_id: user.id,
        brand_id: brandId,
        status: 'submitted',
        notes_user: notes,
        submitted_at: new Date().toISOString()
      })
      if (subErr) throw subErr
      setSubmitted(true)
      setMessage({ kind:'success', text:'Submitted for review. You will be notified after moderation.' })
    } catch (e:any) {
      setMessage({ kind:'error', text: e?.message || 'Submit failed.' })
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  const steps = [
    { id:1, title:'Basics', current: step===1, completed: step>1 },
    { id:2, title:'Category & Links', current: step===2, completed: step>2 },
    { id:3, title:'Review & Submit', current: step===3, completed: submitted },
  ]

  return (
    <main className="container space-y-6">
      <h1 className="text-2xl font-bold">My Brand</h1>
      <Stepper steps={steps} />
      {message && <Alert kind={message.kind}>{message.text}</Alert>}

      {step === 1 && (
        <section className="card space-y-3 max-w-2xl">
          <label className="block text-sm">Brand name *</label>
          <input className="w-full p-2 rounded bg-black/30 border border-white/10" value={brand.name} onChange={e=>setBrand({...brand, name:e.target.value})} placeholder="Global Hemp Service"/>
          <label className="block text-sm">Tagline</label>
          <input className="w-full p-2 rounded bg-black/30 border border-white/10" value={brand.tagline||''} onChange={e=>setBrand({...brand, tagline:e.target.value})} placeholder="Hemp-forward apparel"/>
          <label className="block text-sm">Short Description</label>
          <textarea className="w-full p-2 rounded bg-black/30 border border-white/10" rows={4} value={brand.description||''} onChange={e=>setBrand({...brand, description:e.target.value})} />
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={saveDraft} disabled={saving}>Save draft</button>
            <button className="btn btn-primary" onClick={nextStep} disabled={saving || !brand.name?.trim()}>Next</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card space-y-3 max-w-2xl">
          <label className="block text-sm">Category</label>
          <select className="w-full p-2 rounded bg-black/30 border border-white/10" value={brand.category||'Fashion'} onChange={e=>setBrand({...brand, category: e.target.value as any})}>
            <option>Fashion</option>
            <option>Beauty</option>
            <option>Homeware</option>
            <option>Food & Drinks</option>
            <option>Wellness</option>
            <option>Innovation</option>
            <option>Cannabis</option>
          </select>
          <label className="block text-sm">Website</label>
          <input className="w-full p-2 rounded bg-black/30 border border-white/10" value={brand.website||''} onChange={e=>setBrand({...brand, website:e.target.value})} placeholder="https://example.com" />
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={saveDraft} disabled={saving}>Save draft</button>
            <button className="btn btn-primary" onClick={()=>setStep(3)} disabled={saving}>Next</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="card space-y-3 max-w-2xl">
          <h2 className="text-xl font-semibold">Review</h2>
          <ul className="text-sm opacity-90 list-disc pl-5 space-y-1">
            <li><b>Name:</b> {brand.name || '—'}</li>
            <li><b>Category:</b> {brand.category || '—'}</li>
            <li><b>Website:</b> {brand.website || '—'}</li>
          </ul>
          <label className="block text-sm mt-2">Notes to admin (optional)</label>
          <textarea className="w-full p-2 rounded bg-black/30 border border-white/10" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Anything we should know?" />
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={saveDraft} disabled={saving}>Save draft</button>
            <button className="btn btn-primary" onClick={submitForReview} disabled={saving || !brand.name?.trim()}>
              {submitted ? 'Submitted ✓' : 'Submit for review'}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
