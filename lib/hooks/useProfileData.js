// lib/hooks/useProfileData.js
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '../supabaseClient';

const MODULES = ['farm', 'factory', 'brand', 'research', 'events'];

function levelFromXP(xp) {
  const levelNum = Math.max(1, Math.floor((xp || 0) / 100) + 1);
  const labels = ['Seedling', 'Sprout', 'Leafy', 'Flowering', 'Harvest', 'Pioneer'];
  const levelLabel = labels[Math.min(levelNum - 1, labels.length - 1)];
  const pct = Math.min(1, ((xp || 0) % 100) / 100);
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
    _entRow: null
  });

  const load = useCallback(async () => {
    // If env/client missing, show mock UI instead of hanging.
    if (!supabase) {
      console.warn('Supabase client not available – showing mock profile.');
      setState(s => ({ ...s, loading: false }));
      return;
    }

    try {
      // 1) Auth
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      const sessionUser = auth?.user;

      if (!sessionUser) {
        // Not logged in → still show UI
        setState(s => ({ ...s, loading: false }));
        return;
      }

      // 2) Profile
      let prof = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, name, email, avatar_url, persona, session_count, last_seen_at')
          .eq('id', sessionUser.id)
          .limit(1);
        if (error) throw error;
        prof = Array.isArray(data) ? data[0] : data;
      } catch (e) {
        console.warn('profiles fetch failed:', e?.message || e);
      }

      // 3) XP from point_events
      let xp = 0;
      try {
        const { data, error } = await supabase
          .from('point_events')
          .select('points')
          .eq('user_id', sessionUser.id);
        if (error) throw error;
        xp = (data || []).reduce((sum, r) => sum + (r?.points || 0), 0);
      } catch (e) {
        console.warn('point_events fetch failed:', e?.message || e);
      }
      const level = levelFromXP(xp);

      // 4) Badges (catalog + earned)
      let badges = [];
      try {
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
          earned: earnedIds.has(b.id)
        }));
      } catch (e) {
        console.warn('badges fetch failed:', e?.message || e);
      }

      // 5) Modules from entitlements.meta.modules
      let entRow = null;
      let enabledSet = new Set();
      try {
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
      } catch (e) {
        console.warn('entitlements fetch failed:', e?.message || e);
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
      // Fail open: show mock UI instead of hanging.
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
    // Use the shared client’s auth listener, not a new client.
    const sub = supabase?.auth?.onAuthStateChange?.((_e, _s) => load());
    return () => {
      try { sub?.data?.subscription?.unsubscribe?.(); } catch {}
    };
  }, [load]);

  const toggleModule = async (key) => {
    // Optimistic UI
    setState(s => ({
      ...s,
      modules: s.modules.map(m => m.key === key ? ({ ...m, enabled: !m.enabled }) : m),
    }));

    const userId = state.user?.id;
    if (!userId || !supabase) return;

    try {
      const current = state._entRow?.meta?.modules || {};
      const nextModules = { ...current, [key]: !current[key] };

      if (!state._entRow) {
        const { error } = await supabase.from('entitlements').insert({
          user_id: userId,
          meta: { modules: nextModules }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('entitlements')
          .update({ meta: { ...(state._entRow.meta || {}), modules: nextModules } })
          .eq('user_id', userId);
        if (error) throw error;
      }

      // Optional: award badge via RPC if you created it
      // await supabase.rpc('grant_user_badge', { p_code: 'first_module' }).catch(() => {});
    } catch (e) {
      console.warn('toggleModule failed:', e?.message || e);
      // Revert optimistic change on error
      setState(s => ({
        ...s,
        modules: s.modules.map(m => m.key === key ? ({ ...m, enabled: !m.enabled }) : m),
      }));
    }
  };

  return { ...state, toggleModule };
}