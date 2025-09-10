// components/molecules/OrbitRing.tsx
export default function OrbitRing({
    center, radius, dashed, opacity = 0.18,
  }: {
    center: number;
    radius: number;
    dashed?: boolean;
    opacity?: number;
  }) {
    return (
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,.9)"
        strokeOpacity={opacity}
        strokeDasharray={dashed ? '4 6' : '0'}
        strokeWidth="1"
      />
    );
  }