// components/atomic/particles/tokens.ts
// Single source of truth for design tokens (colors, radii, motion, etc.)
// Keep this file dependency-free and TS-friendly.

export type AccentKey =
  | 'supermarket'
  | 'trade'
  | 'events'
  | 'research'
  | 'places'

type AccentPair = { a: string; b: string }

export const tokens = {
  // ───────────────────────────
  // Color system
  // ───────────────────────────
  // Core neutrals for dark UI
  neutral: {
    // base surfaces
    900: '#0b1011', // canvas
    850: '#0f1517', // panel
    800: '#131b1d', // card
    // strokes, lights
    700: 'rgba(255,255,255,0.08)',
    600: 'rgba(255,255,255,0.06)',
    500: 'rgba(255,255,255,0.04)',
    400: 'rgba(255,255,255,0.03)',
  },

  // Text scale for dark
  text: {
    high:  '#ECFFF7',        // almost white with a hint of mint
    base:  '#CFE9DF',        // body
    dim:   '#9AC8B7',        // meta
    foot:  '#79B5A0',        // footer / auxiliary
  },

  // Keep a compatibility alias for any legacy usage
  colors: {
    textHigh: '#ECFFF7',
  },

  // Universe accents (A→B gradients)
  accent: {
    supermarket: { a: '#A865E1', b: '#FF70C6' } as AccentPair, // violet / fuchsia
    trade:       { a: '#39B5FF', b: '#27E5D9' } as AccentPair, // blue / cyan
    events:      { a: '#FF9A3D', b: '#FFC24D' } as AccentPair, // amber / orange
    research:    { a: '#2ED1B0', b: '#56F5D0' } as AccentPair, // teal / emerald
    places:      { a: '#6CB75A', b: '#A4DE6A' } as AccentPair, // moss / olive
  } as Record<AccentKey, AccentPair>,

  // ───────────────────────────
  // Surfaces (no hard borders)
  // ───────────────────────────
  // Use these instead of solid fills; they layer well on dark.
  glass: `
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))
  `,
  glassStrong: `
    linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))
  `,
  // Ultra-subtle outline substitute
  stroke: 'rgba(255,255,255,0.06)',

  // Interactive rings (hover/focus glow)
  ring: (hex: string) =>
    `0 0 0 0.5px rgba(255,255,255,0.10), 0 8px 30px -10px ${hex}66`,

  // Soft inner glow for big orbs / hero accents
  orb: (a: string, b: string) =>
    `radial-gradient(60% 60% at 50% 40%, ${a}22, transparent 60%),
     radial-gradient(50% 50% at 60% 60%, ${b}18, transparent 60%)`,

  // ───────────────────────────
  // Geometry
  // ───────────────────────────
  radii: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 999,
    orb: 9999,
  },

  // Spacing scale (px)
  space: {
    0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32,
    9: 36, 10: 40, 12: 48, 14: 56, 16: 64,
  },

  // Typography ramp
  font: {
    family: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto`,
    weight: {
      regular: 400, medium: 600, bold: 800,
    },
    size: {
      xs: 12, sm: 14, md: 16, lg: 18,
      h6: 20, h5: 24, h4: 28, h3: 34, h2: 42, h1: 54,
    },
    lh: {
      tight: 1.1, snug: 1.2, normal: 1.35, relaxed: 1.5,
    },
  },

  // Elevation
  shadow:
    '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',

  // Motion
  motion: {
    fast: 120,
    base: 200,
    slow: 380,
    easing: 'cubic-bezier(.22,.61,.36,1)',
    spring: 'cubic-bezier(.16,1,.3,1)',
  },

  // Breakpoints
  bp: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  // Z-index layers
  z: {
    orb: 0,
    content: 1,
    floating: 10,
    nav: 100,
    modal: 1000,
  },

  // Component recipes (light guidance—use or ignore)
  component: {
    card: {
      surface: 'glass',   // pick glass / glassStrong
      padding: 16,
      radius: 'lg' as const,
    },
    pill: {
      paddingY: 6,
      paddingX: 12,
      radius: 'pill' as const,
    },
    button: {
      radius: 'pill' as const,
      height: 40,
    },
  },
}

// Helper to read accent pair by key
export const getAccent = (k: AccentKey) => tokens.accent[k]