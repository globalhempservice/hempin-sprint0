// lib/hooks/useProfileData.js
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // your singleton

// UI expects these modules
const MODULES = ['farm', 'factory', 'brand', 'research', 'events'];

function levelFromXP(xp) {
  const val = Number.isFinite(xp) ? xp : 0;
  const levelNum = Math.max(1, Math.floor(val / 100) + 1);
  const labels = ['Seedling', 'Sprout', 'Leafy', 'Flowering', 'Harvest', 'Pioneer'];
  const levelLabel = labels[Math.min(levelNum - 1, labels.length - 1)];
  const pct = Math.min(1, (val % 100) / 100);
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
    _entRow: null,
  });

  const load = useCallback(async () => {
    try {
      // 1) Auth
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      const sessionUser = auth?.user;

      if (!sessionUser) {
        // not logged in — show guest UI instead of hanging
        setState(s => ({ ...s, loading: false }));
        return;
      }

      // 2) Profile
      let prof = null;
      {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, name, email, avatar_url, persona, session_count, last_seen_at')
          .eq('id', sessionUser.id)
          .limit(1);
        if (error) throw error;
        prof = Array.isArray(data) ? data[0] : data;
      }

      // 3) XP from point_events
      let xp = 0;
      {
        const { data, error } = await supabase
          .from('point_events')
          .select('points')
          .eq('user_id', sessionUser.id);
        if (error) throw error;
        xp = (data || []).reduce((sum, r) => sum + (r?.points || 0), 0);
      }
      const level = levelFromXP(xp);

      // 4) Badges (catalog + earned)
      let badges = [];
      {
        const [catRes, earnedRes] = await Promise.all([
          supabase.from('badges').select('id, code, title, icon, active').eq('active', true),
          supabase.from('user_badges').select('badge_id, awarded_at').eq('user_id', sessionUser.id)
        ]);
        const catalog = catRes?.data || [];
        const earned = earnedRes?.data || [];
        const earnedIds = new Set(earned.map(b => b.badge_id));
        badges = catalog.map(b => ({
          code: b.code,
          name: b.title,
          icon: b.icon,
          earned: earnedIds.has(b.id),
        }));
      }

      // 5) Entitlements meta.modules
      let entRow = null;
      let enabledSet = new Set();
      {
        const { data, error } = await supabase
          .from('entitlements')
          .select('user_id, meta')
          .eq('user_id', sessionUser.id)
          .limit(1);
        if (error) throw error;
        entRow = Array.isArray(data) ? data[0] : data;
        const meta = entRow?.meta || {};
        const modules = (meta.modules && typeof meta.modules === 'object') ? meta.modules : {};
        MODULES.forEach(k => { if (modules[k]) enabledSet.add(k); });
      }

      const stats = {
        sessions: prof?.session_count || 0,
        contributions: 0,
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
    } catch (e) {
      console.warn('useProfileData load() failed:', e?.message || e);
      // fail-open so UI renders
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
    const sub = supabase.auth.onAuthStateChange?.((_e, _s) => load());
    return () => {
      try { sub?.data?.subscription?.unsubscribe?.(); } catch {}
    };
  }, [load]);

  // ---- FIXED UPSERT VERSION (prevents 409 conflicts) ----
  const toggleModule = async (key) => {
    // 1) optimistic UI
    setState(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m),
    }));

    // read freshest values
    const { user, _entRow } = (function getFresh(s) { return s; })(state);
    const userId = user?.id;
    if (!userId) return;

    try {
      const currentEntMeta = (_entRow?.meta) || {};
      const currentModules =
        currentEntMeta.modules && typeof currentEntMeta.modules === 'object'
          ? currentEntMeta.modules
          : {};
      const nextModules = { ...currentModules, [key]: !currentModules[key] };

      const { data, error } = await supabase
        .from('entitlements')
        .upsert(
          { user_id: userId, meta: { ...currentEntMeta, modules: nextModules } },
          { onConflict: 'user_id' }
        )
        .select('user_id, meta')
        .single();

      if (error) throw error;

      // sync local copy
      setState(prev => ({ ...prev, _entRow: data }));
    } catch (e) {
      console.warn('toggleModule upsert failed:', e?.message || e);
      // revert optimistic change
      setState(prev => ({
        ...prev,
        modules: prev.modules.map(m => m.key === key ? { ...m, enabled: !m.enabled } : m),
      }));
    }
  };

  return { ...state, toggleModule };
}