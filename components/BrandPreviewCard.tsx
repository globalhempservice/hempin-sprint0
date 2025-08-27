// components/BrandPreviewCard.tsx
type Brand = {
  name?: string | null
  description?: string | null
  category?: string | null
  website_url?: string | null
  hero_image_url?: string | null
  logo_url?: string | null
  slug?: string | null
}

export default function BrandPreviewCard({ brand }: { brand: Brand | null }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40">
      <div className="aspect-[16/9] w-full" style={{
        backgroundImage: brand?.hero_image_url ? `url(${brand.hero_image_url})` : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(24,24,27,0.6))',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden">
            {brand?.logo_url && <img src={brand.logo_url} alt="logo" className="h-full w-full object-cover" />}
          </div>
          <div>
            <div className="text-lg font-semibold">{brand?.name || "Your Brand Name"}</div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">{brand?.category || "Category"}</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-zinc-400 line-clamp-3">{brand?.description || "Write a short, strong description about your mission, materials and what makes your brand special."}</p>
        <div className="mt-4 flex gap-2">
          <a href="/account/brand" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500">Edit brand</a>
          <a href="#" className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400">Preview public page</a>
        </div>
      </div>
    </div>
  )
}
