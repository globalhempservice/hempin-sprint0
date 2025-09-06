import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hempin',
  description: 'Enter the hemp universe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-black text-white antialiased overflow-x-hidden">
        {/* global HUD could live here later */}
        {children}
      </body>
    </html>
  )
}