import ProfileLayout from '../../components/profile/ProfileLayout';
import AvatarXP from '../../components/profile/AvatarXP';
import BadgeShelf from '../../components/profile/BadgeShelf';
import StatsPanel from '../../components/profile/StatsPanel';
import ModuleGrid from '../../components/profile/ModuleGrid';
import { useProfileData } from '../../lib/hooks/useProfileData';

export default function ProfilePage() {
  const { loading, user, xp, level, stats, badges, modules, toggleModule } = useProfileData();

  if (loading) return <div className="min-h-screen grid place-items-center text-[var(--text-2)]">Loading…</div>;

  return (
    <ProfileLayout
      levelPct={level?.pct ?? 0}
      header={
        <AvatarXP
          name={user?.name}
          avatarUrl={user?.avatar_url}
          levelLabel={level?.label}
          levelNum={level?.num}
          pct={level?.pct}
        />
      }
      badges={<BadgeShelf badges={badges} />}
      stats={<StatsPanel stats={stats} />}
      modules={<ModuleGrid modules={modules} onToggle={toggleModule} />}
    />
  );
}