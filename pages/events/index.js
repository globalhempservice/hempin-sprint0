import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps() {
  const { data: events } = await supabase.from('public_events_approved').select('*').order('starts_at', { ascending: true });
  return { props: { events: events || [] } };
}

export default function EventsIndex({ events }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(e => (
          <Link key={e.id} href={`/events/${e.slug}`} className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-4 backdrop-blur-md hover:bg-white/5 transition">
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm text-[var(--text-2)]">{e.location}</div>
            {e.featured && <div className="mt-2 text-xs text-[var(--success)]">Featured</div>}
          </Link>
        ))}
        {!events.length && <div className="text-[var(--text-2)]">No events yet.</div>}
      </div>
    </main>
  );
}