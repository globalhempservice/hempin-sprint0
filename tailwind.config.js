/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        aurora: {
          emerald: 'rgb(var(--color-aurora-emerald) / <alpha-value>)',
          cyan: 'rgb(var(--color-aurora-cyan) / <alpha-value>)',
          magenta: 'rgb(var(--color-aurora-magenta) / <alpha-value>)',
        },
        accent: {
          teal: 'rgb(var(--color-accent-teal) / <alpha-value>)',
          indigo: 'rgb(var(--color-accent-indigo) / <alpha-value>)',
        },
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      spacing: {
        px2: '2px',
        px3: '3px',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
      },
      borderRadius: {
        xs: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 226, 181, 0.35)',
        aurora: '0 0 40px rgba(103, 232, 249, 0.28)',
        mag: '0 0 36px rgba(244, 114, 182, 0.28)',
        gold: '0 0 28px rgba(234, 179, 8, 0.35)',
        card: '0 2px 0 rgba(255,255,255,0.04), 0 1px 18px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        starfield:
          'radial-gradient(1300px 600px at 50% -10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(34,197,94,0.10), transparent 60%), radial-gradient(700px 400px at 10% 80%, rgba(168,85,247,0.10), transparent 60%)',
        aurora:
          'linear-gradient(120deg, rgba(var(--color-aurora-emerald),0.9), rgba(var(--color-aurora-cyan),0.85) 40%, rgba(var(--color-aurora-magenta),0.9))',
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.7', filter: 'drop-shadow(0 0 0px rgba(255,255,255,0.0))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.45))' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      ringWidth: { 3: '3px' },
      ringOffsetWidth: { 3: '3px' },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      addComponents({
        '.panel': {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.card'),
          backdropFilter: 'blur(10px)',
        },
        '.panel-hover': {
          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        },
        '.panel-hover:hover': { transform: 'translateY(-2px)', boxShadow: theme('boxShadow.aurora') },
      })
      addUtilities({
        '.text-glow': { textShadow: '0 0 16px rgba(255,255,255,0.25)' },
        '.border-gradient': {
          position: 'relative',
          border: '1px solid transparent',
          background:
            'linear-gradient(ink, ink) padding-box, linear-gradient(120deg, rgba(var(--color-aurora-emerald),1), rgba(var(--color-aurora-cyan),1), rgba(var(--color-aurora-magenta),1)) border-box',
        },
        '.bg-portal': {
          background:
            'radial-gradient(120px 80px at 50% 50%, rgba(255,255,255,0.12), transparent 60%), radial-gradient(600px 300px at 50% -40%, rgba(56,226,181,0.18), transparent 60%)',
        },
        '.shimmer': {
          backgroundImage:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2.2s linear infinite',
        },
      })
    },
  ],
}