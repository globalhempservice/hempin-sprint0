// pages/supermarket/index.tsx (or wherever the page lives)
import UniverseTemplate from '../../components/atomic/templates/UniverseTemplatePlay6'

export default function SupermarketPage(){
  return (
    <UniverseTemplate
      title="HEMPIN Supermarket"
      subtitle="Curated hemp goods. Scan stories. Earn leaves."
      bgPalette="violet"
      accent={{ a: '#a78bfa', b:'#60a5fa' }}
      header={<span className="badge">Supermarket</span>}
      leadActions={
        <>
          <a href="/supermarket" className="btn btn-primary">Open Supermarket</a>
          <a href="/onboarding" className="btn btn-ghost">How it works</a>
        </>
      }
      aboveFold={<div>{/* search, filters, etc. */}</div>}
      primaryFeed={<div>{/* product cards grid */}</div>}
      secondaryFeed={null /* or right rail widgets */}
      howItWorks={<div>{/* steps component */}</div>}
      ctaStrip={
        <>
          <div>Want to list your products?</div>
          <a href="/account/products" className="btn btn-primary">Add a product</a>
        </>
      }
      footerMeta={<div>HEMPIN © 2025 — crafted with 🌿</div>}
    />
  )
}