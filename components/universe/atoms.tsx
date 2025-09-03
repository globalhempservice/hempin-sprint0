// components/universe/atoms.tsx
import { PropsWithChildren } from 'react'
import Link from 'next/link'

/** ---- Theme contract ----------------------------------------------------- */
export type UniverseThemeKey = 'supermarket' | 'trade' | 'events' | 'research' | 'places'
export type UniverseTheme = {
  name: string
  // brand hues
  hueA: string
  hueB: string
  // subtle page aurora tint
  auroraA: string
  auroraB: string
  // ink colors
  ink: string
  subInk: string
  // button ink on primary
  onPrimary: string
}
export const UNIVERSE_THEMES: Record<UniverseThemeKey, UniverseTheme> = {
  supermarket: {
    name: 'Supermarket',
    hueA: '#a855f7', hueB: '#22d3ee',
    auroraA: 'rgba(168,85,247,.12)', auroraB: 'rgba(34,211,238,.10)',
    ink: '#eafff7', subInk: '#a7d9ca', onPrimary: '#06221b',
  },
  trade: {
    name: 'Trade',
    hueA: '#28e1ae', hueB: '#2bc1e0',
    auroraA: 'rgba(40,225,174,.12)', auroraB: 'rgba(43,193,224,.10)',
    ink: '#e8fbff', subInk: '#a7d5e0', onPrimary: '#05202a',
  },
  events: {
    name: 'Events',
    hueA: '#fb923c', hueB: '#f59e0b',
    auroraA: 'rgba(251,146,60,.14)', auroraB: 'rgba(245,158,11,.10)',
    ink: '#fff7e8', subInk: '#ffd59a', onPrimary: '#241300',
  },
  research: {
    name: 'Research',
    hueA: '#60a5fa', hueB: '#818cf8',
    auroraA: 'rgba(96,165,250,.14)', auroraB: 'rgba(129,140,248,.12)',
    ink: '#eef5ff', subInk: '#c8d6ff', onPrimary: '#0b1230',
  },
  places: {
    name: 'Places',
    hueA: '#34d399', hueB: '#86efac',
    auroraA: 'rgba(52,211,153,.14)', auroraB: 'rgba(134,239,172,.12)',
    ink: '#ecfff3', subInk: '#baf3ce', onPrimary: '#062313',
  },
}

/** ---- CSS variable bridge (applied by the template) --------------------- */
/*
  Template will set:
  --hueA --hueB --ink --subInk --onPrimary --aurA --aurB
*/

/** ---- ATOMS -------------------------------------------------------------- */

export function Glass({ children, className }: PropsWithChildren<{className?:string}>) {
  return (
    <div className={`u-glass ${className || ''}`}>{children}
      <style jsx>{`
        .u-glass{
          background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
          border-radius:20px;
          backdrop-filter:blur(14px) saturate(112%);
          box-shadow:0 22px 58px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.05) inset;
        }
      `}</style>
    </div>
  )
}

export function Pill({ children }: PropsWithChildren) {
  return (
    <span className="u-pill">{children}
      <style jsx>{`
        .u-pill{
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.5rem .8rem; border-radius:999px; font-weight:800; letter-spacing:.01em;
          color:var(--onPrimary);
          background:conic-gradient(from 120deg, var(--hueA), var(--hueB));
          box-shadow:0 10px 34px rgba(0,0,0,.35);
        }
      `}</style>
    </span>
  )
}

/** Theme-aware button with subtle hover/press animation & pulse on focus */
export function Button({ children, primary=false, href, onClick }: PropsWithChildren<{primary?:boolean; href?:string; onClick?:()=>void}>) {
  const inner = (
    <span className={`u-btn ${primary?'primary':''}`}>
      {children}
      <style jsx>{`
        .u-btn{
          --bg: rgba(255,255,255,.08);
          display:inline-flex; align-items:center; gap:.6rem;
          padding:.82rem 1.05rem; border-radius:14px; border:0; font-weight:800;
          color:var(--ink); background:var(--bg); cursor:pointer; user-select:none;
          backdrop-filter:blur(8px);
          transition:transform .16s ease, filter .16s ease, background .22s ease, box-shadow .16s ease;
          box-shadow:0 0 0 0 rgba(0,0,0,0);
        }
        .u-btn.primary{ --bg: linear-gradient(135deg,var(--hueA),var(--hueB)); color:var(--onPrimary); }
        .u-btn:hover{ filter:brightness(1.08); transform:translateY(-1px) }
        .u-btn:active{ transform:translateY(0); filter:brightness(0.98) contrast(1.02) }
        .u-btn:focus-visible{
          box-shadow:0 0 0 3px color-mix(in oklab, var(--hueB) 50%, white 10%);
          outline:none;
        }
      `}</style>
    </span>
  )
  if (href) return <Link className="u-btn-link" href={href} onClick={onClick as any}>{inner}</Link>
  return <button onClick={onClick} className="u-btn-button">{inner}</button>
}

export function Chip({ children, href }: PropsWithChildren<{href?:string}>) {
  const c = <span className="u-chip">{children}<style jsx>{`
    .u-chip{
      display:inline-flex; padding:.55rem .85rem; border-radius:999px;
      color:color-mix(in oklab, var(--ink) 82%, black 14%);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
      backdrop-filter:blur(8px);
      transition:filter .18s ease, transform .18s ease;
    }
    .u-chip:hover{ filter:brightness(1.12); transform:translateY(-1px) }
  `}</style></span>
  return href ? <Link href={href}>{c}</Link> : c
}

/** Simple section shell to keep spacing consistent */
export function Section({ children }: PropsWithChildren) {
  return <section className="u-sec">{children}
    <style jsx>{`.u-sec{margin: min(4vmin,28px) auto; width:min(96vw,1400px)}`}</style>
  </section>
}