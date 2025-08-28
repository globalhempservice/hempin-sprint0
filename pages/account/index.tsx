// pages/account/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AccountSidebar from '../../components/AccountSidebar'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }
    init()
  }, [])

  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">My Account</h1>
        {!user && <p>Please sign in to view your account.</p>}
        {user && (
          <div className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p>Welcome to your account dashboard.</p>
          </div>
        )}
      </main>
    </div>
  )
}