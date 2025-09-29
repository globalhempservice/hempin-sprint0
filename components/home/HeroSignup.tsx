import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

type Role = 'LIFE' | 'WORK' | 'EXPLORER';

export default function HeroSignup({
  defaultRole = 'LIFE',
  source = 'hempin.org#hero',
}: { defaultRole?: Role; source?: string }) {
  const [role, setRole] = React.useState<Role>(defaultRole);

  return (
    <div className="hero-signup">
      {/* Segmented control */}
      <div className="hs-toggle" role="tablist" aria-label="Choose your mode">
        <button
          role="tab"
          aria-selected={role === 'LIFE'}
          className={`hs-pill ${role === 'LIFE' ? 'is-active' : ''}`}
          onClick={() => setRole('LIFE')}
        >
          LIFE
        </button>
        <button
          role="tab"
          aria-selected={role === 'WORK'}
          className={`hs-pill ${role === 'WORK' ? 'is-active' : ''}`}
          onClick={() => setRole('WORK')}
        >
          WORK
        </button>
        <button
          role="tab"
          aria-selected={role === 'EXPLORER'}
          className={`hs-pill ${role === 'EXPLORER' ? 'is-active' : ''}`}
          onClick={() => setRole('EXPLORER')}
        >
          EXPLORE
        </button>
        {/* sliding indicator */}
        <span
          className={`hs-indicator ${role.toLowerCase()}`}
          aria-hidden
        />
      </div>

      {/* Glass card body */}
      <div className="hs-card hemp-glow-sm">
        <div className="hs-body">
          <RoleCopy role={role} />
          {/* Keep your exact capture component; we only pass role + hero source */}
          <div className="hs-form">
            <EmailCTA role={role} source={source} />
          </div>
        </div>

        {/* tiny footer chips */}
        <div className="hs-foot">
          <span className="chip">No spam</span>
          <span className="chip">Full Privacy</span>
          <span className="chip">Early perks</span>
        </div>
      </div>
    </div>
  );
}

function RoleCopy({ role }: { role: Role }) {
  if (role === 'WORK') {
    return (
      <div className="hs-copy">
        <h3>Better WORK with hemp</h3>
        <p className="muted">
          Tools for brands, farms, and researchers. Operate products, Materials, data, and APIs.
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
        Shop,learn and contribute to the hemp community, collect experiences, and track your ecological impact.
      </p>
    </div>
  );
}