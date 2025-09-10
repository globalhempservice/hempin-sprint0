// components/molecules/Tooltip.tsx
export default function Tooltip({
    visible, title, chip, blurb,
  }: { visible: boolean; title: string; chip?: string; blurb?: string }) {
    if (!visible) return null;
    return (
      <div className="pointer-events-none absolute left-1/2 top-[88%] -translate-x-1/2 w-[min(560px,92vw)]">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <div className="text-sm font-medium">
            {title}
            {chip && (
              <span className="ml-2 text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                {chip}
              </span>
            )}
          </div>
          {blurb && <p className="mt-1 text-xs opacity-80">{blurb}</p>}
        </div>
      </div>
    );
  }