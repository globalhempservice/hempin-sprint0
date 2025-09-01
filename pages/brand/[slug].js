import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export async function getServerSideProps({ params }) {
  const { data: brand } = await supabase.from('public_brands_approved').select('*').eq('slug', params.slug).single();
  const { data: products } = await supabase.from('public_products_approved').select('*').eq('brand_slug', params.slug);
  if (!brand) return { notFound: true };
  return { props: { brand, products: products || [] } };
}

export default function BrandPage({ brand, products }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)]">
      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-white/10" />}
          <div>
            <h1 className="text-2xl font-semibold">{brand.name}</h1>
            <p className="text-[var(--text-2)]">{brand.summary}</p>
          </div>
        </div>
      </div>

      <h2 className="mt-6 mb-3 font-semibold">Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.slug}`} className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-4 backdrop-blur-md hover:bg-white/5 transition">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-[var(--text-2)]">{p.price ? `$${p.price}` : '—'}</div>
          </Link>
        ))}
        {!products.length && <div className="text-[var(--text-2)]">No products yet.</div>}
      </div>
    </main>
  );
}