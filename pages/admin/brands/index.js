import { supabase } from '../../../lib/supabaseClient';

export async function getServerSideProps() {
  const { data: pending } = await supabase.from('brands').select('id, display_name, status, featured, slug').neq('status', 'approved').order('created_at', { ascending: false });
  const { data: approved } = await supabase.from('brands').select('id, display_name, status, featured, slug').eq('status', 'approved').order('updated_at', { ascending: false }).limit(20);
  return { props: { pending: pending || [], approved: approved || [] } };
}

export default function AdminBrands({ pending, approved }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">Admin • Brands</h1>
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Pending</h2>
        <ul className="grid gap-2">
          {pending.map(b => (
            <li key={b.id} className="rounded-xl border border-white/10 bg-[var(--surface)]/70 p-3">
              <div className="flex items-center justify-between">
                <span>{b.display_name} <span className="text-[var(--text-2)]">({b.status})</span></span>
                <span className="text-xs text-[var(--text-2)]">slug: {b.slug || '—'}</span>
              </div>
            </li>
          ))}
          {!pending.length && <div className="text-[var(--text-2)]">No pending items.</div>}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Approved (recent)</h2>
        <ul className="grid gap-2">
          {approved.map(b => (
            <li key={b.id} className="rounded-xl border border-white/10 bg-[var(--surface)]/70 p-3">
              <div className="flex items-center justify-between">
                <span>{b.display_name}</span>
                <span className="text-xs text-[var(--text-2)]">{b.featured ? 'Featured' : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}