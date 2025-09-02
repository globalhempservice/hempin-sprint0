// components/organisms/UniverseHeader.tsx
export default function UniverseHeader({
    kicker = 'Preview',
    title,
    tagline,
  }: { kicker?: string; title: string; tagline?: string }) {
    return (
      <>
        <span className="kicker">{kicker}</span>
        <h1>{title}</h1>
        {tagline && <p>{tagline}</p>}
      </>
    )
  }