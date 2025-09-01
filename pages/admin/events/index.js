import { supabase } from '../../../lib/supabaseClient';

export async function getServerSideProps() {
  const { data: pending } = await supabase.from('events').select('id, title, status, featured, slug').neq('status', 'approved').order('created_at', { ascending: false });
  const { data: approved } = await supabase.from('events').select('id, title, status, featured, slug').eq('status', 'approved').order('updated_at', { ascending: false }).limit(20);
  return { props: { pending: pending || [], approved: approved || [] } };
}

export default function AdminEvents({ pending, approved }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">Admin • Events</h1>
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Pending</h2>
        <ul className="grid gap-2">
          {pending.map(e => (
            <li key={e.id} className="rounded-xl border border-white/10 bg-[var(--surface)]/70 p-3">
              <div className="flex items-center justify-between">
                <span>{e.title} <span className="text-[var(--text-2)]">({e.status})</span></span>
                <span className="text-xs text-[var(--text-2)]">slug: {e.slug || '—'}</span>
              </div>
            </li>
          ))}
          {!pending.length && <div className="text-[var(--text-2)]">No pending items.</div>}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Approved (recent)</h2>
        <ul className="grid gap-2">
          {approved.map(e => (
            <li key={e.id} className="rounded-xl border border-white/10 bg-[var(--surface)]/70 p-3">
              <div className="flex items-center justify-between">
                <span>{e.title}</span>
                <span className="text-xs text-[var(--text-2)]">{e.featured ? 'Featured' : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}