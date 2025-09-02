// components/templates/UniverseTemplate.tsx
import React from 'react'

type SlotProps = {
  header?: React.ReactNode
  leadActions?: React.ReactNode
  aboveFold?: React.ReactNode
  primaryFeed?: React.ReactNode
  secondaryFeed?: React.ReactNode
  howItWorks?: React.ReactNode
  ctaStrip?: React.ReactNode
  footerMeta?: React.ReactNode
  /** Accent gradient stops */
  accent?: { a: string; b: string }
}

/**
 * Shared shell used by all universes. It sets accent vars and exposes named slots.
 * No data fetching here—just layout & vibes.
 */
export default function UniverseTemplate({
  accent = { a: '#26c6da', b: '#1ee4a3' },
  header,
  leadActions,
  aboveFold,
  primaryFeed,
  secondaryFeed,
  howItWorks,
  ctaStrip,
  footerMeta,
}: SlotProps) {
  return (
    <div className="u">
      <style jsx>{`
        .u {
          --accA: ${accent.a};
          --accB: ${accent.b};
          --bg: #0a0e11;
          --panel: rgba(20, 20, 24, 0.6);
          --border: rgba(255, 255, 255, 0.08);
          --fg: #eafff7;
          --muted: #a9d6c7;
          min-height: 100vh;
          background:
            radial-gradient(1200px 600px at 0% -10%, rgba(37, 225, 176, .10), transparent 55%),
            radial-gradient(1200px 600px at 100% 110%, rgba(80, 120, 255, .08), transparent 55%),
            var(--bg);
          color: var(--fg);
          font-family: ui-sans-serif, system-ui;
        }
        .wrap { max-width: 1120px; margin: 0 auto; padding: 24px 18px 80px }
        .panel { background: var(--panel); border: 1px solid var(--border); border-radius: 16px }
        .hero {
          background: linear-gradient(180deg, rgba(0,0,0,.25), transparent),
            radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,.02), transparent),
            linear-gradient(135deg, var(--accA), var(--accB));
          border-radius: 16px;
          padding: 28px;
          color: #06130f;
          overflow: hidden;
          position: relative;
        }
        .hero :global(h1) { font-size: clamp(2.1rem, 6vw, 3rem); line-height: 1.05; font-weight: 900; letter-spacing: -.02em }
        .hero :global(p) { color: #07221a; opacity: .9; max-width: 56ch; margin-top: 8px }
        .slot { margin-top: 16px }
        .grid3 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px }
        .col6 { grid-column: span 6 }
        .col12 { grid-column: 1 / -1 }
        .card { border: 1px solid var(--border); border-radius: 14px; padding: 16px; background: rgba(255,255,255,.02) }
        .ctaStrip { display:flex; align-items:center; justify-content:space-between; gap: 14px; flex-wrap: wrap; padding:18px }
        .kicker { display:inline-flex; gap:.5rem; align-items:center; padding:.3rem .6rem; border:1px solid rgba(0,0,0,.2); border-radius:999px; font-size:.8rem; background:rgba(255,255,255,.35); color:#04211a; font-weight:800 }
        .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.65rem .9rem; border-radius:12px; border:1px solid rgba(255,255,255,.14); }
        .primary { background: linear-gradient(135deg, var(--accA), var(--accB)); color:#06130f; font-weight:800 }
        .ghost { color:#d7ffef; background:transparent }
        @media (max-width: 840px) { .col6{ grid-column: 1 / -1 } }
      `}</style>

      <div className="wrap">
        {/* Header (accent hero) */}
        {header && <div className="hero">{header}</div>}

        {/* Lead actions (search, filters, CTAs) */}
        {leadActions && <div className="slot panel">{leadActions}</div>}

        {/* Above fold (stats, sponsors…) */}
        {aboveFold && <div className="slot">{aboveFold}</div>}

        {/* Primary + secondary feeds */}
        {(primaryFeed || secondaryFeed) && (
          <div className="slot grid3">
            {primaryFeed ? <div className="col12">{primaryFeed}</div> : null}
            {secondaryFeed ? <div className="col12">{secondaryFeed}</div> : null}
          </div>
        )}

        {/* How it works */}
        {howItWorks && <div className="slot panel">{howItWorks}</div>}

        {/* CTA strip */}
        {ctaStrip && <div className="slot panel ctaStrip">{ctaStrip}</div>}

        {/* Footer meta */}
        {footerMeta && <div className="slot card">{footerMeta}</div>}
      </div>
    </div>
  )
}