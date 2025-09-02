import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps() {
  const { data: brands, error } = await supabase.from('public_brands_approved').select('*').order('featured', { ascending: false });
  return { props: { brands: brands || [] } };
}

export default function Marketplace({ brands }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">Marketplace</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(b => (
          <Link key={b.id} href={`/brand/${b.slug}`} className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-4 backdrop-blur-md hover:bg-white/5 transition">
            <div className="flex items-center gap-3">
              {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-white/10" />}
              <div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-[var(--text-2)] line-clamp-2">{b.summary}</div>
              </div>
            </div>
            {b.featured && <div className="mt-3 text-xs text-[var(--success)]">Featured</div>}
          </Link>
        ))}
      </div>
    </main>
  );
}