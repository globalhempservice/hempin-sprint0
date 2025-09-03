// components/atomic/molecules/SearchBar.tsx
import { tokens } from '../particles/tokens'

type Props = {
  value: string
  onChange: (v: string) => void
  onReset?: () => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, onReset, placeholder }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: tokens.glass,
        borderRadius: tokens.radii.lg,
        padding: `0 ${tokens.space[3]}px`,
        height: 44,
        border: `1px solid ${tokens.stroke}`,
      }}
    >
      {/* search icon */}
      <span
        aria-hidden
        style={{
          fontSize: 16,
          marginRight: tokens.space[2],
          opacity: 0.7,
        }}
      >
        🔍
      </span>

      {/* input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search…'}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: tokens.text.base,
          fontSize: tokens.font.size.md,
          fontFamily: tokens.font.family,
        }}
      />

      {/* reset button (optional) */}
      {onReset && value && (
        <button
          onClick={onReset}
          style={{
            marginLeft: tokens.space[2],
            background: 'transparent',
            border: 'none',
            color: tokens.text.dim,
            cursor: 'pointer',
            fontSize: 16,
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}