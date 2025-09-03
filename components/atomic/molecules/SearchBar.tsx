// components/atomic/molecules/SearchBar.tsx
export default function SearchBar({ value, onChange, placeholder }:{
    value:string; onChange:(s:string)=>void; placeholder?:string
  }) {
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.10)',
        padding:'.55rem .75rem', borderRadius:12, minWidth:280
      }}>
        <input
          value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder || 'Search…'}
          style={{ background:'transparent', border:0, outline:'none', color:'#eafff7', minWidth:220 }}
        />
        <span style={{opacity:.6,fontSize:'.85rem'}}>⌘K</span>
      </div>
    )
  }