import React from 'react'
import GlassSection from '../molecules/GlassSection'
import LowerHow from '../molecules/LowerHow'
import LowerCta from '../molecules/LowerCta'
import { type AccentKey } from '../particles/tokens'

type Density = 'normal' | 'roomy'

type Enabled = {
  howItWorks?: boolean
  lowerCta?: boolean
  lowerHow?: boolean      // reserved (if you later split components)
  lowerCtaStrip?: boolean // reserved
}

type Props = {
  density?: Density
  accent?: AccentKey
  enabled?: Enabled
}

export default function UniverseLowerTaxon({
  density = 'normal',
  accent = 'supermarket',
  enabled = {},
}: Props) {
  const showHow = enabled.howItWorks !== false
  const showCta = enabled.lowerCta !== false

  return (
    <GlassSection density={density} accent={accent}>
      {showHow && <LowerHow />}
      {showCta && <div style={{ marginTop: 12 }}><LowerCta /></div>}
    </GlassSection>
  )
}