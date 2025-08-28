import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, onAuthChange } from '../lib/auth'

type Props = { open: boolean; onClose: () => void }

export default function BurgerPanel({ open, onClose }: Props) {
  const [authed, setAuthed] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    getSession().then(({ data }) => setAuthed(Boolean(data.session)))
    const { data: sub } = onAuthChange((_e, s) => setAuthed(Boolean(s)))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ;(panelRef.current?.querySelector('a,button') as HTMLElement | null)?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  const loggedOut = [
    { href: '/account', label: 'Sign up / Sign in' },
    { href: '/start', label: 'Create your brand page' },
    { href: '/#about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]
  const loggedIn = [
    { href: '/account', label: 'Account' },
    { href: '/account#profile', label: 'My Profile' },
    { href: '/mybrand', label: 'My Brand' },
    { href: '/myproducts', label: 'My Products' },
  ]

  async function logout() {
    const { supabase } = await import('../lib/supabaseClient')
    await supabase.auth.signOut()
    onClose()
    router.push('/')
  }

  if (!open) return null
  const links = authed ? loggedIn : loggedOut

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden />
      <div
        id="burger-panel"
        role="dialog"
        aria-modal="true"
        ref={panelRef}
        className="fixed inset-y-0 left-0 z-[100] w-[300px] p-4 space-y-4 shadow-xl"
        style={{ background: 'var(--bg)' }}
      >
        <nav className="flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose}>{l.label}</Link>
          ))}
          {authed && <button className="btn btn-outline" onClick={logout}>Logout</button>}
        </nav>
      </div>
    </>
  )
}