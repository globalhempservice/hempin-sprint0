import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import { supabase } from '../../lib/supabaseClient'

type Brand = { id: string; name: string; slug: string; logo_url?: string | null; approved?: boolean | null }
type Product = {
  id: string
  brand_id: string
  name: string
  slug: string
  description: string | null
  price_label: string | null
  images: { url?: string; alt?: string }[] | null
  approved?: boolean | null
}

type Props = { product: (Product & { brand: Brand }) | null }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug || '').trim()
  if (!slug) return { props: { product: null } }

  // 1) Fetch the product by slug (approved only), NO JOIN
  const { data: p, error: pe } = await supabase
    .from('products')
    .select('id,brand_id,name,slug,description,price_label,images,approved')
    .eq('slug', slug)
    .eq('approved', true)
    .maybeSingle()

  if (pe || !p) return { props: { product: null } }

  // 2) Fetch the brand explicitly; require approved for public view
  const { data: b, error: be } = await supabase
    .from('brands')
    .select('id,name,slug,logo_url,approved')
    .eq('id', p.brand_id)
    .eq('approved', true)
    .maybeSingle()

  if (be || !b) return { props: { product: null } }

  return { props: { product: { ...(p as Product), brand: b as Brand } } }
}

export default function ProductPage({ product }: Props) {
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Head><title>Product not found • HEMPIN</title></Head>
        <div className="rounded-xl border border-white/10 p-6 bg-white/5">Product not found.</div>
        <div className="mt-4">
          <Link href="/supermarket" className="underline">← Back to Supermarket</Link>
        </div>
      </div>
    )
  }

  const img = product.images?.[0]?.url || null

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Head><title>{product.name} • HEMPIN</title></Head>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-square">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-[var(--text-3)]">No image</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-xs text-[var(--text-2)]">
            <Link href="/supermarket" className="underline">Supermarket</Link> /{' '}
            <Link href={`/brands/${product.brand.slug}`} className="underline">{product.brand.name}</Link>
          </div>

          <h1 className="text-2xl font-semibold">{product.name}</h1>

          {product.price_label && (
            <div className="inline-flex items-center px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-sm">
              {product.price_label}
            </div>
          )}

          {product.description && (
            <p className="text-[var(--text-2)] whitespace-pre-line">{product.description}</p>
          )}

          <div className="pt-4">
            <Link href={`/brands/${product.brand.slug}`} className="inline-flex items-center gap-2 underline">
              {product.brand.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.brand.logo_url} className="h-6 w-6 rounded-full object-cover border border-white/10" alt="" />
              )}
              Visit {product.brand.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}