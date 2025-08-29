// pages/account/products/index.tsx
import AccountSidebar from '../../../components/AccountSidebar'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export default function ProductsHarness() {
  const [slots, setSlots] = useState<number>(0)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc('get_available_product_slots')
      setSlots((data as number) ?? 0)
    }
    load()
  }, [])

  const useOne = async () => {
    await supabase.rpc('simulate_use_slot')
    setSlots((s) => Math.max(0, s - 1))
  }
  const releaseOne = async () => {
    await supabase.rpc('simulate_release_slot')
    setSlots((s) => s + 1)
  }

  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">My products</h1>
        <div className="card max-w-xl">
          <div className="mb-3">Available product slots: <b>{slots}</b></div>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={useOne}>Use 1 slot (simulate publish)</button>
            <button className="btn btn-outline" onClick={releaseOne}>Release 1 slot (simulate delete)</button>
          </div>
        </div>
      </main>
    </div>
  )
}