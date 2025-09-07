'use client';

import Link from 'next/link';

export type UniverseBubbleProps = {
  label: string;
  locked?: boolean;
  hueFrom: string; // e.g., "from-emerald-400"
  hueTo: string;   // e.g., "to-emerald-700"
  ring?: string;   // e.g., "ring-emerald-400/50"
  hrefWhenUnlocked?: string;
  hrefWhenLocked?: string;
};

export default function UniverseBubble({
  label,
  locked = false,
  hueFrom,
  hueTo,
  ring = 'ring-white/10',
  hrefWhenUnlocked,
  hrefWhenLocked = '/?login=1',
}: UniverseBubbleProps) {
  const base = [
    'relative grid place-items-center text-center',
    'h-20 w-20 md:h-24 md:w-24 rounded-full backdrop-blur-sm',
    'transition-all duration-300',
    locked
      ? `opacity-60 ring-1 ${ring} bg-gradient-to-br from-white/5 to-white/0`
      : `opacity-100 ring-2 ${ring} bg-gradient-to-br ${hueFrom} ${hueTo} from-20%`,
    'hover:scale-[1.06] active:scale-[0.98]',
    'shadow-[0_0_28px_rgba(255,255,255,0.08)]',
  ].join(' ');

  const content = (
    <>
      <span className="text-[11px] md:text-xs text-white/90 font-medium drop-shadow">
        {label}
      </span>
      {locked && (
        <span className="absolute -bottom-2 text-[10px] text-zinc-400">Locked</span>
      )}
    </>
  );

  if (locked) {
    return (
      <Link href={hrefWhenLocked} className="pointer-events-auto group block">
        <div className={base}>{content}</div>
      </Link>
    );
  }

  if (hrefWhenUnlocked) {
    return (
      <Link href={hrefWhenUnlocked} className="pointer-events-auto group block">
        <div className={base}>{content}</div>
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}