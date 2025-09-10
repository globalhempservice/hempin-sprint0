// components/organisms/SolarSystem.tsx
import { Node, SystemConfig } from '@/lib/cosmos';
import CoreStar from '@/components/molecules/CoreStar';
import OrbitRing from '@/components/molecules/OrbitRing';
import Planet from '@/components/molecules/Planet';
import Tooltip from '@/components/molecules/Tooltip';
import MoonSystem from '@/components/molecules/MoonSystem'; // ← NEW

type Props = {
  nodes: Node[];
  config: SystemConfig;
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
};

export default function SolarSystem({ nodes, config, hoveredId, onHover }: Props) {
  const { size, radii, speeds, show, tiltDeg } = config;
  const center = size / 2;

  // split nodes
  const coreNode = nodes.find((n) => n.kind === 'core');
  const r1 = nodes.filter((n) => n.orbit === 1);
  const r2 = nodes.filter((n) => n.orbit === 2);
  const r3 = nodes.filter((n) => n.orbit === 3);

  // helper: evenly distribute angles with a phase so rings don’t align
  function spread(ring: Node[], phaseDeg: number): Node[] {
    const k = ring.length;
    if (!k) return ring;
    const step = 360 / k;
    return [...ring]
      .sort((a, b) => (a.angle ?? 0) - (b.angle ?? 0))
      .map((n, i) => ({ ...n, angle: (phaseDeg + i * step) % 360 }));
  }

  const r1Placed = spread(r1, 0);
  const r2Placed = spread(r2, 12);
  const r3Placed = spread(r3, 24);

  // Info for tooltip (core gets a nice default if blurb missing)
  const active =
    hoveredId === 'core'
      ? {
          title: coreNode?.title ?? 'Your Account',
          gem: coreNode?.gem ?? 'Diamond',
          blurb:
            coreNode?.blurb ??
            'Private dashboard + settings. Public profile is a layer above that you control.',
        }
      : nodes.find((n) => n.id === hoveredId!);

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        // global mild tilt (kept because this version centers correctly)
        transform: `rotateX(${tiltDeg}deg)`,
        transformOrigin: `${center}px ${center}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* One SVG guarantees a single real center for all rings */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Orbits (lines) */}
        {show.rings && (
          <>
            {show.orbits?.[1] && <OrbitRing center={center} radius={radii[1]} />}
            {show.orbits?.[2] && <OrbitRing center={center} radius={radii[2]} dashed />}
            {show.orbits?.[3] && (
              <OrbitRing center={center} radius={radii[3]} dashed opacity={0.14} />
            )}
          </>
        )}

        {/* Orbit 1 – tools */}
        {show.orbits?.[1] && (
          <g transform={`translate(${center}, ${center})`}>
            <g style={{ animation: `spin ${speeds[1]}s linear infinite` }}>
              {r1Placed.map((n) => (
                <g
                  key={n.id}
                  onMouseEnter={() => onHover?.(n.id)}
                  onMouseLeave={() => onHover?.(null)}
                >
                  {/* local center is (0,0) */}
                  <Planet
                    node={n}
                    radius={radii[1]}
                    center={0}
                    showLabel={show.labels}
                    spinSeconds={speeds[1]}        // ← keep label horizontal
                  />
                  {show.moons && n.moons?.length ? (
                    <MoonSystem
                      node={n}
                      orbitRadius={radii[1]}
                      center={0}
                      spinSeconds={Math.max(18, Math.round(speeds[1] / 2))} // pleasant pace
                      showLabels={show.labels}
                    />
                  ) : null}
                </g>
              ))}
            </g>
          </g>
        )}

        {/* Orbit 2 – universes */}
        {show.orbits?.[2] && (
          <g transform={`translate(${center}, ${center})`}>
            <g style={{ animation: `spin ${speeds[2]}s linear infinite` }}>
              {r2Placed.map((n) => (
                <g
                  key={n.id}
                  onMouseEnter={() => onHover?.(n.id)}
                  onMouseLeave={() => onHover?.(null)}
                >
                  <Planet
                    node={n}
                    radius={radii[2]}
                    center={0}
                    showLabel={show.labels}
                    spinSeconds={speeds[2]}        // ← keep label horizontal
                  />
                  {show.moons && n.moons?.length ? (
                    <MoonSystem
                      node={n}
                      orbitRadius={radii[2]}
                      center={0}
                      spinSeconds={Math.max(18, Math.round(speeds[2] / 2))}
                      showLabels={show.labels}
                    />
                  ) : null}
                </g>
              ))}
            </g>
          </g>
        )}

        {/* Orbit 3 – fields */}
        {show.orbits?.[3] && (
          <g transform={`translate(${center}, ${center})`}>
            <g style={{ animation: `spin ${speeds[3]}s linear infinite` }}>
              {r3Placed.map((n) => (
                <g
                  key={n.id}
                  onMouseEnter={() => onHover?.(n.id)}
                  onMouseLeave={() => onHover?.(null)}
                >
                  <Planet
                    node={n}
                    radius={radii[3]}
                    center={0}
                    showLabel={show.labels}
                    spinSeconds={speeds[3]}        // ← keep label horizontal
                  />
                  {show.moons && n.moons?.length ? (
                    <MoonSystem
                      node={n}
                      orbitRadius={radii[3]}
                      center={0}
                      spinSeconds={Math.max(18, Math.round(speeds[3] / 2))}
                      showLabels={show.labels}
                    />
                  ) : null}
                </g>
              ))}
            </g>
          </g>
        )}

        {/* Core stays at the absolute center + label + hover area */}
        <g
          onMouseEnter={() => onHover?.('core')}
          onMouseLeave={() => onHover?.(null)}
          style={{ cursor: 'pointer' }}
        >
          <CoreStar cx={center} cy={center} />
          {/* label (kept horizontal) */}
          <text
            x={center}
            y={center + 84}
            textAnchor="middle"
            className="fill-white/85 text-[11px] md:text-xs select-none"
          >
            {coreNode?.title ?? 'Your Account'}
          </text>
          {/* enlarged transparent hit area for easy hover */}
          <circle
            cx={center}
            cy={center}
            r={90}
            fill="transparent"
            pointerEvents="all"
          />
        </g>
      </svg>

      {/* Tooltip */}
      <Tooltip
        visible={!!active && !!show.tooltips}
        title={active?.title ?? ''}
        chip={active?.gem}
        blurb={active?.blurb}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg)} }
      `}</style>
    </div>
  );
}