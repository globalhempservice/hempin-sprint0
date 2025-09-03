// components/atomic/atoms/PriceTag.tsx
import { tokens } from '../particles/tokens'

type Props = {
  /**
   * Amount in minor units (e.g. cents). Preferred going forward.
   * Example: 1299 USD cents -> amountMinor=1299, currency='USD'
   */
  amountMinor?: number | null
  /**
   * Deprecated alias kept for backward-compat (cents == amountMinor for USD).
   */
  cents?: number | null
  /** ISO 4217 currency code (USD, EUR, JPY, THB, …). Defaults to USD. */
  currency?: string
  /** Optional locale for formatting (e.g. 'en-US', 'fr-FR'); defaults to browser/server locale. */
  locale?: string
  /** Visual density */
  size?: 'sm' | 'md'
  /** Optional fallback label (e.g. "Free", "TBA") if amount is missing */
  label?: string | null
  className?: string
}

/** Minimal minor-unit map; defaults to 2 if unknown */
const MINOR_UNITS: Record<string, number> = {
  // zero-decimal
  JPY: 0, KRW: 0, VND: 0,
  // common two-decimal
  USD: 2, EUR: 2, GBP: 2, CAD: 2, AUD: 2, NZD: 2, SGD: 2, HKD: 2, THB: 2, CHF: 2,
  // three-decimal examples
  BHD: 3, KWD: 3, OMR: 3, JOD: 3,
}

function minorUnitsFor(code?: string) {
  const c = (code || 'USD').toUpperCase()
  return MINOR_UNITS[c] ?? 2
}

function formatMoney(opts: {
  amountMinor: number
  currency: string
  locale?: string
}) {
  const { amountMinor, currency, locale } = opts
  const minor = minorUnitsFor(currency)
  const major = amountMinor / Math.pow(10, minor)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minor,
    maximumFractionDigits: minor,
  }).format(major)
}

export default function PriceTag({
  amountMinor,
  cents,
  currency = 'USD',
  locale,
  size = 'md',
  label,
  className,
}: Props) {
  // Back-compat: if amountMinor not provided, fall back to `cents`
  const minor = typeof amountMinor === 'number' ? amountMinor : (typeof cents === 'number' ? cents : undefined)

  const text =
    typeof minor === 'number'
      ? formatMoney({ amountMinor: minor, currency, locale })
      : (label ?? '')

  if (!text) return null

  return (
    <span
      className={className}
      style={{
        color: tokens.text.high,
        fontWeight: tokens.font.weight.bold,
        fontSize: size === 'sm' ? tokens.font.size.sm : tokens.font.size.md,
        lineHeight: tokens.font.lh.tight,
        letterSpacing: 0.2,
        textShadow: '0 0 6px rgba(0,0,0,.25)',
      }}
      aria-label="price"
    >
      {text}
    </span>
  )
}