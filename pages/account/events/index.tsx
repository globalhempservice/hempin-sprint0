import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function slugify(base) {
  const s = (base || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s || 'event';
}

// Normalize datetime-local input to ISO (safely)
function toISO(dt) {
  if (!dt) return null;
  // Accept "YYYY-MM-DDTHH:mm" (standard) or local variants like "YYYY/MM/DD, HH:mm"
  try {
    // Standard path
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) {
      const d = new Date(dt + ':00'); // add seconds
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    // Fallback: let Date try, but guard
    const d2 = new Date(dt);
    return isNaN(d2.getTime()) ? null : d2.toISOString();
  } catch {
    return null;
  }
}

async function uploadToBucket(file, pathPrefix) {
  if (!file) return null;
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const key = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('media').upload(key, file, {
    upsert: false,
    cacheControl: '3600',
    contentType: file.type || 'application/octet-stream', // 👈 NEW
    // metadata: { alt: 'logo or cover' }, // optional, if you want to enrich
  });
  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(key);
  return data?.publicUrl || null;
}

export default function EventsOwnerPanel() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null, title: '', summary: '',
    venue_name: '', city: '', country: '',
    starts_at: '', ends_at: '', cover_url: ''
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const suggestedSlug = useMemo(() => slugify(form.title), [form.title]);

  // Load my events
  useEffect(() => {
    const init = async () => {
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) console.warn('auth error:', authErr.message);
      if (!auth?.user) return;
      setUser(auth.user);

      try {
        // created_at now exists, but if it didn’t, we’d still render
        const { data, error } = await supabase
          .from('events')
          .select('id, slug, title, summary, venue_name, city, country, starts_at, ends_at, cover_url, status, featured, created_at')
          .eq('owner_profile_id', auth.user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setEvents(data || []);
      } catch (e) {
        console.warn('events list error:', e?.message || e);
        setEvents([]); // render anyway
      }
    };
    init();
    const sub = supabase.auth.onAuthStateChange(() => init());
    return () => sub?.data?.subscription?.unsubscribe?.();
  }, []);

  const startNew = () => {
    setForm({ id: null, title: '', summary: '', venue_name: '', city: '', country: '', starts_at: '', ends_at: '', cover_url: '' });
    setCoverFile(null);
    setMsg(null);
  };

  const startEdit = (ev) => {
    setForm({
      id: ev.id,
      title: ev.title || '',
      summary: ev.summary || '',
      venue_name: ev.venue_name || '',
      city: ev.city || '',
      country: ev.country || '',
      starts_at: (ev.starts_at || '').slice(0, 16), // yyyy-mm-ddThh:mm
      ends_at: (ev.ends_at || '').slice(0, 16),
      cover_url: ev.cover_url || ''
    });
    setCoverFile(null);
    setMsg(null);
  };

  const save = async () => {
    if (!user) {
      setMsg('You must be signed in.');
      return;
    }
    setBusy(true); setMsg(null);
  
    // 1) upload cover if present (do this once)
    let coverUrl = form.cover_url || null;
    try {
      if (coverFile) {
        coverUrl = await uploadToBucket(coverFile, `events/${user.id}/cover`);
      }
    } catch (e) {
      console.warn('cover upload failed:', e?.message || e);
      setMsg(`Error uploading image: ${e.message || e}`);
      setBusy(false);
      return;
    }
  
    // 2) prepare payload (without slug yet)
    const base = slugify(form.title);
    if (!base) { setMsg('Please enter a title'); setBusy(false); return; }
  
    const payloadBase = {
      title: form.title,
      summary: form.summary || null,
      venue_name: form.venue_name || null,
      city: form.city || null,
      country: form.country || null,
      starts_at: toISO(form.starts_at),
      ends_at: toISO(form.ends_at),
      cover_url: coverUrl,
      owner_profile_id: user.id,
      status: 'pending'
    };
  
    // 3) write with retry on duplicate slug (uses unique index ux_events_slug)
    const maxTries = 6; // base, -2..-6
    let attempt = 0;
    let lastErr = null;
  
    while (attempt < maxTries) {
      const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
      const payload = { ...payloadBase, slug: candidate };
  
      try {
        if (form.id) {
          // update path
          const { error } = await supabase.from('events').update(payload).eq('id', form.id);
          if (error) throw error;
        } else {
          // insert path
          const { error } = await supabase.from('events').insert(payload);
          if (error) throw error;
        }
        // success!
        setMsg('Saved. Your event is pending approval.');
        // refresh (non-blocking)
        try {
          const { data } = await supabase
            .from('events')
            .select('id, slug, title, summary, venue_name, city, country, starts_at, ends_at, cover_url, status, featured, created_at')
            .eq('owner_profile_id', user.id)
            .order('created_at', { ascending: false });
          setEvents(data || []);
          if (!form.id) startNew();
        } catch (e) {
          console.warn('refresh list err:', e?.message || e);
        }
        setBusy(false);
        return;
      } catch (e) {
        lastErr = e;
        // If duplicate key on slug, try next suffix; otherwise bail
        const msg = (e?.message || '').toLowerCase();
        const code = e?.code || '';
        const isDup =
          code === '23505' ||
          msg.includes('duplicate key') && msg.includes('slug') ||
          msg.includes('ux_events_slug');
        if (isDup) {
          attempt += 1;
          continue;
        } else {
          console.warn('save event failed:', e?.message || e);
          setMsg(`Error: ${e.message || e}`);
          setBusy(false);
          return;
        }
      }
    }
  
    // If we get here, all attempts collided
    setMsg('Error: could not find a unique URL slug. Try changing the title a bit.');
    setBusy(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">My Events</h1>

      <section className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
        {!events.length && <div className="text-[var(--text-2)]">You don’t have any events yet.</div>}
        <ul className="grid gap-3">
          {events.map(e => (
            <li key={e.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-[var(--text-2)]">{e.slug} {e.status === 'approved' ? '• approved' : `• ${e.status}`}</div>
              </div>
              <button className="text-sm underline" onClick={() => startEdit(e)}>Edit</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{form.id ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={startNew} className="text-sm underline">New</button>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Title</span>
            <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Summary</span>
            <textarea value={form.summary} onChange={e=>setForm(f=>({...f, summary:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" rows={3} />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Venue</span>
              <input value={form.venue_name} onChange={e=>setForm(f=>({...f, venue_name:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">City</span>
              <input value={form.city} onChange={e=>setForm(f=>({...f, city:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Country</span>
              <input value={form.country} onChange={e=>setForm(f=>({...f, country:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Starts at</span>
              <input type="datetime-local" value={form.starts_at} onChange={e=>setForm(f=>({...f, starts_at:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Ends at</span>
              <input type="datetime-local" value={form.ends_at} onChange={e=>setForm(f=>({...f, ends_at:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Cover (upload)</span>
            <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0] || null)} />
            {form.cover_url && <img alt="cover" src={form.cover_url} className="mt-2 h-24 rounded-lg object-cover" />}
          </label>

          <div className="grid gap-3 sm:grid-cols-3 mt-1">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Slug (suggested)</span>
              <input value={suggestedSlug} readOnly className="rounded-lg bg-white/5 border border-white/10 px-3 py-2" />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={busy} onClick={save} className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition">
              {busy ? 'Saving…' : (form.id ? 'Save changes' : 'Create')}
            </button>
            {msg && <div className="text-sm text-[var(--text-2)]">{msg}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}