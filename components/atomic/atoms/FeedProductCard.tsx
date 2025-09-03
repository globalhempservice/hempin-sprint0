import Link from 'next/link'
import { tokens } from '../particles/tokens'

type Props = {
  slug: string
  name: string
  brandName?: string | null
  priceLabel?: string | null
  img?: string | null
}

export default function FeedProductCard({ slug, name, brandName, priceLabel, img }: Props) {
  const src = img || '/img/placeholder-product.png'

  return (
    <Link
      href={`/products/${slug}`}
      className="block"
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
        border: '1px solid rgba(255,255,255,.06)',
        boxShadow: '0 6px 28px rgba(0,0,0,.35)',
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 34px rgba(0,0,0,.45)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}}
      onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(0,0,0,.35)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'}}
    >
      <div
        style={{
          height: 160,
          display: 'grid',
          placeItems: 'center',
          background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.06), transparent)',
          borderBottom: '1px solid rgba(255,255,255,.06)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ padding: 12 }}>
        <div
          style={{ color: tokens.colors.textHigh, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}
          title={name}
        >
          {name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.colors.textLow }}>
          <span>{brandName || '—'}</span>
          {priceLabel ? <span style={{ color: tokens.colors.textAccent, fontWeight: 700 }}>{priceLabel}</span> : null}
        </div>
      </div>
    </Link>
  )
}