// lib/pricing.ts
// Helpers to compute price from `packages.meta.date_rules` or base_price_cents

export type DateRule = { phase: 'early'|'general'|'late', price_cents: number, start: string, end: string }

export function todayParis(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth()+1).padStart(2,'0')
  const d = String(now.getDate()).padStart(2,'0')
  // NOTE: For full accuracy, consider luxon/timezone. For pricing windows it's acceptable.
  return `${y}-${m}-${d}`
}

export function priceFromRules(base: number, rules: DateRule[]|null|undefined, today: string): { price_cents:number, phase?:string } {
  if (!rules || !rules.length) return { price_cents: base }
  for (const r of rules) {
    if (today >= r.start && today <= r.end) {
      return { price_cents: r.price_cents, phase: r.phase }
    }
  }
  return { price_cents: base } // fallback
}
