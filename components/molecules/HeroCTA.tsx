// components/molecules/HeroCTA.tsx
export default function HeroCTA({
    primaryLabel, primaryHref = '#',
    secondaryLabel, secondaryHref = '#',
  }: { primaryLabel: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string }) {
    return (
      <div style={{display:'flex', gap:12, flexWrap:'wrap', padding:16}}>
        <a className="btn primary" href={primaryHref}>{primaryLabel}</a>
        {secondaryLabel && <a className="btn ghost" href={secondaryHref}>{secondaryLabel}</a>}
      </div>
    )
  }