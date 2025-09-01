import dynamic from 'next/dynamic';
import ProfileLayout from '@/components/profile/ProfileLayout';
import AvatarXP from '@/components/profile/AvatarXP';
import BadgeShelf from '@/components/profile/BadgeShelf';
import StatsPanel from '@/components/profile/StatsPanel';
import ModuleGrid from '@/components/profile/ModuleGrid';
import { useProfileData } from '@/lib/hooks/useProfileData';

// Example: lazy-load something heavy if needed
const LegacyProfileSection = dynamic(() => import('@/components/LegacyProfileSection').catch(() => () => null), { ssr: false });

export default function ProfilePage() {
  const { loading, user, xp, level, stats, badges, modules, toggleModule } = useProfileData();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-[var(--text-2)]">Loading profile…</div>;
  }

  const header = (
    <AvatarXP
      name={user.name || 'User'}
      avatarUrl={user.avatar_url}
      levelLabel={level.label}
      levelNum={level.num}
      pct={level.pct}
    />
  );

  return (
    <ProfileLayout
      header={header}
      badges={<BadgeShelf badges={badges} />}
      stats={<StatsPanel stats={stats} />}
      modules={<ModuleGrid modules={modules} onToggle={toggleModule} />}
      legacy={<LegacyProfileSection />}
    />
  );
}