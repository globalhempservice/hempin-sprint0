// components/home/Footer.tsx
import { useState } from 'react';

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs opacity-70 md:flex-row">
        <div>© {new Date().getFullYear()} Hempin</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowPrivacy(true)} className="hover:opacity-100">Privacy</button>
          <button onClick={() => setShowTerms(true)} className="hover:opacity-100">Terms</button>
        </div>
      </div>

      {/* Privacy modal */}
      {showPrivacy && (
        <Modal onClose={() => setShowPrivacy(false)} title="Privacy">
          <p className="text-sm opacity-80">
            We collect only what’s needed to provide Hempin and improve it. We don’t sell your data.
            You can request deletion at any time. Cookies are used for auth and essential analytics.
          </p>
        </Modal>
      )}

      {/* Terms modal */}
      {showTerms && (
        <Modal onClose={() => setShowTerms(false)} title="Terms">
          <p className="text-sm opacity-80">
            By using Hempin you agree to act lawfully, respect others, and follow local regulations.
            Features are experimental and provided “as is.” Some modules may require additional terms.
          </p>
        </Modal>
      )}
    </footer>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(560px,92vw)] rounded-2xl border border-white/10 bg-[#0b0b0d]/95 p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">{title}</h4>
          <button
            onClick={onClose}
            className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
          >
            Close
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}