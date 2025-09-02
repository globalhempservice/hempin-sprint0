// pages/play5.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Play5() {
  const stageRef = useRef<HTMLDivElement>(null)

  // tiny parallax of background glows on pointer move (cheap, CSS vars)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', (x - 0.5).toString())
      el.style.setProperty('--my', (y - 0.5).toString())
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <Head>
        <title>Playground v5 — liquid, feathered, ultrawide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div ref={stageRef} className="stage">
        <style jsx global>{`
          :root{
            --ink:#eafff7;
            --mut:#9fd7c5;
            --bg:#0b1012;
            --glass:rgba(255,255,255,.06);
            --stroke:rgba(255,255,255,.08);
            --ringA:#28e1ae;
            --ringB:#2bc1e0;
            --ringC:#c86bdc;
          }
          html,body,#__next{height:100%}
          body{background:var(--bg); color:var(--ink); font-family:ui-sans-serif, system-ui;}
        `}</style>

        {/* animated background (lightweight CSS) */}
        <style jsx>{`
          .stage{
            min-height:100vh;
            position:relative;
            overflow:hidden;
            --mx:0; --my:0;
            /* moving aurora layers */
            background:
              radial-gradient(1200px 800px at calc(50% + 30vmax*var(--mx)) calc(10% + 20vmax*var(--my)),
                rgba(40,225,174,.10), transparent 60%),
              radial-gradient(1200px 800px at calc(15% + 10vmax*var(--mx)) calc(85% + 6vmax*var(--my)),
                rgba(200,107,220,.10), transparent 60%),
              radial-gradient(1200px 800px at calc(90% - 8vmax*var(--mx)) calc(70% - 12vmax*var(--my)),
                rgba(43,193,224,.10), transparent 60%),
              var(--bg);
            animation: drift 22s linear infinite;
          }
          @keyframes drift {
            0%   { filter:hue-rotate(0deg) saturate(110%); }
            50%  { filter:hue-rotate(8deg) saturate(120%); }
            100% { filter:hue-rotate(0deg) saturate(110%); }
          }

          /* header links (kept minimal) */
          .topnav{position:fixed; inset:10px 16px auto 16px; display:flex; justify-content:center; gap:18px; z-index:4}
          .chip{padding:.5rem .8rem; border-radius:999px; color:#aef3df; background:transparent; border:0; cursor:pointer}
          .chip:hover{filter:brightness(1.2)}

          /* feathered orb – one field, wide falloff */
          .orbWrap{
            position:relative;
            width:min(72vmin, 1200px);
            height:min(72vmin, 1200px);
            margin:0 auto;
            transform: translateZ(0); /* promote */
          }
          .orb{
            position:absolute; inset:0; border-radius:50%;
            /* base lumen */
            background: radial-gradient(closest-side, rgba(255,255,255,.10), rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 70%),
                        conic-gradient(from 0deg, var(--ringA), var(--ringB), var(--ringC), var(--ringA));
            /* soft feather edge via mask */
            -webkit-mask: radial-gradient(farthest-side, rgba(0,0,0,.95), rgba(0,0,0,.75) 55%, rgba(0,0,0,.3) 75%, rgba(0,0,0,0) 100%);
                    mask: radial-gradient(farthest-side, rgba(0,0,0,.95), rgba(0,0,0,.75) 55%, rgba(0,0,0,.3) 75%, rgba(0,0,0,0) 100%);
            filter: blur(0.3px);
            animation: breathe 10s ease-in-out infinite;
          }
          @keyframes breathe{
            0%,100%{ transform:scale(0.995) rotate(0deg); filter:saturate(110%) blur(0.3px); }
            50%{ transform:scale(1.01) rotate(1.5deg); filter:saturate(125%) blur(0.6px); }
          }
          .orbLabel{
            position:absolute; inset:0; display:grid; place-items:center; z-index:2;
          }
          .pill{
            font-weight:800; color:#07201a;
            background:linear-gradient(135deg,#1ee4a3,#26c6da);
            border-radius:999px; padding:.55rem .9rem;
            box-shadow:0 8px 26px rgba(0,0,0,.35);
          }

          /* flowing “surfaces” (no borders) */
          .pad{padding:clamp(12px, 2.4vmin, 28px)}
          .surface{
            background:
              linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
            border-radius:20px;
            box-shadow:
              0 20px 50px rgba(0,0,0,.35),
              0 1px 0 rgba(255,255,255,.05) inset;
            backdrop-filter: blur(14px) saturate(110%);
          }

          /* responsive belts (ultrawide aware) */
          .belt{
            width: min(95vw, 1900px);
            margin: 0 auto;
          }
          .beltWide{
            width: min(96vw, 2200px);
            margin: 4vmin auto 10vmin;
          }

          /* section: actions */
          .actions{
            display:flex; flex-wrap:wrap; gap:.7rem; justify-content:center; margin: 1.2rem 0 2rem;
          }
          .btn{
            border:0; border-radius:14px; padding:.75rem 1rem; cursor:pointer;
            background: rgba(255,255,255,.08); color:#cfe9df; font-weight:700;
            backdrop-filter: blur(8px);
          }
          .btn:hover{ filter:brightness(1.15) }
          .btnPrimary{
            background:linear-gradient(135deg,#1ee4a3,#26c6da); color:#06221b;
          }

          /* responsive grid of “pieces”; auto-fits to use all space (ultrawide gets many columns) */
          .grid{
            display:grid;
            gap: clamp(10px, 1.4vmin, 20px);
            grid-template-columns: repeat(auto-fit, minmax(clamp(220px, 26vmin, 360px), 1fr));
          }
          .piece{
            border-radius:22px;
            overflow:hidden;
            position:relative;
          }
          .piece h4{ margin:0 0 .4rem 0; font-size: clamp(1rem, 2.2vmin, 1.2rem) }
          .piece p { margin:0; color:var(--mut); font-size: clamp(.9rem, 1.9vmin, 1rem) }
          .openRow{ display:flex; justify-content:flex-end; margin-top:.8rem}
          .ghost{ background:rgba(255,255,255,.10); color:#ddfff4 }

          /* footer strip */
          .strip{
            display:flex; flex-wrap:wrap; gap:.6rem; justify-content:center;
            color:#a7d9ca; opacity:.9;
          }
        `}</style>

        {/* very light nav chips (top center) */}
        <div className="topnav">
          {['Supermarket','Trade','Events','Research','Experiments'].map((t) => (
            <Link key={t} href="#" className="chip">{t}</Link>
          ))}
        </div>

        {/* ORB */}
        <div className="belt" style={{paddingTop:'9vmin'}}>
          <div className="orbWrap">
            <div className="orb" />
            <div className="orbLabel">
              <span className="pill">Flow into HEMPIN →</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="belt">
          <div className="actions">
            <button className="btnPrimary btn">Open multiverse</button>
            <button className="btn">Explore universes</button>
            <button className="btn">Try gestures</button>
          </div>
        </div>

        {/* PIECES (no borders; glassy surfaces) */}
        <div className="beltWide grid">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="piece surface pad">
              <h4>Liquid piece #{i}</h4>
              <p>Borderless surface with soft depth. Content flows, not boxes.</p>
              <div className="openRow">
                <button className="btn ghost">Open</button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOT STRIP */}
        <div className="belt" style={{margin:'6vmin auto 8vmin'}}>
          <div className="strip">
            <span>Super-responsive • ultrawide aware • mobile first • CSS-only motion</span>
          </div>
        </div>
      </div>
    </>
  )
}