// pages/play3.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/**
 * PLAY3: "Melted UI" — borderless, color-suggested shapes, liquid motion.
 * - SVG goo filter for background blobs
 * - Canvas connectome between floating nodes
 * - Swipeable ribbon with inertial glide (touch & mouse)
 * - Liquid timeline with blob knob
 */

type Pt = { x: number; y: number; vx: number; vy: number }

export default function Play3() {
  // --- canvas connectome state ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [nodes, setNodes] = useState<Pt[]>([])

  // --- ticker for subtle animations ---
  const tRef = useRef(0)
  const rafRef = useRef(0)

  // --- swipe ribbon state ---
  const trackRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef({ x: 0, dx: 0, dragging: false, last: 0, vel: 0 })

  // --- timeline knob state ---
  const railRef = useRef<HTMLDivElement | null>(null)
  const knobRef = useRef<HTMLDivElement | null>(null)
  const [dragKnob, setDragKnob] = useState(false)

  // init nodes for connectome
  useEffect(() => {
    const n = 16
    const arr: Pt[] = []
    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random() * 1000,
        y: Math.random() * 440 + 80,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      })
    }
    setNodes(arr)
  }, [])

  // resize canvas to container width (safe null checks)
useEffect(() => {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

  function fit() {
    const el = canvasRef.current
    if (!el) return
    const rect = el.parentElement?.getBoundingClientRect()
    const w = Math.floor(rect?.width || 1000)
    const h = 360
    el.width = w * dpr
    el.height = h * dpr
    el.style.width = w + 'px'
    el.style.height = h + 'px'
    const ctx = el.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  fit()
  window.addEventListener('resize', fit)
  return () => window.removeEventListener('resize', fit)
}, [])

  // animate connectome + inertial swipe + knob drag
  useEffect(() => {
    let last = performance.now()
    function loop(now: number) {
      const dt = Math.min(32, now - last)
      last = now
      tRef.current = now / 1000

      // connectome draw
      const c = canvasRef.current
      const ctx = c?.getContext('2d') || null
      if (c && ctx && nodes.length) {
        const W = c.clientWidth
        const H = c.clientHeight
        // update
        for (const p of nodes) {
          p.x += p.vx
          p.y += p.vy
          // gentle spring toward center band
          p.vx += (Math.sin((p.y + now * 0.02) * 0.005)) * 0.02
          p.vy += (Math.sin((p.x + now * 0.015) * 0.005)) * 0.02
          // wrap
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
          // tiny drag
          p.vx *= 0.995; p.vy *= 0.995
        }
        // render
        ctx.clearRect(0, 0, W, H)
        // soft background haze
        const grd = ctx.createLinearGradient(0, 0, W, H)
        grd.addColorStop(0, 'rgba(37,225,176,0.06)')
        grd.addColorStop(1, 'rgba(38,198,218,0.05)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
        // connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j]
            const dx = a.x - b.x, dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 < 120 * 120) {
              const d = Math.sqrt(d2)
              const alpha = 1 - d / 120
              ctx.strokeStyle = `rgba(220,255,245,${alpha * 0.4})`
              ctx.lineWidth = 1.2
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
        // nodes
        for (const p of nodes) {
          ctx.fillStyle = 'rgba(245,255,250,0.9)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // inertial swipe for ribbon
      if (!posRef.current.dragging) {
        if (Math.abs(posRef.current.vel) > 0.1) {
          posRef.current.x += posRef.current.vel
          posRef.current.vel *= 0.95
          applyTrackTransform()
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [nodes])

  // swipe helpers
  function applyTrackTransform() {
    const el = trackRef.current
    if (!el) return
    const max = 0
    const min = Math.min(0, el.parentElement!.clientWidth - el.scrollWidth) // negative
    if (posRef.current.x > max) { posRef.current.x = max; posRef.current.vel = 0 }
    if (posRef.current.x < min) { posRef.current.x = min; posRef.current.vel = 0 }
    el.style.transform = `translate3d(${posRef.current.x}px,0,0)`
  }
  function onDown(e: React.MouseEvent | React.TouchEvent) {
    posRef.current.dragging = true
    posRef.current.last = 'touches' in e ? e.touches[0].clientX : (e as any).clientX
    posRef.current.vel = 0
  }
  function onMove(e: React.MouseEvent | React.TouchEvent) {
    if (!posRef.current.dragging) return
    const x = 'touches' in e ? e.touches[0].clientX : (e as any).clientX
    const dx = x - posRef.current.last
    posRef.current.last = x
    posRef.current.x += dx
    posRef.current.vel = dx
    applyTrackTransform()
  }
  function onUp() { posRef.current.dragging = false }

  // timeline knob drag
  useEffect(() => {
    function move(e: MouseEvent | TouchEvent) {
      if (!dragKnob || !railRef.current || !knobRef.current) return
      const rail = railRef.current.getBoundingClientRect()
      const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const pct = Math.max(0, Math.min(1, (x - rail.left) / rail.width))
      knobRef.current.style.left = `${pct * 100}%`
    }
    function up() { setDragKnob(false) }
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move as any, { passive: false })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move as any)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
  }, [dragKnob])

  const orbs = [
    { k: 'supermarket', label: 'Supermarket', c1: '#c471f5', c2: '#fa71cd', href: '/supermarket' },
    { k: 'trade',       label: 'Trade',       c1: '#26c6da', c2: '#1ee4a3', href: '/trade' },
    { k: 'events',      label: 'Events',      c1: '#ffb74d', c2: '#ff6f00', href: '/events' },
    { k: 'research',    label: 'Research',    c1: '#00e5a8', c2: '#00b2ff', href: '/research' },
    { k: 'places',      label: 'Places',      c1: '#57e389', c2: '#b1ff9b', href: '/places' },
  ]

  return (
    <>
      <Head><title>HEMPIN — /play3 (melted)</title></Head>

      {/* SVG goo filter once at top-level */}
      <svg width="0" height="0" style={{ position:'absolute' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur" mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 24 -12"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="wrap">
        <style jsx global>{`
          html, body, #__next { height: 100%; }
          body { background: #070a0c; color: #eafff7; }
        `}</style>
        <style jsx>{`
          .wrap { min-height: 100vh; position: relative; overflow: hidden; }

          /* Liquid background blobs */
          .bg {
            position: fixed; inset: -10%;
            filter: url(#goo);
            z-index: 0; pointer-events: none; opacity: .66;
          }
          .blob {
            position: absolute; width: 40vw; height: 40vw; border-radius: 50%;
            background: radial-gradient(60% 60% at 50% 50%, rgba(37,225,176,.18), rgba(37,225,176,0) 70%);
            animation: drift 22s ease-in-out infinite alternate;
            mix-blend-mode: screen;
          }
          .blob.b2 { background: radial-gradient(60% 60% at 50% 50%, rgba(38,198,218,.18), rgba(38,198,218,0) 70%); animation-duration: 28s }
          .blob.b3 { background: radial-gradient(60% 60% at 50% 50%, rgba(196,113,245,.16), rgba(196,113,245,0) 70%); animation-duration: 26s }
          @keyframes drift {
            0%   { transform: translate(-10%, -10%) scale(1); }
            100% { transform: translate(10%, 6%) scale(1.2); }
          }

          .content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 28px 18px 100px; }

          /* Portal (softer than play2) */
          .portal {
            margin-top: 38px; display:grid; place-items:center;
          }
          .portalRing {
            width: min(76vw, 640px);
            aspect-ratio: 1 / 1; border-radius: 999px;
            background:
              radial-gradient(circle at 50% 40%, rgba(255,255,255,.06), rgba(255,255,255,0) 55%),
              conic-gradient(from 0deg, #1ee4a3, #26c6da, #c471f5, #fa71cd, #1ee4a3);
            filter: blur(0.3px) saturate(1.1);
            animation: breathe 7s ease-in-out infinite;
            position: relative;
          }
          .portalHole {
            position: absolute; inset: 7%;
            border-radius: 999px;
            background:
              radial-gradient(70% 70% at 50% 35%, rgba(255,255,255,.06), rgba(0,0,0,0) 60%),
              radial-gradient(130% 130% at 50% 70%, rgba(0,0,0,.92), rgba(0,0,0,.96));
            display:grid; place-items:center;
          }
          .cta {
            display:inline-flex; align-items:center; gap:.6rem;
            padding:.9rem 1.2rem; border-radius:16px;
            background: linear-gradient(135deg, #1ee4a3, #26c6da);
            color:#06130f; font-weight:900; border: 1px solid rgba(255,255,255,.06);
            box-shadow: 0 10px 30px rgba(0,0,0,.35);
          }
          @keyframes breathe {
            0%,100% { box-shadow: 0 0 0 0 rgba(37,225,176,.20) }
            50%     { box-shadow: 0 0 80px 16px rgba(37,225,176,.16) }
          }
          .title { margin-top:14px; font-size: clamp(1.6rem, 2.6vw, 2rem); font-weight:900; letter-spacing:-.02em; text-align:center; color:#ddfff4 }
          .sub   { text-align:center; opacity:.85; margin-top:6px }

          /* Orbs grid (melted cards) */
          .orbs { margin-top:36px; display:grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap:12px; }
          .orb {
            grid-column: span 4; min-height:160px; border-radius:22px;
            background: rgba(255,255,255,.02);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.35);
            position:relative; overflow:hidden;
            transform: translateY(0); transition: transform .25s ease, filter .25s ease;
          }
          .orb:hover { transform: translateY(-6px) scale(1.01); filter:saturate(1.05) }
          .ink { position:absolute; inset:-30%; filter: blur(44px); opacity:.7 }
          .olabel { position:absolute; left:14px; bottom:12px; font-weight:800 }
          .oenter { position:absolute; right:14px; bottom:12px; opacity:.9 }

          /* Connectome area */
          .connect {
            margin-top: 30px; border-radius:22px; overflow:hidden;
            background: rgba(255,255,255,.02);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 20px 60px rgba(0,0,0,.35);
          }
          .canvasWrap { padding: 10px 10px 0 10px; }

          /* Swipe ribbon */
          .ribbon {
            margin-top: 18px; overflow: hidden; border-radius: 18px;
            background: rgba(255,255,255,.02);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
          }
          .track {
            display: inline-flex; gap: 12px; padding: 14px; will-change: transform;
            touch-action: pan-x;
          }
          .chip {
            min-width: 180px; padding: 14px 16px; border-radius: 999px;
            background: radial-gradient(80% 80% at 30% 20%, rgba(255,255,255,.06), rgba(255,255,255,.02) 60%);
            color: #eafff7; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
            text-align:center; font-weight:800;
          }

          /* Timeline (liquid) */
          .timeline {
            margin-top: 26px; padding: 16px; border-radius: 18px;
            background: rgba(255,255,255,.02);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
          }
          .rail {
            position: relative; height: 10px; border-radius: 999px;
            background: linear-gradient(90deg,#1ee4a3,#26c6da,#c471f5,#fa71cd);
            filter: saturate(1.1); box-shadow: 0 8px 30px rgba(0,0,0,.3) inset;
          }
          .knob {
            position: absolute; top: 50%; transform: translate(-50%,-50%);
            width: 28px; height: 28px; border-radius: 999px;
            background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,.25), rgba(255,255,255,0));
            box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.06);
            cursor: grab;
          }
          .steps { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top:12px }
          .step {
            border-radius: 16px; padding: 12px;
            background: radial-gradient(90% 90% at 20% 10%, rgba(255,255,255,.05), rgba(255,255,255,.02) 60%);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
          }

          @media (max-width: 960px) {
            .orb { grid-column: span 6; }
          }
          @media (max-width: 640px) {
            .orb { grid-column: 1 / -1; }
            .steps { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* background blobs */}
        <div className="bg">
          <div className="blob" style={{ left:'-10%', top:'-10%' }} />
          <div className="blob b2" style={{ right:'-10%', bottom:'-8%' }} />
          <div className="blob b3" style={{ left:'20%', top:'40%' }} />
        </div>

        <div className="content">
          {/* Portal */}
          <section className="portal">
            <div className="portalRing">
              <div className="portalHole">
                <Link className="cta" href="/onboarding">Flow into HEMPIN →</Link>
              </div>
            </div>
            <div className="title">Playground v3 — melted, connected, gesture-native</div>
            <div className="sub">No hard borders. Just light, color, and gentle motion.</div>
          </section>

          {/* Orbs (Universes) */}
          <section className="orbs" aria-label="Universes">
            {orbs.map((o, i) => (
              <Link key={o.k} href={o.href} className="orb" style={{
                transform: `translateY(${Math.sin((tRef.current*0.7)+i)*3}px)`
              }}>
                <div className="ink" style={{
                  background: `
                    radial-gradient(50% 50% at 50% 50%, ${o.c1}40, transparent 60%),
                    radial-gradient(60% 60% at 70% 30%, ${o.c2}40, transparent 70%)`
                }} />
                <div className="olabel">{o.label}</div>
                <div className="oenter">Enter →</div>
              </Link>
            ))}
          </section>

          {/* Connectome */}
          <section className="connect" aria-label="Connectome">
            <div className="canvasWrap">
              <canvas ref={canvasRef} style={{ width:'100%', height: 360, display:'block' }} />
            </div>
            {/* Swipe ribbon */}
            <div
              className="ribbon"
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
              onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
            >
              <div ref={trackRef} className="track">
                {['Carbon-smart', 'Regenerative', 'Fair Trade', 'Open Data', 'Local Craft', 'Circular', 'Compliant', 'Traceable', 'Biobased', 'Repairable', 'Recyclable']
                  .map((t, i) => <div key={i} className="chip">{t}</div>)}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="timeline" aria-label="Liquid timeline">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:10, fontWeight:900}}>
              <span>Flow</span><span style={{opacity:.75}}>drag the blob</span>
            </div>
            <div
              ref={railRef}
              className="rail"
              onMouseDown={() => setDragKnob(true)}
              onTouchStart={() => setDragKnob(true)}
            >
              <div ref={knobRef} className="knob" style={{ left: '12%' }} />
            </div>
            <div className="steps">
              <div className="step"><strong>1. Sense</strong><div style={{opacity:.85}}>Gather signals from brands, events, research, places.</div></div>
              <div className="step"><strong>2. Curate</strong><div style={{opacity:.85}}>Moderation + proofs flow through the graph.</div></div>
              <div className="step"><strong>3. Bloom</strong><div style={{opacity:.85}}>Approved content melts into universes & XP.</div></div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}