// components/atomic/atoms/Pill.tsx
export default function Pill({ children }: { children: any }) {
    return (
      <span style={{
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: 999, padding: '.35rem .65rem', fontSize: '.75rem', opacity: .9
      }}>{children}</span>
    )
  }