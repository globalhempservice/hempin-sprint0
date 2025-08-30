// lib/legalPages.tsx
import type { ReactNode } from 'react'

export type LegalDoc = {
  slug: string
  title: string
  summary: string
  updated?: string
  content: ReactNode
}

export const LEGAL_PAGES: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary:
      'What we collect, why, where it’s stored, and your rights. Covers Supabase auth, Netlify hosting, and PayPal.',
    updated: '2025-08-27',
    content: (
      <>
        <h2>Overview</h2>
        <p>
          We collect only what we need to run Hemp’in: account email (for login and notifications),
          profile data you submit (brand & product info), and payment metadata when you buy services.
        </p>
        <h3>Data processors</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hosting: Netlify (logs, static assets)</li>
          <li>Database & Auth: Supabase (profiles, sessions)</li>
          <li>Payments: PayPal (orders, captures)</li>
          <li>Optional analytics (disclosed in Cookie Policy)</li>
        </ul>
        <h3>Your rights</h3>
        <p>
          You can request access, correction, export, or deletion at any time. Email{' '}
          <a href="mailto:hello@hempin.example" className="underline">
            hello@hempin.example
          </a>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    summary:
      'Rules for using Hemp’in. No illegal sales, no harmful content. Disclaimers, limitation of liability, and governing law.',
    content: (
      <>
        <h2>Use of Service</h2>
        <p>
          You agree not to misuse Hemp’in, including illegal product listings, infringement, or
          abusive behavior. We may suspend accounts that violate these terms.
        </p>
        <h3>Payments & Refunds</h3>
        <p>
          Service purchases (brand pages, product slots, kits) are governed by the Refunds Policy.
          Disputes are handled via PayPal’s process and our support.
        </p>
        <h3>Liability</h3>
        <p>
          Hemp’in is provided “as is.” We are not liable for lost profits, data loss, or third-party
          actions.
        </p>
      </>
    ),
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    summary:
      'Explains essential cookies (auth/session) and any optional analytics; includes consent banner note.',
    content: (
      <>
        <h2>Cookies we use</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Essential: session/auth (required to log in)</li>
          <li>Optional: analytics (disabled by default, enabled with consent)</li>
        </ul>
        <p>You can change preferences anytime via the cookie banner or browser settings.</p>
      </>
    ),
  },
  {
    slug: 'refunds',
    title: 'Refunds & Cancellations',
    summary:
      'Clear timelines and conditions for kit orders, brand & product services, and pop-up events.',
    content: (
      <>
        <h2>Eligibility</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kits: refundable until the posted ordering cutoff date.</li>
          <li>Brand / product services: refundable before work begins.</li>
          <li>Event fees: refundable until the venue deadline on the event page.</li>
        </ul>
        <p>Refunds are issued to the original payment method (PayPal) within 7–10 business days.</p>
      </>
    ),
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    summary:
      'No medical or legal advice. Content is educational. Hemp regulations vary by jurisdiction.',
    content: (
      <>
        <p>
          Hemp’in content is for information only and not medical, legal, or financial advice. Check
          your local laws before selling, buying, or shipping hemp products.
        </p>
      </>
    ),
  },
  {
    slug: 'vendor-agreement',
    title: 'Vendor Agreement',
    summary:
      'Rules for brands: quality, compliance, truthful listings, and cooperation with moderation.',
    content: (
      <>
        <h2>Quality & Compliance</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide accurate product info and certifications where required.</li>
          <li>No counterfeit or unsafe goods.</li>
          <li>Cooperate with moderation and takedown requests.</li>
        </ul>
      </>
    ),
  },
  {
    slug: 'community',
    title: 'Community Guidelines',
    summary:
      'Be respectful. No harassment, hate, spam, or scams. Experiments are for learning—play nice.',
    content: (
      <>
        <ul className="list-disc pl-5 space-y-1">
          <li>No harassment, hate speech, or illegal activity.</li>
          <li>No spam/self-promotion outside designated areas.</li>
          <li>Report abuse via the contact in Privacy Policy.</li>
        </ul>
      </>
    ),
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    summary:
      'Our intent to meet WCAG 2.1 AA. How to request accessible alternatives or report issues.',
    content: (
      <>
        <p>
          We strive for WCAG 2.1 AA. If you face barriers, contact us and we’ll provide an accessible
          alternative within a reasonable timeframe.
        </p>
      </>
    ),
  },
]

export function findLegal(slug?: string) {
  return LEGAL_PAGES.find((p) => p.slug === slug)
}