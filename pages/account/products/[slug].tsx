import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export async function getServerSideProps(ctx: any) {
  const slug = ctx.params?.slug as string
  const { data, error } = await supabase
    .from('products')
    .select('id,slug,name,description,price_label,images,approved,brand_id,created_at, brands:brand_id (slug,name)')
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data || (!data.approved)) {
    return { notFound: true }
  }
  return { props: { product: data } }
}

export default function ProductPage({ product }: any) {
  return (
    <>
      <Head><title>{product.name} — HEMPIN</title></Head>
      <div className="min-h-screen bg-[var(--app-bg,#0b0d0c)] text-white">
        <main className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <div className="text-[var(--text-2)]">{product.price_label || ''}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(product.images || []).slice(0,4).map((im: any, i: number) => (
              <img key={i} src={im.url} className="rounded-xl border border-white/10 object-cover" />
            ))}
          </div>
          <p className="mt-4 leading-relaxed text-[var(--text-1)]">{product.description}</p>
          {product.brands && (
            <div className="mt-6 text-sm text-[var(--text-2)]">
              By brand: <a className="underline" href={`/brands/${product.brands.slug}`}>{product.brands.name}</a>
            </div>
          )}
        </main>
      </div>
    </>
  )
}