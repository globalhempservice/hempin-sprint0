import React from 'react'
import GlassSection from '../molecules/GlassSection'
import LowerHow from '../molecules/LowerHow'
import LowerCta from '../molecules/LowerCta'
import { type AccentKey } from '../particles/tokens'

type Props = {
  density?: 'normal' | 'roomy'
  accent?: AccentKey
  // existing props (note, cta, etc.)
}

export default function UniverseLowerTaxon({
  density = 'normal',
  accent = 'supermarket',
  // ...rest props
}: Props) {
  return (
    <GlassSection density={density} accent={accent}>
      {/* existing lower section content */}
    </GlassSection>
  )
}