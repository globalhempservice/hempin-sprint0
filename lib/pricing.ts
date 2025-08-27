// lib/pricing.ts
// Server-side pricing helper. All prices in cents (USD).
// For popup_bkk_2025, price depends on Europe/Paris date.

export type ProductId = 'brand_page'|'product'|'bundle_1b5p'|'popup_bkk_2025'|'popup_extra';

export function staticPriceUSD(productId: ProductId): number {
  switch (productId) {
    case 'brand_page': return 5000;
    case 'product': return 2000;
    case 'bundle_1b5p': return 10000;
    case 'popup_extra': return 10000;
    case 'popup_bkk_2025': return 50000; // base, overridden by date tiers below
    default: throw new Error('Unknown product id');
  }
}

// todayStr should be "YYYY-MM-DD" in Europe/Paris timezone.
export function priceFor(productId: ProductId, todayStr: string): number {
  if (productId !== 'popup_bkk_2025') return staticPriceUSD(productId);
  if (todayStr <= '2025-09-01') return 30000; // early
  if (todayStr <= '2025-09-30') return 40000; // general
  if (todayStr <= '2025-10-15') return 50000; // late
  throw new Error('Registration closed for Bangkok 2025');
}
