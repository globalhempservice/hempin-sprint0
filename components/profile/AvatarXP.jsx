import { useMemo } from 'react';

export default function AvatarXP({ name, avatarUrl, levelLabel, levelNum, pct }) {
  const radius = 56;           // px
  const stroke = 8;            // px
  const C = 2 * Math.PI * radius;
  const dash = useMemo(() => Math.max(0.001, C * pct), [C, pct]);

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <svg width={ (radius+stroke)*2 } height={ (radius+stroke)*2 } role="img" aria-label="Leaf XP">
          <circle cx="50%" cy="50%" r={radius} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth={stroke} />
          <circle
            cx="50%" cy="50%" r={radius} fill="none"
            stroke="var(--success)" strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C-dash}`}
            transform={`rotate(-90 ${(radius+stroke)} ${(radius+stroke)})`}
            className="transition-[stroke-dasharray] duration-700"
          />
        </svg>
        <img
          alt={name}
          src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=15151c&color=eaeaf2`}
          className="absolute inset-0 m-auto h-24 w-24 rounded-full object-cover ring-2 ring-white/10"
        />
      </div>
      <div>
        <div className="text-lg text-[var(--text-2)]">Level {levelNum} • {levelLabel}</div>
        <div className="text-2xl font-semibold">{name}</div>
        <div className="text-sm text-[var(--text-2)]">Your hemp journey is growing.</div>
      </div>
    </div>
  );
}