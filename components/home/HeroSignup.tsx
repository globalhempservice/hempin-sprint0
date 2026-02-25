// components/home/HeroSignup.tsx
import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

type Role = 'LIFE' | 'WORK' | 'EXPLORER';
const ROLES: Role[] = ['LIFE', 'WORK', 'EXPLORER'];

export default function HeroSignup({
  defaultRole = 'LIFE',
  source = 'hempin.org#hero',
}: { defaultRole?: Role; source?: string }) {
  const [role, setRole] = React.useState<Role>(defaultRole);

  // ids to wire tabs -> panel
  const tablistId = React.useId();
  const panelId = React.useId();

  // keyboard arrows between tabs
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = ROLES.indexOf(role);
    if (i < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRole(ROLES[(i + 1) % ROLES.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRole(ROLES[(i - 1 + ROLES.length) % ROLES.length]);
    }
  };

  return (
    <div className="hero-signup">
      {/* Segmented control */}
      <div
        id={tablistId}
        className="hs-toggle"
        role="tablist"
        aria-label="Choose your mode"
        onKeyDown={onKeyDown}
      >
        {ROLES.map((r) => {
          const selected = r === role;
          return (
            <button
              key={r}
              id={`hero-tab-${r}`}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              className={`hs-pill ${selected ? 'is-active' : ''}`}
              onClick={() => setRole(r)}
              type="button"
            >
              {r === 'EXPLORER' ? 'EXPLORE' : r}
            </button>
          );
        })}
        {/* sliding indicator */}
        <span className={`hs-indicator ${role.toLowerCase()}`} aria-hidden />
      </div>

      {/* Glass card body */}
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`hero-tab-${role}`}
        className="hs-card hemp-glow-sm"
      >
        <div className="hs-body">
          <RoleCopy role={role} />
          <div className="hs-form">
            <EmailCTA role={role} source={source} />
          </div>
        </div>

        <div className="hs-foot">
          <span className="chip">No spam</span>
          <span className="chip">Full Privacy</span>
          <span className="chip">Early perks</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Copy ---------------- */

function RoleCopy({ role }: { role: Role }) {
  if (role === 'WORK') {
    return (
      <div className="hs-copy">
        <h3>Better WORK with hemp</h3>
        <p className="muted">
          Tools for brands, farms, and researchers. Operate products, materials, data, and APIs.
        </p>
      </div>
    );
  }
  if (role === 'EXPLORER') {
    return (
      <div className="hs-copy">
        <h3>EXPLORE as a guest</h3>
        <p className="muted">
          Wander the atlas, learn, and collect without committing yet. Switch to LIFE or WORK anytime.
        </p>
      </div>
    );
  }
  return (
    <div className="hs-copy">
      <h3>Add Hemp into your LIFE</h3>
      <p className="muted">
        Shop, learn, and contribute to the hemp community; collect experiences, and track your ecological impact.
      </p>
    </div>
  );
}