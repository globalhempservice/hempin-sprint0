// components/atomic/atoms/ImageTile.tsx
import { tokens } from '../particles/tokens'

type Props = {
  src?: string | null
  alt?: string
  height?: number
  radius?: 'all' | 'top'
  children?: React.ReactNode
  style?: React.CSSProperties
  fit?: 'cover' | 'contain'
}

export default function ImageTile({
  src,
  alt = '',
  height = 180,
  radius = 'top',
  children,
  style,
  fit = 'contain',
}: Props) {
  const r = tokens.radii.lg
  const rr = radius === 'all' ? r : `${r}px ${r}px 0 0`

  return (
    <div
      style={{
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: rr,
        background: `
          radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent),
          ${tokens.glass}
        `,
        ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: 'center',
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: tokens.glassStrong,
          }}
        />
      )}

      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: tokens.space[2],
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}