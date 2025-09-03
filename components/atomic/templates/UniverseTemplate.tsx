// components/atomic/templates/UniverseTemplate.tsx
import { ReactNode } from 'react'

export type UniverseTemplateProps = {
  header: ReactNode
  leadActions?: ReactNode
  aboveFold?: ReactNode
  primaryFeed: ReactNode
  secondaryFeed?: ReactNode
  howItWorks?: ReactNode
  ctaStrip?: ReactNode
  footerMeta?: ReactNode
  background?: ReactNode
}

export default function UniverseTemplate(p: UniverseTemplateProps) {
  return (
    <div style={{ minHeight: '100vh', color: '#eafff7' }}>
      {p.background}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
        <section style={{ margin: '6px 0 10px 0' }}>{p.header}</section>
        {p.leadActions && <section style={{ margin: '6px 0' }}>{p.leadActions}</section>}
        {p.aboveFold && <section style={{ margin: '8px 0' }}>{p.aboveFold}</section>}
        <section style={{ margin: '10px 0' }}>{p.primaryFeed}</section>
        {p.secondaryFeed && <section style={{ margin: '10px 0' }}>{p.secondaryFeed}</section>}
        {p.howItWorks && <section style={{ margin: '10px 0' }}>{p.howItWorks}</section>}
        {p.ctaStrip && <section style={{ margin: '12px 0' }}>{p.ctaStrip}</section>}
        {p.footerMeta && <footer style={{ margin: '18px 0' }}>{p.footerMeta}</footer>}
      </div>
    </div>
  )
}