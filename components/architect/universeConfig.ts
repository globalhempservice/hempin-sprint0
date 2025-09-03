// components/architect/universeConfig.ts
import type { AccentKey } from '../atomic/particles/tokens'

export type Density = 'normal' | 'roomy'

export type UniverseConfig = {
  accent: AccentKey
  density: Density

  // section toggles
  showFeatured: boolean
  showExplore: boolean
  showLower: boolean

  // numbers used in the Explore section preview
  totals: {
    brands: number
    products: number
    events: number
  }
}