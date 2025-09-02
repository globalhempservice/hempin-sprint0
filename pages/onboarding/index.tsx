// pages/onboarding/index.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

type Role = 'consumer' | 'pro'
type Step = 1 | 2 | 3

const CATEGORY_CHOICES = [
  'Fashion','Beauty','Wellness','Nutrition','Home','Pets','Tech','Accessories','Skincare','Supplements'
]

const PRO_MODULES = [
  { key: 'trade', label: 'Trade' },
  { key: 'events', label: 'Events' },
  { key: 'research', label: 'Research' },
  { key: 'supermarket', label: 'Supermarket tools' },
] as const

export default function Onboarding() {
  const r = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<Role>('consumer')
  const [step, setStep] = useState<Step>(1)

  // Consumer interests
  const [interests, setInterests] = useState<Set<string>>(new Set())

  // Pro modules
  const [modules, setModules] = useState<Record<string, boolean>>({
    trade: false, events: false, research: false, supermarket: false,
  })

  // Entitlements row cache (if any)
  const [entRow, setEntRow] = useState<any>(null)
  const [profileMeta, setProfileMeta] = useState<any>({})

  useEffect(() => {
    (async () => {
      try {
        const { data: s } = await (supabase as any).auth.getSession()
        const uid = s?.session?.user?.id
        if (!uid) {
          r.replace(`/join?next=${encodeURIComponent('/onboarding')}`)
          return
        }
        setUserId(uid)

        // Load profile meta + prior choices if any
        const { data: prof } = await (supabase as any)
          .from('profiles')
          .select('id, meta')
          .eq('id', uid)
          .single()

        if (prof?.meta) {
          setProfileMeta(prof.meta || {})
          const prevRole = (prof.meta.role as Role) || 'consumer'
          setRole(prevRole)
          const prevInterests = new Set<string>(prof.meta?.consumer?.interests || [])
          setInterests(prevInterests)
        }

        // Load entitlements for modules (pro)
        const { data: ent } = await (supabase as any)
          .from('entitlements')
          .select('user_id, meta')
          .eq('user_id', uid)
          .maybeSingle?.() || { data: null }

        if (ent?.meta?.modules) {
          setEntRow(ent)
          setModules({
            trade: !!ent.meta.modules.trade,
            events: !!ent.meta.modules.events,
            research: !!ent.meta.modules.research,
            supermarket: !!ent.meta.modules.supermarket,
          })
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [r])

  const canContinue = useMemo(() => {
    if (step === 1) return !!role
    if (role === 'consumer' && step === 2) return interests.size > 0
    if (role === 'pro' && step === 2) return Object.values(modules).some(Boolean)
    return true
  }, [role, step, interests, modules])

  function toggleInterest(cat: string) {
    setInterests(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function toggleModule(key: string) {
    setModules(m => ({ ...m, [key]: !m[key] }))
  }

  async function handleFinish() {
    if (!userId) return
    setSaving(true)
    setError(null)
    try {
      // Save profile meta
      const nextMeta = {
        ...(profileMeta || {}),
        role,
        consumer: role === 'consumer'
          ? { ...(profileMeta?.consumer || {}), interests: Array.from(interests) }
          : (profileMeta?.consumer || {}),
      }
      const { error: pErr } = await (supabase as any)
        .from('profiles')
        .update({ meta: nextMeta })
        .eq('id', userId)
      if (pErr) throw pErr

      // Save pro modules into entitlements
      if (role === 'pro') {
        const body = {
          user_id: userId,
          meta: { ...(entRow?.meta || {}), modules },
        }
        const { error: eErr } = await (supabase as any)
          .from('entitlements')
          .upsert(body, { onConflict: 'user_id' })
        if (eErr) throw eErr
      }

      // Route to first destination
      if (role === 'consumer') {
        r.replace('/supermarket?welcome=1')
      } else {
        r.replace('/account')
      }
    } catch (e: any) {
      setError(e?.message || 'Could not save your choices.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <FullScreen>Loading onboarding…</FullScreen>
  }

  return (
    <>
      <Head><title>Onboarding — HEMPIN</title></Head>
      <Shell>
        <Card>
          <Header>Welcome — let’s tailor HEMPIN to you</Header>

          {/* Stepper */}
          <Stepper>
            <Dot active={step===1}>1</Dot>
            <Bar/>
            <Dot active={step===2}>2</Dot>
            <Bar/>
            <Dot active={step===3}>3</Dot>
          </Stepper>

          {step === 1 && (
            {/* Step 1 */}
<Section>
  <Sub>Are you primarily a consumer or a professional?</Sub>
  <Row>
    <Choice
      active={role==='consumer'}
      onClick={()=>setRole('consumer')}
      title="Consumer"
      desc="Browse products, discover brands, and explore the Supermarket."
    />
    <Choice
      active={role==='pro'}
      onClick={()=>setRole('pro')}
      title="Pro"
      desc="Tools for trade, events, research, and vendor features."
    />
  </Row>
</Section>
          )}

          {step === 2 && role === 'consumer' && (
            <Section>
              <Sub>What product categories are you into?</Sub>
              <Chips>
                {CATEGORY_CHOICES.map(c => (
                  <Chip key={c} active={interests.has(c)} onClick={()=>toggleInterest(c)}>{c}</Chip>
                ))}
              </Chips>
              <Hint>These power your Supermarket recommendations. You can change them later.</Hint>
            </Section>
          )}

          {step === 2 && role === 'pro' && (
            <Section>
              <Sub>Enable the universes you want to use</Sub>
              <Grid>
                {PRO_MODULES.map(m => (
                  <Toggle key={m.key} active={!!modules[m.key]} onClick={()=>toggleModule(m.key)}>
                    <strong>{m.label}</strong>
                    <span>{modules[m.key] ? 'Enabled' : 'Disabled'}</span>
                  </Toggle>
                ))}
              </Grid>
              <Hint>You can manage modules anytime from your Profile.</Hint>
            </Section>
          )}

          {step === 3 && (
            <Section>
              <Sub>All set!</Sub>
              <p style={{opacity:.85}}>
                We’ll tune your experience {role==='consumer'
                  ? 'for the Supermarket and recommendations.'
                  : 'with pro tools and dashboards.'}
              </p>
            </Section>
          )}

          {error && <Err>{error}</Err>}

          <Row style={{justifyContent:'space-between', marginTop:18}}>
            <Button onClick={() => setStep(s => (s>1 ? ((s-1) as Step) : s))} disabled={step===1}>Back</Button>
            {step < 3 && (
              <Button primary disabled={!canContinue} onClick={()=>setStep((step+1) as Step)}>
                Continue
              </Button>
            )}
            {step === 3 && (
              <Button primary onClick={handleFinish} disabled={saving}>
                {saving ? 'Saving…' : 'Finish'}
              </Button>
            )}
          </Row>
        </Card>
      </Shell>
    </>
  )
}

/* ----------------- tiny styled primitives (inline css-in-js) ---------------- */
function FullScreen({children}:{children:any}) {
  return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#090b0d',color:'#eafff7',fontFamily:'ui-sans-serif,system-ui'}}>{children}</div>
}
function Shell({children}:{children:any}) {
  return <div style={{minHeight:'100vh',padding:'32px 18px',background:'#090b0d',color:'#eafff7',fontFamily:'ui-sans-serif,system-ui'}}>{children}</div>
}
function Card({children}:{children:any}) {
  return <div style={{maxWidth:920,margin:'0 auto',background:'rgba(20,24,24,.6)',backdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:20}}>{children}</div>
}
function Header({children}:{children:any}) {
  return <div style={{fontSize:'1.6rem',fontWeight:800,marginBottom:6}}>{children}</div>
}
function Sub({children}:{children:any}) {
  return <div style={{fontSize:'1.1rem',fontWeight:700,margin:'10px 0 6px 0'}}>{children}</div>
}
function Section({children}:{children:any}) {
  return <div style={{marginTop:6}}>{children}</div>
}
function Row({children,style}:{children:any, style?:any}) {
  return <div style={{display:'flex',gap:12,flexWrap:'wrap',...style}}>{children}</div>
}
function Button({children,primary,onClick,disabled}:{children:any,primary?:boolean,onClick?:any,disabled?:boolean}) {
  return <button onClick={onClick} disabled={disabled} style={{
    padding:'10px 14px',borderRadius:12,border:'1px solid rgba(255,255,255,.12)',
    background: primary ? 'linear-gradient(135deg,#1ee4a3,#26c6da)' : 'transparent',
    color: primary ? '#07120f' : '#d7ffef', fontWeight:800, cursor:disabled?'default':'pointer', opacity: disabled? .5:1
  }}>{children}</button>
}
function Chips({children}:{children:any}) {
  return <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:8}}>{children}</div>
}
function Chip({children,active,onClick}:{children:any,active:boolean,onClick:()=>void}) {
  return <button onClick={onClick} style={{
    padding:'8px 12px',borderRadius:999, border:'1px solid rgba(255,255,255,.12)',
    background: active ? 'rgba(37,225,176,.2)' : 'transparent',
    color:'#eafff7'
  }}>{children}</button>
}

function Choice({
  active,
  onClick,
  title,
  desc
}: {
  active: boolean
  onClick: () => void
  title: string
  desc: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '16px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,.12)',
        background: active
          ? 'rgba(37,225,176,.18)'
          : 'rgba(255,255,255,.03)',
        color: '#eafff7',
        textAlign: 'left',
        cursor: 'pointer'
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{title}</div>
      <div style={{ opacity: 0.8 }}>{desc}</div>
    </button>
  )
}

function Grid({children}:{children:any}) {
  return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginTop:8}}>{children}</div>
}
function Toggle({children,active,onClick}:{children:any,active:boolean,onClick:()=>void}) {
  return <button onClick={onClick} style={{
    textAlign:'left',padding:14,borderRadius:12,border:'1px solid rgba(255,255,255,.12)',
    background: active ? 'rgba(37,225,176,.18)' : 'rgba(255,255,255,.03)', color:'#eafff7'
  }}>{children}</button>
}
function Stepper({children}:{children:any}) {
  return <div style={{display:'flex',alignItems:'center',gap:10,margin:'8px 0 14px 0'}}>{children}</div>
}
function Dot({children,active}:{children:any,active:boolean}) {
  return <div style={{
    width:28,height:28,borderRadius:999,display:'grid',placeItems:'center',
    background: active ? 'linear-gradient(135deg,#1ee4a3,#26c6da)' : 'transparent',
    border:'1px solid rgba(255,255,255,.18)', color: active ? '#06130f' : '#cfe9df', fontWeight:800
  }}>{children}</div>
}
function Bar() { return <div style={{height:2,flex:1,background:'rgba(255,255,255,.08)'}}/> }
function Hint({children}:{children:any}) { return <div style={{opacity:.8,marginTop:8}}>{children}</div> }
function Err({children}:{children:any}) { return <div style={{color:'#ffd7d7',marginTop:8}}>{children}</div> }