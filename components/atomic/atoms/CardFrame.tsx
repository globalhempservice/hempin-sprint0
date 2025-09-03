// components/atomic/atoms/CardFrame.tsx
export default function CardFrame({ children }:{children:any}) {
    return (
      <div style={{
        background:'rgba(14,18,20,.55)',
        border:'1px solid rgba(255,255,255,.08)',
        borderRadius:16, overflow:'hidden'
      }}>{children}</div>
    )
  }