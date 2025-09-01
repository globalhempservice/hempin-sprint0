import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps({ params }) {
  const { data: rows } = await supabase.from('public_events_approved').select('*').eq('slug', params.slug).limit(1);
  const event = Array.isArray(rows) ? rows[0] : rows;
  if (!event) return { notFound: true };
  return { props: { event } };
}

export default function EventPage({ event }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-[var(--text)]">
      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <div className="text-[var(--text-2)]">{event.location}</div>
        <div className="mt-4 text-sm text-[var(--text-2)]">
          Event details MVP. Ticket cards + PayPal slot go here next.
        </div>
      </div>
    </main>
  );
}