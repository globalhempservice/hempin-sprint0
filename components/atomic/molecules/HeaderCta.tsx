// components/atomic/molecules/HeaderCta.tsx
import { Button } from '../atoms/Button'
import { tokens } from '../particles/tokens'

type CTA = { label: string; href: string }

type Props = {
  primary: CTA
  secondary?: CTA
}

/**
 * A compact CTA bundle used inside universe headers.
 * Shows a strong primary button and an optional secondary link.
 */
export default function HeaderCta({ primary, secondary }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.space[3],
        flexWrap: 'wrap',
        marginTop: tokens.space[4],
      }}
    >
      <Button href={primary.href} kind="primary">
        {primary.label}
      </Button>

      {secondary && (
        <Button href={secondary.href} kind="text">
          {secondary.label}
        </Button>
      )}
    </div>
  )
}