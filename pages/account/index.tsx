import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Account() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }
    fetchSession()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { authListener.subscription.unsubscribe() }
  }, [])

  const signIn = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined }
    })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Check your email for the magic link.')
  }

  const signOut = async () => { await supabase.auth.signOut() }

  return (
    <main className="container space-y-6">
      <h1 className="text-2xl font-bold">Account</h1>
      {!user ? (
        <form onSubmit={signIn} className="card space-y-3 max-w-md">
          <label className="block text-sm">Email</label>
          <input className="w-full p-2 rounded bg-black/30 border border-white/10" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send magic link'}</button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="card">
            <p className="text-sm opacity-80">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <button className="btn btn-outline" onClick={signOut}>Sign out</button>
        </div>
      )}
    </main>
  )
}
