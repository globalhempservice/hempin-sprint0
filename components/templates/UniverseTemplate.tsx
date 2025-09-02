// components/templates/UniverseTemplate.tsx
import { ReactNode } from 'react'

export type UniverseTemplateProps = {
  // brand accent (optional)
  accent?: { a: string; b: string }
  // sections (organisms wrapped as nodes)
  header: ReactNode
  leadActions?: ReactNode
  aboveFold?: ReactNode
  primaryFeed?: ReactNode
  secondaryFeed?: ReactNode
  howItWorks?: ReactNode
  ctaStrip?: ReactNode
  footerMeta?: ReactNode
}

export default function UniverseTemplate({
  accent,
  header,
  leadActions,
  aboveFold,
  primaryFeed,
  secondaryFeed,
  howItWorks,
  ctaStrip,
  footerMeta,
}: UniverseTemplateProps) {
  return (
    <div className="ut">
      <style jsx>{`
        .ut {
          min-height: 100vh;
          position: relative;
          background:
            radial-gradient(1000px 600px at 0% -10%, rgba(0,180,120,0.10), transparent 55%),
            radial-gradient(1000px 600px at 100% 110%, rgba(80,120,255,0.08), transparent 55%);
        }
        .wrap { max-width: 72rem; margin: 0 auto; padding: 20px; }
        .band { padding: 16px 0; }
        .grid {
          display: grid; gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 960px) {
          .grid {
            grid-template-columns: 2fr 1fr; /* primary + side */
          }
        }
        .panel {
          background: rgba(20,20,24,.6);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          backdrop-filter: blur(16px);
          padding: 16px;
        }
        .cta {
          margin-top: 16px;
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .accent {
          height: 6px; border-radius: 999px; overflow: hidden; margin: 8px 0 0;
          background: linear-gradient(90deg, ${accent?.a || '#1ee4a3'}, ${accent?.b || '#26c6da'});
          opacity: .8;
        }
      `}</style>

      <div className="wrap">
        {/* Header / hero */}
        <div className="band">
          <div className="panel">
            {header}
            <div className="accent" />
            {leadActions && <div className="cta">{leadActions}</div>}
          </div>
        </div>

        {/* Optional above-the-fold (filters, search, notice, etc.) */}
        {aboveFold && (
          <div className="band">
            <div className="panel">{aboveFold}</div>
          </div>
        )}

        {/* Main content area */}
        <div className="band">
          <div className="grid">
            <div>{primaryFeed && <div className="panel">{primaryFeed}</div>}</div>
            <aside>{secondaryFeed && <div className="panel">{secondaryFeed}</div>}</aside>
          </div>
        </div>

        {/* How it works */}
        {howItWorks && (
          <div className="band">
            <div className="panel">{howItWorks}</div>
          </div>
        )}

        {/* CTA strip */}
        {ctaStrip && (
          <div className="band">
            <div className="panel">{ctaStrip}</div>
          </div>
        )}

        {/* Footer meta */}
        {footerMeta && (
          <div className="band">
            <div className="panel">{footerMeta}</div>
          </div>
        )}
      </div>
    </div>
  )
}