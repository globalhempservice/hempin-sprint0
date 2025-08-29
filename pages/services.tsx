// pages/services.tsx
import Head from 'next/head'

export default function ServicesPublic() {
  return (
    <div className="container py-10 space-y-6">
      <Head><title>Services • HEMPIN</title></Head>

      <h1 className="text-3xl font-bold">HEMPIN Services</h1>
      <p className="opacity-80 max-w-2xl">
        Pick exactly what you need to get your hemp brand visible online.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold mb-1">Brand Page</h3>
          <p className="opacity-80 text-sm mb-3">A hosted brand profile with your story, imagery, and links.</p>
          <a href="/signin" className="btn btn-primary">Get started</a>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-1">Product Pages</h3>
          <p className="opacity-80 text-sm mb-3">Create dedicated pages for up to five products.</p>
          <a href="/signin" className="btn btn-outline">Get started</a>
        </div>
      </div>
    </div>
  )
}