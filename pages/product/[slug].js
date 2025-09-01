import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps({ params }) {
  const { data: rows } = await supabase
    .from('public_products_approved')
    .select('*')
    .eq('slug', params.slug)
    .limit(1);
  const product = Array.isArray(rows) ? rows[0] : rows;
  if (!product) return { notFound: true };
  return { props: { product } };
}

export default function ProductPage({ product }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-[var(--text)]">
      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-[var(--text-2)] mt-2">{product.price ? `$${product.price}` : 'Price on request'}</div>
        <div className="mt-4 text-sm text-[var(--text-2)]">Detail page MVP. More specs coming.</div>
      </div>
    </main>
  );
}