// components/atomic/taxons/index.ts

export { default as UniverseHeaderTaxon }   from './UniverseHeaderTaxon'
export { default as UniverseFeaturedTaxon } from './UniverseFeaturedTaxon'
export { default as UniverseExploreTaxon }  from './UniverseExploreTaxon'
export { default as UniverseLowerTaxon }    from './UniverseLowerTaxon'

// Back-compat aliases (some files may still import *Section)
export { default as UniverseHeaderSection }   from './UniverseHeaderTaxon'
export { default as UniverseFeaturedSection } from './UniverseFeaturedTaxon'
export { default as UniverseExploreSection }  from './UniverseExploreTaxon'
export { default as UniverseLowerSection }    from './UniverseLowerTaxon'