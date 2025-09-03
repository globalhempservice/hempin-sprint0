// components/atomic/molecules/EmptyState.tsx
export default function EmptyState({ title, hint }:{title:string; hint?:string}) {
    return (
      <div style={{
        background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)',
        borderRadius:16, padding:28, textAlign:'center', gridColumn:'1/-1'
      }}>
        <div style={{
          width:100,height:100,borderRadius:999,margin:'0 auto 10px',
          background:'radial-gradient(closest-side,#a64dff,transparent 70%)',
          filter:'blur(22px)', opacity:.35
        }}/>
        <div style={{fontWeight:800,color:'#f0fff8'}}>{title}</div>
        {hint && <div style={{color:'#a9e5d5',marginTop:4}}>{hint}</div>}
      </div>
    )
  }