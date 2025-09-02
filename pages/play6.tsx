import Head from 'next/head'
import Link from 'next/link'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'

/* =========================================================
   ATOMS
   ======================================================= */
function Pill({ children }: PropsWithChildren) {
  return (
    <span className="pill">{children}
      <style jsx>{`
        .pill{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.55rem .9rem; border-radius:999px;
          font-weight:800; letter-spacing:.01em;
          color:#07201a; background:linear-gradient(135deg,#1ee4a3,#26c6da);
          box-shadow:0 10px 34px rgba(0,0,0,.35);
        }
      `}</style>
    </span>
  )
}

function Button({ children, primary=false }: PropsWithChildren<{primary?:boolean}>) {
  return (
    <button className={primary?'btn primary':'btn'}>
      {children}
      <style jsx>{`
        .btn{
          border:0; border-radius:14px; padding:.78rem 1.05rem; cursor:pointer;
          background:rgba(255,255,255,.08); color:#cfe9df; font-weight:700;
          backdrop-filter:blur(8px); transition:transform .15s ease, filter .15s ease;
        }
        .btn:hover{ filter:brightness(1.15); transform:translateY(-1px) }
        .primary{ background:linear-gradient(135deg,#1ee4a3,#26c6da); color:#06221b; }
      `}</style>
    </button>
  )
}

/** Floating Action Button (FAB) — atom */
function Fab({ onClick, label='Menu' }: {onClick:()=>void; label?:string}) {
  return (
    <button className="fab" onClick={onClick} aria-label={label}>
      ☰
      <style jsx>{`
        .fab{
          position:fixed; left:18px; top:50%; transform:translateY(-50%);
          width:48px; height:48px; border-radius:14px; border:0;
          display:grid; place-items:center; font-size:1.15rem; cursor:pointer;
          color:#dffaf1; background:rgba(255,255,255,.10);
          backdrop-filter:blur(10px) saturate(120%);
          box-shadow:0 12px 30px rgba(0,0,0,.35);
          transition:transform .18s ease, filter .18s ease; z-index:30;
        }
        .fab:hover{ transform:translateY(-50%) scale(1.04); filter:brightness(1.1) }
      `}</style>
    </button>
  )
}

/** Scrim — atom */
function Scrim({ open, onClick }: {open:boolean; onClick:()=>void}) {
  return (
    <div className={`scrim ${open?'open':''}`} onClick={onClick} aria-hidden={!open}/>
  )
}
const scrimCss = `
.scrim{position:fixed; inset:0; background:rgba(0,0,0,.45);
opacity:0; pointer-events:none; transition:opacity .22s ease; z-index:25;}
.scrim.open{opacity:1; pointer-events:auto;}
`;

/** GlassSurface — atom */
function GlassSurface({ children }: PropsWithChildren) {
  return (
    <div className="surf">{children}
      <style jsx>{`
        .surf{
          background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
          border-radius:22px; backdrop-filter:blur(14px) saturate(112%);
          box-shadow:0 22px 58px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.05) inset;
        }
      `}</style>
    </div>
  )
}

function Caption({ children }: PropsWithChildren) {
  return <div className="cap">
    {children}
    <style jsx>{`.cap{color:#9fd7c5; font-size:.92rem;}`}</style>
  </div>
}

/* =========================================================
   MOLECULES
   ======================================================= */
function ChipRow({ items }:{items:string[]}) {
  return (
    <div className="row">
      {items.map(s => <Link href="#" key={s} className="chip">{s}</Link>)}
      <style jsx>{`
        .row{display:flex; flex-wrap:wrap; gap:.6rem; justify-content:center}
        .chip{padding:.55rem .85rem; border-radius:999px; color:#aef3df}
        .chip:hover{filter:brightness(1.15)}
      `}</style>
    </div>
  )
}
function Metric({label,value}:{label:string;value:string|number}) {
  return (
    <GlassSurface>
      <div className="metric">
        <div className="v">{value}</div>
        <div className="l">{label}</div>
      </div>
      <style jsx>{`
        .metric{padding:18px 20px; text-align:center}
        .v{font-size:1.6rem; font-weight:800; color:#eafff7}
        .l{color:#8fbfb0}
      `}</style>
    </GlassSurface>
  )
}
function CardPiece({title,desc}:{title:string;desc:string}) {
  return (
    <GlassSurface>
      <div className="p">
        <h4>{title}</h4>
        <p>{desc}</p>
        <div className="r"><Button>Open</Button></div>
      </div>
      <style jsx>{`
        .p{padding:clamp(14px,2.2vmin,24px)}
        h4{margin:0 0 .45rem 0; font-size:clamp(1rem,2.1vmin,1.2rem); color:#eafff7}
        p{margin:0; color:#9fd7c5}
        .r{display:flex; justify-content:flex-end; margin-top:.85rem}
      `}</style>
    </GlassSurface>
  )
}

/* =========================================================
   ORGANISMS
   ======================================================= */
/** HeroOrb — feathered ring, no hard edge */
function HeroOrb() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', String((e.clientX - r.left)/r.width - .5))
      el.style.setProperty('--my', String((e.clientY - r.top)/r.height - .5))
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={ref} className="hero">
      <div className="orb"/>
      <div className="label"><Pill>Flow into HEMPIN →</Pill></div>
      <style jsx>{`
        .hero{position:relative; width:min(76vmin,1200px); height:min(76vmin,1200px); margin:0 auto;
          --mx:0; --my:0;
        }
        .orb{
          position:absolute; inset:0; border-radius:50%;
          background:
            radial-gradient(closest-side, rgba(255,255,255,.07), rgba(255,255,255,.05) 46%, transparent 70%),
            conic-gradient(var(--a,0deg), #28e1ae, #2bc1e0, #c86bdc, #28e1ae);
          -webkit-mask: radial-gradient(farthest-side, rgba(0,0,0,.95), rgba(0,0,0,.7) 58%, rgba(0,0,0,.28) 78%, rgba(0,0,0,0) 100%);
                  mask: radial-gradient(farthest-side, rgba(0,0,0,.95), rgba(0,0,0,.7) 58%, rgba(0,0,0,.28) 78%, rgba(0,0,0,0) 100%);
          filter: blur(.35px);
          animation: spin 20s linear infinite, breathe 10s ease-in-out infinite;
        }
        @keyframes spin { to { --a: 360deg; } }
        @keyframes breathe {
          0%,100%{ transform:translate3d(calc(6px*var(--mx)), calc(6px*var(--my)), 0) scale(.997); filter:saturate(110%) blur(.35px); }
          50%{ transform:translate3d(calc(10px*var(--mx)), calc(10px*var(--my)), 0) scale(1.008); filter:saturate(125%) blur(.6px); }
        }
        .label{position:absolute; inset:0; display:grid; place-items:center; pointer-events:none}
      `}</style>
    </div>
  )
}

/** ActionBar — organism */
function ActionBar() {
  return (
    <div className="bar">
      <Button primary>Open multiverse</Button>
      <Button>Explore universes</Button>
      <Button>Try gestures</Button>
      <style jsx>{`
        .bar{display:flex; flex-wrap:wrap; gap:.7rem; justify-content:center; margin:1.4rem 0 2rem}
      `}</style>
    </div>
  )
}

/** NavDrawer — organism (slides over, glassy) */
function NavDrawer({ open, onClose }:{open:boolean; onClose:()=>void}) {
  const itemsA = ['Account home', 'Profile', 'My Brand', 'My Products']
  const itemsU = ['Supermarket', 'Trade', 'Events', 'Research', 'Places']

  return (
    <>
      <style jsx>{scrimCss}</style>
      <Scrim open={open} onClick={onClose} />
      <aside className={`drawer ${open?'open':''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="sect head">
          <div className="title">Menu</div>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="sect">
          <div className="title">Account</div>
          <ul>{itemsA.map(x => <li key={x}><Link href="#">{x}</Link></li>)}</ul>
        </div>

        <div className="sect">
          <div className="title">Universes</div>
          <ul>{itemsU.map(x => <li key={x}><Link href="#">{x}</Link></li>)}</ul>
        </div>

        <div className="sect tail">
          <Button>Log out</Button>
        </div>
      </aside>

      <style jsx>{`
        .drawer{
          position:fixed; left:72px; top:50%; transform:translate(-20px,-50%);
          width:min(380px, 88vw); max-height:82vh; overflow:auto; padding:14px;
          border-radius:22px; z-index:28;
          background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));
          backdrop-filter:blur(18px) saturate(130%);
          box-shadow:0 30px 80px rgba(0,0,0,.45);
          opacity:0; pointer-events:none; transition:opacity .22s ease, transform .22s ease;
        }
        .drawer.open{opacity:1; pointer-events:auto; transform:translate(0,-50%);}
        .sect{padding:12px 14px; border-top:1px solid rgba(255,255,255,.06);}
        .head{display:flex; align-items:center; justify-content:space-between; border-top:0; padding-top:8px}
        .title{font-weight:800; color:#eafff7; margin-bottom:6px}
        ul{list-style:none; padding:0; margin:0}
        li{padding:8px 0}
        a{color:#aef3df}
        .x{
          width:38px; height:38px; border-radius:12px; border:0; background:rgba(255,255,255,.10);
          color:#eafff7; display:grid; place-items:center; cursor:pointer;
        }
        .tail{display:flex; justify-content:flex-end}
      `}</style>
    </>
  )
}

/* =========================================================
   TEMPLATE (page-level composition)
   - Fixed aurora background (does not scroll)
   - Content scrolls over it
   - Floating FAB opens glass NavDrawer
   ======================================================= */
export default function Play6() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Head><title>Playground v6 — atomic liquid (fixed bg + floating menu)</title></Head>

      {/* Fixed, moving background */}
      <div className="bg" aria-hidden />
      <style jsx global>{`
        :root{ --bg:#0b1012; --ink:#eafff7; }
        html,body,#__next{height:100%}
        body{background:var(--bg); color:var(--ink); font-family:ui-sans-serif,system-ui}
      `}</style>
      <style jsx>{`
        .bg{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(1400px 900px at 60% 10%, rgba(40,225,174,.10), transparent 60%),
            radial-gradient(1200px 820px at 25% 85%, rgba(200,107,220,.10), transparent 60%),
            radial-gradient(1200px 800px at 90% 70%, rgba(43,193,224,.10), transparent 60%),
            var(--bg);
          animation: hue 28s linear infinite;
        }
        @keyframes hue { 0%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(8deg)} 100%{filter:hue-rotate(0deg)} }
      `}</style>

      {/* Content layer (scrollable) */}
      <div className="layer" style={{position:'relative', zIndex:1}}>
        {/* Top chips (molecule) */}
        <div style={{position:'sticky', top:10, zIndex:2, padding:'10px 16px'}}>
          <ChipRow items={['Supermarket','Trade','Events','Research','Experiments']} />
        </div>

        {/* Hero — organism */}
        <div style={{paddingTop:'8vmin'}}>
          <HeroOrb />
        </div>

        {/* Actions — organism */}
        <ActionBar />

        {/* Metrics — organism */}
        <div className="m">
          <Metric label="Brands" value="56" />
          <Metric label="Products" value="128" />
          <Metric label="Events" value="13" />
        </div>

        {/* Pieces grid — organism */}
        <div className="wrap">
          <div className="grid">
            {Array.from({length:8}, (_,i)=>(
              <CardPiece key={i} title={`Liquid piece #${i+1}`}
                desc="Borderless surface with soft depth. Content flows, not boxes."/>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{textAlign:'center', color:'#a7d9ca', opacity:.9, margin:'0 0 8vmin 0'}}>
          Universes guideline template • Atoms → Molecules → Organisms → Template
        </div>
      </div>

      {/* Floating menu — atoms+organism */}
      <Fab onClick={()=>setOpen(true)} />
      <NavDrawer open={open} onClose={()=>setOpen(false)} />

      <style jsx>{`
        .m{display:grid; gap:16px; grid-template-columns:repeat(3,minmax(0,1fr));
           width:min(95vw,1400px); margin:2vmin auto 5vmin}
        @media (max-width:760px){ .m{grid-template-columns:1fr;} }
        .wrap{width:min(96vw,2200px); margin:4vmin auto 8vmin}
        .grid{
          display:grid; gap:clamp(10px,1.4vmin,20px);
          grid-template-columns:repeat(auto-fit, minmax(clamp(220px,26vmin,360px), 1fr));
        }
      `}</style>
    </>
  )
}