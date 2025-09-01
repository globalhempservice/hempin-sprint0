import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function slugify(base) {
  const s = (base || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s || 'brand';
}

export default function BrandOwnerPanel() {
  const [user, setUser] = useState(null);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', description: '', logo_url: '', cover_url: '', category: '', website: '', socials: {} });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // derived slug
  const suggestedSlug = useMemo(() => slugify(form.name), [form.name]);

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      setUser(auth.user);
      const { data } = await supabase
        .from('brands')
        .select('id, slug, name, description, logo_url, cover_url, category, website, socials, approved, featured, created_at')
        .eq('owner_id', auth.user.id)
        .order('created_at', { ascending: false });
      setBrands(data || []);
    };
    init();
    const sub = supabase.auth.onAuthStateChange(() => init());
    return () => sub?.data?.subscription?.unsubscribe?.();
  }, []);

  const startNew = () => {
    setForm({ id: null, name: '', description: '', logo_url: '', cover_url: '', category: '', website: '', socials: {} });
    setMsg(null);
  };

  const startEdit = (b) => {
    setForm({ id: b.id, name: b.name || '', description: b.description || '', logo_url: b.logo_url || '', cover_url: b.cover_url || '', category: b.category || '', website: b.website || '', socials: b.socials || {} });
    setMsg(null);
  };

  const save = async () => {
    if (!user) return;
    setBusy(true); setMsg(null);
    try {
      // ensure unique slug
      let base = slugify(form.name);
      if (!base) throw new Error('Please enter a name');
      let candidate = base;
      let n = 1;
      while (true) {
        const { data: exists } = await supabase.from('brands').select('id').eq('slug', candidate).limit(1);
        if (!exists || exists.length === 0 || (exists[0].id === form.id)) break;
        candidate = `${base}-${++n}`;
      }

      const payload = {
        name: form.name,
        description: form.description,
        logo_url: form.logo_url || null,
        cover_url: form.cover_url || null,
        category: form.category || null,
        website: form.website || null,
        socials: form.socials || {},
        slug: candidate,
        owner_id: user.id,
        approved: false // submit for approval
      };

      let res;
      if (form.id) {
        res = await supabase.from('brands').update(payload).eq('id', form.id).select('id').single();
      } else {
        res = await supabase.from('brands').insert(payload).select('id').single();
      }
      if (res.error) throw res.error;

      setMsg('Saved. Your brand is pending approval.');
      // refresh list
      const { data } = await supabase
        .from('brands')
        .select('id, slug, name, description, logo_url, cover_url, category, website, socials, approved, featured, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      setBrands(data || []);
      if (!form.id) startNew();
    } catch (e) {
      setMsg(`Error: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-[var(--text)]">
      <h1 className="text-2xl font-semibold mb-4">My Brands</h1>

      {/* List */}
      <section className="rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-white/10 p-4">
        {!brands.length && <div className="text-[var(--text-2)]">You don’t have any brands yet.</div>}
        <ul className="grid gap-3">
          {brands.map(b => (
            <li key={b.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-white/10" />}
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-[var(--text-2)]">{b.slug} {b.approved ? '• approved' : '• pending'}</div>
                </div>
              </div>
              <button className="text-sm underline" onClick={() => startEdit(b)}>Edit</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Form */}
      <section className="mt-6 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{form.id ? 'Edit Brand' : 'Create Brand'}</h2>
          <button onClick={startNew} className="text-sm underline">New</button>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Name</span>
            <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Description</span>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" rows={3} />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Logo URL</span>
              <input value={form.logo_url} onChange={e=>setForm(f=>({...f, logo_url:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Cover URL</span>
              <input value={form.cover_url} onChange={e=>setForm(f=>({...f, cover_url:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Category</span>
              <input value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-[var(--text-2)]">Website</span>
              <input value={form.website} onChange={e=>setForm(f=>({...f, website:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
            </label>
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