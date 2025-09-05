import React from 'react'
import GlassSection from '../molecules/GlassSection'
import LowerHow from '../molecules/LowerHow'
import LowerCta from '../molecules/LowerCta'
import { type AccentKey } from '../particles/tokens'

type Cta = { label: string; href: string }

type Props = {
  density?: 'normal' | 'roomy'
  accent?: AccentKey
  showHow?: boolean
  showCta?: boolean
  cta?: Cta
}

export default function UniverseLowerTaxon({
  density = 'normal',
  accent = 'supermarket',
  showHow = true,
  showCta = true,
  cta,
}: Props) {
  return (
    <GlassSection density={density} accent={accent}>
      {showHow && <LowerHow />}

      {showCta && (
        <div style={{ marginTop: 12 }}>
          <LowerCta
            label={cta?.label ?? 'Learn more'}
            href={cta?.href ?? '#'}
          />
        </div>
      )}
    </GlassSection>
  )
}