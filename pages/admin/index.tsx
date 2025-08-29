// pages/admin/index.tsx
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'

export default function AdminDashboard() {
  return (
    <AdminShell title="Admin – Dashboard">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <div className="font-semibold mb-2">Moderation</div>
          <p className="opacity-80 mb-3">Review incoming brand submissions.</p>
          <Link className="btn btn-primary" href="/admin/submissions">Review submissions</Link>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Payments</div>
          <p className="opacity-80 mb-3">Inspect recent PayPal capture events.</p>
          <Link className="btn btn-primary" href="/admin/payments">View payments</Link>
        </div>
      </div>
    </AdminShell>
  )
}