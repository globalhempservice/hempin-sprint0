// components/atomic/organisms/UniverseHeader.tsx
import Pill from '../../atomic/atoms/Pill'
export default function UniverseHeader({ kicker, title, subtitle }:{
  kicker:string; title:string; subtitle?:string
}) {
  return (
    <>
      <Pill>{kicker}</Pill>
      <h1 style={{fontSize:'clamp(2rem,4vw,3rem)',lineHeight:1.04,letterSpacing:'-.02em',margin:'.5rem 0 0'}}>{title}</h1>
      {subtitle && <p style={{color:'#cfe9df',maxWidth:740,marginTop:8}}>{subtitle}</p>}
    </>
  )
}