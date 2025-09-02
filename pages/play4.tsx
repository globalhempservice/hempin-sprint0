import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Play4() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hue, setHue] = useState(160) // 0–360 controls accent tint
  const [motionOK, setMotionOK] = useState(true)

  // respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionOK(!mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // liquid fog background (no borders, just light + color)
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const fit = () => {
      const rect = el.parentElement?.getBoundingClientRect()
      const w = Math.floor(rect?.width || window.innerWidth)
      const h = Math.floor(rect?.height || window.innerHeight)
      el.width = w * DPR; el.height = h * DPR
      el.style.width = w + 'px'; el.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    fit(); window.addEventListener('resize', fit)

    // softly drifting blobs
    const blobs = Array.from({ length: 5 }).map((_, i) => ({
      x: Math.random(), y: Math.random(),
      r: 120 + Math.random() * 160,
      hue: (hue + i * 40) % 360,
      t: Math.random() * 1000,
      sp: 0.0006 + Math.random() * 0.001
    }))

    let raf = 0
    const draw = (now: number) => {
      const w = el.width / DPR, h = el.height / DPR
      // background: deep charcoal with a faint radial
      const g = ctx.createRadialGradient(w*0.5, h*0.4, 0, w*0.5, h*0.4, Math.max(w,h)*0.7)
      g.addColorStop(0, 'rgba(6,12,11,1)')
      g.addColorStop(1, 'rgba(6,12,11,0.98)')
      ctx.fillStyle = g
      ctx.fillRect(0,0,w,h)

      // blur layer
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      blobs.forEach(b => {
        if (motionOK) b.t += b.sp
        const x = (Math.sin(b.t*1.7 + b.r)*0.4 + 0.5) * w
        const y = (Math.cos(b.t*1.3 + b.r)*0.4 + 0.5) * h
        const rad = b.r * (0.9 + 0.1*Math.sin(b.t*2))
        const grd = ctx.createRadialGradient(x,y,0,x,y,rad)
        grd.addColorStop(0, `hsla(${b.hue}, 85%, 62%, .20)`)
        grd.addColorStop(1, `hsla(${b.hue}, 85%, 62%, 0)`)
        ctx.fillStyle = grd
        ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill()
      })
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit) }
  }, [hue, motionOK])

  // dynamic accent
  const accent = useMemo(() => `hsl(${hue} 90% 60%)`, [hue])

  // drag-to-set hue on the ring
  function onDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2
    const x = (e.clientX ?? 0) - cx
    const y = (e.clientY ?? 0) - cy
    const ang = (Math.atan2(y, x) * 180 / Math.PI + 360 + 90) % 360
    setHue(ang)
  }

  return (
    <>
      <Head><title>Playground v4 — melt mode</title></Head>
      <div className="wrap">
        <canvas ref={canvasRef} className="bg" />

        {/* hue wheel (borderless, just glow) */}
        <div
          className="wheel"
          onPointerDown={e => { (e.target as HTMLElement).setPointerCapture(e.pointerId); onDrag(e) }}
          onPointerMove={e => { if ((e.target as HTMLElement).hasPointerCapture?.(e.pointerId)) onDrag(e) }}
          role="slider" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hue)}
          aria-label="Accent hue"
          style={{ ['--accent' as any]: accent }}
        >
          <div className="wheelCore">
            <div className="enter">Flow with HEMPIN →</div>
          </div>
        </div>

        {/* title */}
        <div className="title">
          <h1>Playground v4 — melted, connected, borderless</h1>
          <p>No hard lines. Light, color and motion carry the structure.</p>
        </div>

        {/* universes row (spaced pills, no borders) */}
        <nav className="unav" aria-label="Universes">
          {['Supermarket','Trade','Events','Research','Places'].map((u,i) => (
            <a key={u} href="#" style={{
              ['--delay' as any]: `${i*40}ms`,
              ['--accent' as any]: accent
            }}>{u}</a>
          ))}
        </nav>

        {/* liquid cards section */}
        <section className="cards">
          {Array.from({length:6}).map((_,i)=>(
            <article key={i} className="card" style={{ ['--i' as any]: i, ['--accent' as any]: accent }}>
              <h3>Liquid piece #{i+1}</h3>
              <p>Borderless surface with soft depth. Content flows, not boxes.</p>
              <button>Open</button>
            </article>
          ))}
        </section>
      </div>

      <style jsx>{`
        .wrap { position:relative; min-height:100vh; overflow:hidden; color:#dffcf3;
          font-family: ui-sans-serif, system-ui; }
        .bg { position:absolute; inset:0; width:100%; height:100%; display:block; }

        .wheel {
          --size: min(72vmin, 900px);
          position: relative; margin: 8vmin auto 0; width: var(--size); aspect-ratio: 1/1;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            #ff7ad1, #8ef,#7fffb3,#f7f797,#ff7ad1
          );
          filter: drop-shadow(0 40px 120px rgba(0,0,0,.45));
          padding: clamp(16px, 3.2vmin, 28px);
        }
        .wheel::after {
          /* inner soft ring */
          content: ""; position:absolute; inset: clamp(16px, 3.2vmin, 28px);
          border-radius:inherit;
          background: radial-gradient(120% 120% at 50% 40%, rgba(255,255,255,.05), rgba(255,255,255,0));
          box-shadow:
            inset 0 0 120px rgba(0,0,0,.35),
            0 0 0 1px rgba(255,255,255,.06); /* barely-there edge to keep it crisp on OLED */
        }
        .wheelCore {
          position:absolute; inset: clamp(36px, 6.6vmin, 60px);
          border-radius:999px;
          background: radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,.45), rgba(0,0,0,.25));
          display:grid; place-items:center;
        }
        .enter {
          padding: .6rem 1rem; border-radius:999px;
          background: color-mix(in oklab, var(--accent) 35%, #06120f);
          box-shadow: 0 8px 26px rgba(0,0,0,.35);
          color:#06130f; font-weight:800; letter-spacing:.2px;
        }

        .title { text-align:center; margin: 4vmin 0 2vmin; }
        h1 { margin:0; font-size: clamp(1.6rem, 3.4vw, 2.2rem); letter-spacing:-.01em; }
        p { margin:.4rem 0 0; opacity:.75 }

        .unav {
          display:flex; justify-content:center; flex-wrap:wrap;
          gap: .9rem 1rem; /* <- spacing fix so items never stick */
          margin: 10px auto 0; max-width: 1024px; padding: 0 16px;
        }
        .unav a {
          --bg: color-mix(in oklab, var(--accent) 16%, #0f1614);
          padding:.55rem .9rem; border-radius: 999px;
          background: var(--bg);
          color: #bff7e9; text-decoration:none; font-weight:700;
          box-shadow: 0 10px 28px rgba(0,0,0,.28);
          transform: translateY(2px); opacity: 0;
          animation: rise .6s ease forwards; animation-delay: var(--delay, 0ms);
        }
        .unav a:hover { transform: translateY(0); box-shadow: 0 18px 40px rgba(0,0,0,.38) }
        @keyframes rise { to { transform: translateY(0); opacity:1 } }

        .cards {
          display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
          gap: 16px; max-width: 1100px; margin: 28px auto 80px; padding: 0 16px;
        }
        .card {
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
          box-shadow: 0 12px 50px rgba(0,0,0,.35);
          padding: 18px;
          transform: translateY(6px) scale(.995);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .card:hover { transform: translateY(0) scale(1.005); box-shadow: 0 18px 80px rgba(0,0,0,.45) }
        .card h3 { margin: 0 0 6px; color: #eafff7 }
        .card p { margin: 0 0 12px; opacity: .8 }
        .card button {
          padding:.55rem .9rem; border-radius:12px; border:0;
          background: color-mix(in oklab, var(--accent) 60%, #07110e);
          color:#06120f; font-weight:800; cursor:pointer;
          box-shadow: 0 10px 26px rgba(0,0,0,.35);
        }
      `}</style>
    </>
  )
}