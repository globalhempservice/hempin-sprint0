// components/atomic/organisms/HowItWorks.tsx
export default function HowItWorks({ note }:{ note?:string }) {
    const Step = ({t,d}:{t:string;d:string}) => (
      <div style={{
        display:'flex', gap:10, alignItems:'flex-start',
        background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)',
        borderRadius:14, padding:12
      }}>
        <div style={{width:10,height:10,borderRadius:999,background:'linear-gradient(135deg,#a64dff,#ff5ad1)'}}/>
        <div><div style={{fontWeight:800}}>{t}</div><div style={{opacity:.85}}>{d}</div></div>
      </div>
    )
    return (
      <div>
        <h3>How it works</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginTop:8}}>
          <Step t="Submit" d="Brands add products with images and details."/>
          <Step t="Review" d="Moderators verify quality & compliance."/>
          <Step t="Appear" d="Approved items show up on shelves."/>
        </div>
        {note && <p style={{color:'#9bdcc9',marginTop:6}}>{note}</p>}
      </div>
    )
  }