'use client';

import { useEffect, useState } from 'react';

type LoginModalProps = {
  defaultOpen?: boolean;
};

export default function LoginModal({ defaultOpen = false }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <>
      {/* Trigger could be elsewhere too */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-white/15 transition"
      >
        Login / Sign up
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-zinc-900/95 border border-white/10 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-3">Welcome to HEMPIN</h2>

            {/* Primary action */}
            <a
              href="/account"
              className="block w-full text-center rounded-md bg-white/10 hover:bg-white/15 border border-white/15 py-2.5 mb-3"
            >
              Continue as guest
            </a>

            <div className="space-y-2 opacity-60 pointer-events-none">
              <div className="rounded-md border border-white/10 py-2.5 text-center">
                Sign in with Google <span className="text-xs">(coming soon)</span>
              </div>
              <div className="rounded-md border border-white/10 py-2.5 text-center">
                Sign in with Apple <span className="text-xs">(coming soon)</span>
              </div>
              <div className="rounded-md border border-white/10 py-2.5 text-center">
                Sign in with Wallet <span className="text-xs">(coming soon)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 text-xs opacity-60 hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}