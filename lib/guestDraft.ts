// lib/guestDraft.ts
export type GuestDraft = {
    name?: string;
    tagline?: string;
    description?: string;
    category?: string;
    heroUrl?: string;
    hasProduct?: boolean;
  };
  
  const KEY = 'hempin_guest_brand_draft_v1';
  
  export function loadGuestDraft(): GuestDraft {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  
  export function saveGuestDraft(patch: Partial<GuestDraft>) {
    if (typeof window === 'undefined') return;
    const next = { ...loadGuestDraft(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  
  export function clearGuestDraft() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEY);
  }