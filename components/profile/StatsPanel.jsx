export default function StatsPanel({ stats }) {
    const Item = ({ label, value }) => (
      <div className="flex items-baseline justify-between rounded-lg bg-white/5 px-3 py-2">
        <span className="text-sm text-[var(--text-2)]">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    );
  
    return (
      <div>
        <h3 className="mb-3 font-semibold">Stats</h3>
        <div className="grid gap-2">
          <Item label="Sessions" value={stats.sessions} />
          <Item label="Contributions" value={stats.contributions} />
          <Item label="Badges" value={stats.badges} />
          <Item label="Impact" value={stats.impact} />
        </div>
      </div>
    );
  }