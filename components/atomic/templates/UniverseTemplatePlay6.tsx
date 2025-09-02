import { ReactNode, useEffect } from 'react'

type Accent = { a: string; b: string } // gradients
export type UniverseTemplateProps = {
  title?: string
  subtitle?: string
  accent?: Accent
  /** background palette: 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose' */
  bgPalette?: 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose'
  showHowItWorks?: boolean

  /** SLOTs (atoms → molecules → organisms) */
  header?: ReactNode           // hero kicker/pill etc
  leadActions?: ReactNode      // primary/secondary CTA row
  aboveFold?: ReactNode        // search/filters or any intro widgets
  primaryFeed?: ReactNode      // main grid/cards
  secondaryFeed?: ReactNode    // side rail or extra list
  howItWorks?: ReactNode       // steps / explainer
  ctaStrip?: ReactNode         // bottom CTA bar
  footerMeta?: ReactNode       // small footer metadata / notes
}

export default function UniverseTemplatePlay6({
  title,
  subtitle,
  accent = { a: '#25e1b0', b: '#26c6da' },
  bgPalette = 'violet',
  showHowItWorks = true,
  header,
  leadActions,
  aboveFold,
  primaryFeed,
  secondaryFeed,
  howItWorks,
  ctaStrip,
  footerMeta,
}: UniverseTemplateProps) {
  // lock the moving background to viewport (no scroll parallax)
  useEffect(() => {
    document.documentElement.style.setProperty('--bgFixed', 'fixed')
    return () => document.documentElement.style.removeProperty('--bgFixed')
  }, [])

  const bg = paletteToStops(bgPalette)

  return (
    <div className="u-root">
      {/* Moving but fixed background */}
      <div className="u-bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <main className="u-shell">
        {/* HERO */}
        <section className="u-hero glass">
          {header && <div className="u-kicker">{header}</div>}

          {(title || subtitle) && (
            <div className="u-headings">
              {title && <h1 className="u-title">{title}</h1>}
              {subtitle && <p className="u-sub">{subtitle}</p>}
            </div>
          )}

          {leadActions && <div className="u-actions">{leadActions}</div>}
        </section>

        {/* ABOVE FOLD widgets (search/filters/etc.) */}
        {aboveFold && <section className="u-above glass">{aboveFold}</section>}

        {/* FEEDS */}
        {(primaryFeed || secondaryFeed) && (
          <section className="u-feeds">
            <div className="u-primary glass">{primaryFeed}</div>
            {secondaryFeed && <aside className="u-secondary glass">{secondaryFeed}</aside>}
          </section>
        )}

        {/* HOW IT WORKS (toggleable) */}
        {showHowItWorks && howItWorks && (
          <section className="u-hiw glass">{howItWorks}</section>
        )}

        {/* CTA STRIP */}
        {ctaStrip && <section className="u-cta glass">{ctaStrip}</section>}

        {/* FOOTER META */}
        {footerMeta && <footer className="u-meta">{footerMeta}</footer>}
      </main>

      {/* styles */}
      <style jsx>{`
        .u-root{
          min-height:100vh; position:relative; overflow-x:hidden;
          background: radial-gradient(1000px 600px at 0% -10%, rgba(0,0,0,.20), transparent 50%),
                      radial-gradient(1000px 600px at 100% 110%, rgba(0,0,0,.16), transparent 50%);
        }
        .u-bg{
          position:fixed; /* important: locked background */
          inset:-10% -10% -10% -10%;
          pointer-events:none; z-index:0;
        }
        .blob{
          position:absolute; width:48vw; height:48vw; max-width:850px; max-height:850px;
          filter: blur(90px); opacity:.34; border-radius:50%;
          mix-blend-mode:screen;
          animation: drift 22s ease-in-out infinite;
        }
        .b1{ left:-10%; top:5%;
          background: radial-gradient(closest-side, ${bg[0]} 0%, transparent 70%);
          animation-delay: -4s;
        }
        .b2{ right:-8%; top:18%;
          background: radial-gradient(closest-side, ${bg[1]} 0%, transparent 70%);
          animation-delay: -10s;
        }
        .b3{ left:25%; bottom:-12%;
          background: radial-gradient(closest-side, ${bg[2]} 0%, transparent 70%);
          animation-delay: -16s;
        }
        @keyframes drift{
          0%  { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(0,-3%,0) scale(1.05); }
          100%{ transform: translate3d(0,0,0) scale(1); }
        }

        .u-shell{
          position:relative; z-index:1;
          max-width: 1200px; margin: 0 auto; padding: 28px 20px 72px;
        }

        /* Glass surface (no hard borders) */
        .glass{
          background: rgba(18,18,22,.54);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
        }

        /* HERO */
        .u-hero{ padding: 28px 22px; text-align:center; }
        .u-kicker{ display:flex; justify-content:center; margin-bottom:8px; }
        .u-title{
          font-size: clamp(2rem, 4.2vw, 3.2rem);
          line-height:1.06; letter-spacing:-.02em; color:#eafff7; margin:6px 0;
          background: linear-gradient(135deg, ${accent.a}, ${accent.b});
          -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 20px rgba(0,0,0,.28);
        }
        .u-sub{ color:#cfe9df; max-width: 56ch; margin: 0 auto; }
        .u-actions{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:14px; }

        /* ABOVE FOLD */
        .u-above{ padding: 16px; margin-top:16px; }

        /* FEEDS */
        .u-feeds{
          display:grid; grid-template-columns: 1fr; gap:16px; margin-top:16px;
        }
        .u-primary{ padding: 16px; }
        .u-secondary{ padding: 16px; }
        @media (min-width: 980px){
          .u-feeds{ grid-template-columns: 1.6fr .8fr; }
        }

        /* HOW IT WORKS + CTA */
        .u-hiw{ padding: 18px; margin-top:16px; }
        .u-cta{ padding: 18px; margin-top:16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }

        /* FOOT */
        .u-meta{ color:#7fcfb6; opacity:.9; font-size:.92rem; text-align:center; margin-top:18px; }

        /* Shared atoms-ish helpers */
        :global(.btn){
          display:inline-flex; align-items:center; gap:.55rem;
          padding:.8rem 1.05rem; border-radius:14px; border:1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.04); color:#ddfff4; font-weight:700;
          transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
          box-shadow: 0 6px 20px rgba(0,0,0,.18);
        }
        :global(.btn:hover){ transform: translateY(-1px); background: rgba(255,255,255,.06); box-shadow: 0 10px 28px rgba(0,0,0,.24); }
        :global(.btn:active){ transform: translateY(0); box-shadow: 0 4px 14px rgba(0,0,0,.18); }

        :global(.btn-primary){
          background: linear-gradient(135deg, ${accent.a}, ${accent.b});
          color:#08120f; border-color: transparent;
          box-shadow: 0 10px 30px rgba(38, 198, 218, .32);
        }
        :global(.btn-primary:hover){ box-shadow: 0 16px 40px rgba(38,198,218,.42); }
        :global(.btn-ghost){ background:transparent; color:#bff4e5; }

        :global(.badge){
          display:inline-flex; align-items:center; gap:.4rem; padding:.4rem .7rem; border-radius:999px;
          background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); color:#cfe9df; font-weight:700;
        }
      `}</style>
      <style jsx global>{`
        /* palette stops vary by page */
        .u-root .b1{ opacity:.35 }
        .u-root .b2{ opacity:.32 }
        .u-root .b3{ opacity:.28 }
      `}</style>
    </div>
  )
}

function paletteToStops(p: UniverseTemplateProps['bgPalette']): [string,string,string] {
  switch (p) {
    case 'cyan':    return ['#67e8f9', '#22d3ee', '#06b6d4']
    case 'amber':   return ['#fed7aa', '#fbbf24', '#fb923c']
    case 'emerald': return ['#bbf7d0', '#34d399', '#10b981']
    case 'rose':    return ['#fecdd3', '#fb7185', '#f43f5e']
    default:        return ['#e9d5ff', '#a78bfa', '#60a5fa'] // violet-ish
  }
}