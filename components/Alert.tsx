
export function Alert({ kind='info', children }:{ kind?: 'info'|'success'|'error', children: React.ReactNode }) {
  const styles = kind === 'success'
    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
    : kind === 'error'
    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
    : 'bg-white/5 border border-white/10 text-white/80'
  return <div className={`p-3 rounded ${styles}`}>{children}</div>
}
