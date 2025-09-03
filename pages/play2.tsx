// pages/play2.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Play2() {
  const [t, setT] = useState(0)
  const railRef = useRef<HTMLDivElement | null>(null)
  const knobRef = useRef<HTMLDivElement | null>(null)
  const [drag, setDrag] = useState(false)

  // tiny ticker to wiggle cards/orbs subtly
  useEffect(() => {
    let raf = 0
    const loop = (ts: number) => {
      setT(ts / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // simple draggable timeline knob
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!drag || !railRef.current || !knobRef.current) return
      const rail = railRef.current.getBoundingClientRect()
      const x =
        'touches' in e
          ? e.touches[0].clientX
          : (e as MouseEvent).clientX
      const pct = Math.max(0, Math.min(1, (x - rail.left) / rail.width))
      knobRef.current.style.left = `${pct * 100}%`
      // we can later map pct to reveal content; for now it just moves
    }
    function up() { setDrag(false) }
    window.addEventListener('mousemove', onMove as any)
    window.addEventListener('touchmove', onMove as any, { passive: false })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', onMove as any)
      window.removeEventListener('touchmove', onMove as any)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
  }, [drag])

  const orbs = [
    { k: 'supermarket', label: 'Supermarket', c1: '#c471f5', c2: '#fa71cd', href: '/supermarket' },
    { k: 'trade',       label: 'Trade',       c1: '#26c6da', c2: '#1ee4a3', href: '/trade' },
    { k: 'events',      label: 'Events',      c1: '#ffb74d', c2: '#ff6f00', href: '/events' },
    { k: 'research',    label: 'Research',    c1: '#00e5a8', c2: '#00b2ff', href: '/research' },
    { k: 'places',      label: 'Places',      c1: '#57e389', c2: '#b1ff9b', href: '/places' },
  ]

  return (
    <>
      <Head><title>HEMPIN — /play2 (web5 vibe)</title></Head>
      <div className="stage">
        <style jsx global>{`
          html, body, #__next { height: 100%; }
          body { background: #070a0c; color: #eafff7; }
        `}</style>
        <style jsx>{`
          .stage {
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
            font-family: ui-sans-serif, system-ui;
          }
          /* fractal-ish aurora background */
          .bg {
            position: fixed; inset: -10%;
            background:
              radial-gradient(60% 80% at 10% 10%, rgba(37,225,176,.12), transparent 60%),
              radial-gradient(60% 80% at 90% 90%, rgba(120,150,255,.10), transparent 60%),
              conic-gradient(from 180deg at 50% 50%, rgba(0,255,170,.14), rgba(0,220,255,.10), rgba(0,255,170,.14));
            filter: blur(80px);
            opacity: .6;
            animation: swirl 32s linear infinite;
            pointer-events: none;
            z-index: 0;
          }
          @keyframes swirl { 0%{transform:rotate(0deg) scale(1)} 100%{transform:rotate(360deg) scale(1)} }

          .wrap { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 28px 18px 80px; }

          /* PORTAL HERO */
          .portal {
            margin-top: 40px;
            display: grid;
            place-items: center;
          }
          .ring {
            width: min(76vw, 640px);
            aspect-ratio: 1 / 1;
            border-radius: 999px;
            background:
              radial-gradient(circle at 50% 50%, rgba(255,255,255,.08), transparent 40%),
              conic-gradient(from 0deg, #1ee4a3, #26c6da, #c471f5, #fa71cd, #1ee4a3);
            filter: blur(0.2px);
            position: relative;
            animation: pulse 5.8s ease-in-out infinite;
          }
          @keyframes pulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(37,225,176,.35), inset 0 0 40px rgba(255,255,255,.08) }
            50%     { box-shadow: 0 0 80px 12px rgba(37,225,176,.25), inset 0 0 70px rgba(255,255,255,.12) }
          }
          .portalHole {
            position: absolute; inset: 6%;
            border-radius: 999px;
            background:
              radial-gradient(70% 70% at 50% 35%, rgba(255,255,255,.07), rgba(0,0,0,.0) 60%),
              radial-gradient(120% 120% at 50% 65%, rgba(0,0,0,.85), rgba(0,0,0,.95));
            border: 1px solid rgba(255,255,255,.08);
            display: grid; place-items: center;
            overflow: hidden;
          }
          .cta {
            display: inline-flex; align-items: center; gap: .6rem;
            padding: .8rem 1.1rem; border-radius: 14px;
            background: linear-gradient(135deg, #1ee4a3, #26c6da);
            color: #03120d; font-weight: 900; border: 1px solid rgba(255,255,255,.12);
            transform: translateZ(0);
          }
          .cta:hover { filter: brightness(1.04) saturate(1.02); }
          .title {
            text-align: center; margin-top: 14px;
            font-size: clamp(1.6rem, 2.6vw, 2rem); font-weight: 900;
            letter-spacing: -0.02em; color: #ddfff4;
          }
          .subtitle { text-align: center; opacity: .85; margin-top: 6px }

          /* FLOATING ORBS */
          .orbs {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(12, minmax(0,1fr));
            gap: 12px;
          }
          .orb {
            grid-column: span 4;
            min-height: 160px;
            border-radius: 18px;
            background: rgba(255,255,255,.02);
            border: 1px solid rgba(255,255,255,.08);
            overflow: hidden;
            position: relative;
            transform: translateY(0px);
            transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,.25);
          }
          .orb:hover {
            transform: translateY(-6px) scale(1.01);
            border-color: rgba(255,255,255,.16);
            box-shadow: 0 18px 60px rgba(0,0,0,.35);
          }
          .ink {
            position: absolute; inset: -30%;
            filter: blur(40px); opacity: .6;
            transition: opacity .2s ease;
          }
          .orb:hover .ink { opacity: .75; }
          .orbLabel {
            position: absolute; left: 14px; bottom: 12px; z-index: 2;
            font-weight: 800;
          }
          .orbEnter {
            position: absolute; right: 14px; bottom: 12px; opacity: .9;
          }

          /* ZERO-G CARDS */
          .cards {
            margin-top: 24px;
            display: grid;
            grid-template-columns: repeat(12, minmax(0,1fr));
            gap: 12px;
          }
          .card {
            grid-column: span 3;
            min-height: 120px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.03);
            display: grid; place-items: center;
            transform: translateY(0) translateZ(0);
            transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          }
          .card:hover {
            transform: translateY(-6px) rotate3d(1,0,0, 2deg);
            border-color: rgba(255,255,255,.16);
            box-shadow: 0 16px 60px rgba(0,0,0,.35);
          }

          /* TIMELINE */
          .timeline {
            margin-top: 34px;
            background: rgba(255,255,255,.02);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            padding: 16px;
          }
          .rail {
            position: relative;
            height: 4px; border-radius: 2px;
            background: linear-gradient(90deg, #1ee4a3, #26c6da, #c471f5, #fa71cd);
            filter: saturate(1.1);
          }
          .knob {
            position: absolute; top: 50%; transform: translate(-50%, -50%);
            width: 20px; height: 20px; border-radius: 999px;
            background: #0a1512;
            border: 1px solid rgba(255,255,255,.18);
            box-shadow: 0 0 0 6px rgba(37,225,176,.15);
            cursor: grab;
          }
          .steps {
            display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px;
            margin-top: 12px;
          }
          .step {
            background: rgba(255,255,255,.03);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 12px; padding: 12px;
          }

          /* FOOT NOTE */
          .foot {
            margin-top: 28px;
            opacity: .8;
          }

          @media (max-width: 960px) {
            .orb { grid-column: span 6; }
            .card { grid-column: span 6; }
          }
          @media (max-width: 640px) {
            .orb, .card { grid-column: 1 / -1; }
          }
        `}</style>

        <div className="bg" />

        <div className="wrap">
          {/* PORTAL HERO */}
          <section className="portal" aria-label="Portal hero">
            <div className="ring">
              <div className="portalHole">
                <Link href="/onboarding" className="cta">Enter Hemp Multiverse ✨</Link>
              </div>
            </div>
            <div className="title">Playground v2 — spatial, animated, alive</div>
            <div className="subtitle">Planets for universes • glass shards for content • timeline for flow</div>
          </section>

          {/* FLOATING ORBS */}
          <section className="orbs" aria-label="Universes">
            {orbs.map((o, i) => (
              <Link href={o.href} key={o.k} className="orb" style={{
                transform: `translateY(${Math.sin(t * 0.8 + i) * 3}px)`,
              }}>
                <div className="ink" style={{
                  background: `radial-gradient(50% 50% at 50% 50%, ${o.c1}55, transparent 60%),
                               radial-gradient(60% 60% at 70% 30%, ${o.c2}55, transparent 70%)`
                }} />
                <div className="orbLabel">{o.label}</div>
                <div className="orbEnter">Enter →</div>
              </Link>
            ))}
          </section>

          {/* ZERO-G CARDS */}
          <section className="cards" aria-label="Experiments wall">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card" style={{
                transform: `translateY(${Math.sin(t * 1.2 + i) * 2}px)`,
              }}>
                Glass tile #{i + 1}
              </div>
            ))}
          </section>

          {/* TIMELINE */}
          <section className="timeline" aria-label="How it works">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8, fontWeight:800}}>
              <span>How it works</span><span style={{opacity:.7}}>drag the knob</span>
            </div>
            <div ref={railRef} className="rail" onMouseDown={()=>setDrag(true)} onTouchStart={()=>setDrag(true)}>
              <div ref={knobRef} className="knob" style={{ left: '10%' }} />
            </div>
            <div className="steps">
              <div className="step"><strong>1. Submit</strong><div style={{opacity:.85}}>Humans add brands, products, events, research, places.</div></div>
              <div className="step"><strong>2. Curate</strong><div style={{opacity:.85}}>Moderation + proofs → quality & compliance.</div></div>
              <div className="step"><strong>3. Flow</strong><div style={{opacity:.85}}>Approved content streams into universes & profile XP.</div></div>
            </div>
          </section>

          <div className="foot">
            This is a **visual manifesto**. Next steps: wire this energy into Supermarket/Trade/Events/Research/Places via the shared template.
          </div>
        </div>
      </div>
    </>
  )
}