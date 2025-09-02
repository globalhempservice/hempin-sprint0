// pages/play-universe.tsx
import UniverseTemplate from '../components/universe/UniverseTemplate'

export default function PlayUniverseDemo() {
  return (
    <UniverseTemplate
      theme="supermarket"
      // toggles (try turning some off to feel the system)
      showHero
      showActions
      showSearch
      showMetrics
      showFeatured
      showGrid
      showHowItWorks
      showCTA
      // content
      title="HEMPIN Supermarket"
      lead="Curated hemp goods. Scan stories. Earn leaves."
      primaryCta={{ label: 'Open Supermarket', href: '/supermarket' }}
      secondaryCta={{ label: 'Scan a product', href: '#' }}
      metrics={[
        { label: 'Brands', value: 56 },
        { label: 'Products', value: 128 },
        { label: 'Events', value: 13 },
      ]}
      featured={[
        { title: 'Editor’s picks', copy: 'Fresh drops & beloved staples.' },
        { title: 'Sustainable favorites', copy: 'Low-impact materials & packaging.' },
        { title: 'Trending now', copy: 'What the community is loving.' },
      ]}
      grid={Array.from({length:9},(_,i)=>({
        title:`Card ${i+1}`,
        copy:'Borderless surface with soft depth. Content flows, not boxes.',
        href:'#'
      }))}
    />
  )
}