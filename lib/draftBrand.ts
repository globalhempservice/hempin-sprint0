// lib/draftBrand.ts
export type DraftBrand = {
    name: string
    category: string
    description: string
  }
  
  const KEY = 'hempin:draft-brand'
  
  export function loadDraftBrand(): DraftBrand {
    if (typeof window === 'undefined') return { name: '', category: '', description: '' }
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return { name: '', category: '', description: '' }
      const parsed = JSON.parse(raw)
      return {
        name: parsed?.name ?? '',
        category: parsed?.category ?? '',
        description: parsed?.description ?? '',
      }
    } catch {
      return { name: '', category: '', description: '' }
    }
  }
  
  export function saveDraftBrand(d: DraftBrand) {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEY, JSON.stringify(d))
  }
  
  export function clearDraftBrand() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(KEY)
  }