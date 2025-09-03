// components/atomic/atoms/Button.tsx
import { useState } from 'react'
import Link from 'next/link'
import { tokens, type AccentKey } from '../particles/tokens'

type Kind = 'primary' | 'ghost' | 'text'

export function Button({
  children,
  onClick,
  href,
  kind = 'ghost',
  ariaLabel,
  accent = 'supermarket', // lets us theme by universe if needed
}: {
  children: any
  onClick?: () => void
  href?: string
  kind?: Kind
  ariaLabel?: string
  accent?: AccentKey
}) {
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const acc = tokens.accent[accent]

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '.5rem',
    padding: '.65rem .9rem',
    borderRadius: tokens.radii.pill,
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `transform ${tokens.motion.fast}ms ${tokens.motion.spring},
                 box-shadow ${tokens.motion.base}ms ${tokens.motion.easing},
                 background ${tokens.motion.base}ms ${tokens.motion.easing},
                 color ${tokens.motion.base}ms ${tokens.motion.easing},
                 opacity ${tokens.motion.fast}ms ${tokens.motion.easing}`,
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  }

  const skins: Record<Kind, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${acc.a}, ${acc.b})`,
      color: '#091015',
      border: '0',
      boxShadow: hover ? tokens.shadow : 'none',
    },
    ghost: {
      background: tokens.glass,
      border: `1px solid ${tokens.stroke}`,
      color: tokens.text.base,
      boxShadow: hover ? tokens.shadow : 'none',
      backdropFilter: 'blur(8px)',
    },
    text: {
      padding: 0,
      border: 0,
      background: 'transparent',
      color: tokens.text.base,
      opacity: hover ? 1 : 0.9,
      textDecoration: hover ? 'underline' : 'none',
    },
  }

  const motion: React.CSSProperties =
    active ? { transform: 'translateY(1px)' } : hover ? { transform: 'translateY(-1px)' } : {}

  const style = { ...base, ...skins[kind], ...motion }

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false)
      setActive(false)
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  }

  const content = (
    <span aria-label={ariaLabel} style={style} {...handlers}>
      {children}
    </span>
  )

  if (href) return <Link href={href}>{content}</Link>
  return (
    <button onClick={onClick} style={{ all: 'unset' }}>
      {content}
    </button>
  )
}

export default Button