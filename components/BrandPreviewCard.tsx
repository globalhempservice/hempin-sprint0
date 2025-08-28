// components/BrandPreviewCard.tsx
type Props = {
  name?: string
  category?: string
  description?: string
  heroUrl?: string
}

export default function BrandPreviewCard({ name, category, description, heroUrl }: Props) {
  return (
    <div className="rounded-2xl border bg-neutral-900/40 overflow-hidden">
      <div className="h-40 w-full bg-gradient-to-br from-emerald-900/40 to-neutral-900/40"
        style={heroUrl ? { backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-800" />
          <div>
            <div className="font-semibold">{name || 'Your Brand Name'}</div>
            <div className="text-xs uppercase tracking-wide text-neutral-400">{category || 'Category'}</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-neutral-300">
          {description || 'Write a short, strong description about your mission, materials and what makes your brand special.'}
        </p>
      </div>
    </div>
  )
}