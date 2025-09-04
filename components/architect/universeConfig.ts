import type { AccentKey } from '../atomic/particles/tokens'

export type Density = 'normal' | 'roomy'

export type UniverseConfig = {
  look: { accent: AccentKey; density: Density; showBackground: boolean }
  showFeatured: boolean
  showExplore: boolean
  showLower: boolean
  totals: { brands: number; products: number; events: number }
  content: {
    header: {
      bigTitle: string
      subtitle: string
      kicker: string
      ctaLabel: string
      ctaHref: string
    }
  }
}

export const defaultUniverseConfig: UniverseConfig = {
  look: { accent: 'supermarket', density: 'normal', showBackground: true },
  showFeatured: true,
  showExplore: true,
  showLower: true,
  totals: { brands: 12, products: 98, events: 3 },
  content: {
    header: {
      bigTitle: 'Shop the hemp multiverse',
      subtitle: 'Curated goods from vetted brands. Cannabis items are separate by default.',
      kicker: 'Supermarket',
      ctaLabel: 'Register your brand',
      ctaHref: '/account/brands/new',
    },
  },
}