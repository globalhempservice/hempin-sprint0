import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import { supabase } from '../../../lib/supabaseClient'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price_label: string | null
  images: { url: string; alt?: string }[] | null
  materials: Record<string, any> | null
  brand: { slug: string; name: string } | null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string

  // Only show approved products whose brand is also approved
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, slug, description, price_label, images, materials,
      brand:brands ( slug, name, approved )
    `)
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  // If product not found or brand not approved -> 404
  const p = data as any
  if (error || !p || p.brand?.approved === false) {
    return { notFound: true }
  }

  // Strip brand.approved before sending to client
  const product: Product = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price_label: p.price_label,
    images: p.images || [],
    materials: p.materials || null,
    brand: p.brand ? { slug: p.brand.slug, name: p.brand.name } : null
  }

  return { props: { product } }
}

export default function ProductPage({ product }: { product: Product }) {
  const img = (product.images && product.images[0]?.url) || null

  return (
    <div className="min-h-screen">
      <Head>
        <title>{product.name} • HEMPIN</title>
        <meta name="description" content={product.description || product.name} />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.images?.[0]?.alt || product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="aspect-[4/3] bg-white/10" />
          )}
        </section>

        <section>
          <div className="text-sm text-[var(--text-2)] mb-1">
            {product.brand && (
              <>
                <span>By </span>
                <Link href={`/brands/${product.brand.slug}`} className="underline hover:opacity-90">
                  {product.brand.name}
                </Link>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold mb-2">{product.name}</h1>

          {product.price_label && (
            <div className="text-xl mb-4">{product.price_label}</div>
          )}

          {product.description && (
            <p className="text-[var(--text-2)] leading-relaxed mb-6">{product.description}</p>
          )}

          {product.materials && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6">
              <div className="font-medium mb-2">Materials</div>
              <ul className="text-sm text-[var(--text-2)]">
                {Object.entries(product.materials).map(([k, v]) => (
                  <li key={k}>
                    <span className="opacity-80">{k}:</span> {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Link href="/supermarket" className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">
              Browse more
            </Link>
            {product.brand && (
              <Link href={`/brands/${product.brand.slug}`} className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">
                Visit brand
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}