// components/atomic/molecules/StatTriplet.tsx
export default function StatTriplet({ a,b,c }:{
    a:{label:string,value:number}, b:{label:string,value:number}, c:{label:string,value:number}
  }) {
    const Cell = ({label,value}:{label:string;value:number}) => (
      <div style={{
        background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)',
        borderRadius:14, padding:14, textAlign:'center'
      }}>
        <div style={{fontSize:'1.6rem',fontWeight:800,color:'#f4fffb'}}>{value}</div>
        <div style={{color:'#9bdcc9'}}>{label}</div>
      </div>
    )
    return (
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <Cell {...a}/><Cell {...b}/><Cell {...c}/>
      </div>
    )
  }