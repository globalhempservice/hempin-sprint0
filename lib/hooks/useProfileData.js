// /lib/hooks/useProfileData.js
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// The five universes we expose in UI
const MODULES = ['farm', 'factory', 'brand', 'research', 'events'];

function levelFromXP(xp) {
  // Simple progression: 0-99=Lv1 Seedling, 100-199=Lv2 Sprout, etc.
  const levelNum = Math.max(1, Math.floor(xp / 100) + 1);
  const labels = ['Seedling', 'Sprout', 'Leafy', 'Flowering', 'Harvest', 'Pioneer'];
  const levelLabel = labels[Math.min(levelNum - 1, labels.length - 1)];
  const pct = Math.min(1, (xp % 100) / 100);
  return { num: levelNum, label: levelLabel, pct };
}

export function useProfileData() {
  const [state, setState] = useState({
    loading: true,
    user: { id: null, name: 'Guest', avatar_url: null, persona: 'consumer' },
    xp: 0,
    level: { num: 1, label: 'Seedling', pct: 0 },
    stats: { sessions: 0, contributions: 0, badges: 0, impact: 0 },
    badges: [],
    modules: MODULES.map(key => ({ key, label: key[0].toUpperCase() + key.slice(1), enabled: false })),
    _entRow: null, // current entitlements row (for meta merging)
  });

  const load = useCallback(async () => {
    // 1) who am I
    const { data: auth } = await supabase.auth.getUser();
    const sessionUser = auth?.user;
    if (!sessionUser) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    // 2) profile (self)
    const { data: prof } = await supabase
      .from('profiles')
      .select('id, display_name, name, email, avatar_url, persona, session_count, last_seen_at')
      .eq('id', sessionUser.id)
      .single();

    // 3) XP from point_events
    let xp = 0;
    {
      const { data: pts } = await supabase
        .from('point_events')
        .select('points')
        .eq('user_id', sessionUser.id);
      if (Array.isArray(pts)) xp = pts.reduce((sum, r) => sum + (r.points || 0), 0);
    }
    const level = levelFromXP(xp);

    // 4) badges: catalog + earned
    const [{ data: catalog }, { data: earned }] = await Promise.all([
      supabase.from('badges').select('id, code, title, icon, active').eq('active', true),
      supabase.from('user_badges').select('badge_id, awarded_at').eq('user_id', sessionUser.id)
    ]);

    const earnedIds = new Set((earned || []).map(b => b.badge_id));
    const badges = (catalog || []).map(b => ({
      code: b.code,
      name: b.title,        // UI expects "name"
      icon: b.icon,
      earned: earnedIds.has(b.id),
    }));

    // 5) modules from entitlements.meta.modules
    let entRow = null;
    let enabledSet = new Set();
    {
      const { data: ent } = await supabase
        .from('entitlements')
        .select('user_id, meta')
        .eq('user_id', sessionUser.id)
        .maybeSingle();

      entRow = ent || null;
      const meta = ent?.meta || {};
      const modules = (meta.modules && typeof meta.modules === 'object') ? meta.modules : {};
      MODULES.forEach(k => { if (modules[k]) enabledSet.add(k); });
    }

    // 6) minimal stats (extend later)
    const stats = {
      sessions: prof?.session_count || 0,
      contributions: 0, // we can aggregate brands/products/events later
      badges: badges.filter(b => b.earned).length,
      impact: 0
    };

    setState({
      loading: false,
      user: {
        id: sessionUser.id,
        name: prof?.display_name || prof?.name || prof?.email || 'User',
        avatar_url: prof?.avatar_url || null,
        persona: prof?.persona || 'consumer'
      },
      xp,
      level,
      stats,
      badges,
      modules: MODULES.map(key => ({ key, label: key[0].toUpperCase() + key.slice(1), enabled: enabledSet.has(key) })),
      _entRow: entRow
    });
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, _s) => load());
    return () => sub?.subscription?.unsubscribe();
  }, [load]);

  const toggleModule = async (key) => {
    setState(s => ({
      ...s,
      modules: s.modules.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m),
    }));

    const userId = state.user.id;
    if (!userId) return;

    // Read current modules from local state’s entitlements row
    const current = state._entRow?.meta?.modules || {};
    const nextModules = { ...current, [key]: !current[key] };

    // Upsert entitlements meta.modules (owner RLS permits this)
    if (!state._entRow) {
      // create row
      await supabase.from('entitlements').insert({
        user_id: userId,
        meta: { modules: nextModules }
      });
    } else {
      await supabase.from('entitlements')
        .update({ meta: { ...(state._entRow.meta || {}), modules: nextModules } })
        .eq('user_id', userId);
    }

    // Optionally: award a badge via RPC (if you add it; see SQL below)
    // await supabase.rpc('grant_user_badge', { p_code: 'first_module' }).catch(() => {});
  };

  return { ...state, toggleModule };
}