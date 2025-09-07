'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Mount state (for unmount) and enter animation state
  const [mounted, setMounted] = useState(false);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // next frame -> trigger enter transition
      const id = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(id);
    } else {
      // play exit transition then unmount
      setEnter(false);
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 grid place-items-center transition-colors',
        enter ? 'bg-black/60 backdrop-blur-[2px]' : 'bg-black/0 backdrop-blur-0',
      ].join(' ')}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={[
          'w-[92vw] max-w-md rounded-xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl',
          'transform-gpu transition-all duration-200',
          enter ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1',
        ].join(' ')}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Welcome</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-zinc-400">
          Explore as a guest or sign in (providers coming soon).
        </p>

        {/* Primary: Guest */}
        <Link
          href="/profile?guest=true"
          className="mb-2 block w-full rounded-md border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-center text-sm text-emerald-200 hover:bg-emerald-400/15"
          onClick={onClose}
        >
          Continue as Guest
        </Link>

        {/* Coming-soon providers */}
        <div className="grid gap-2">
          <button
            disabled
            className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white opacity-60"
            title="Email magic link — coming soon"
          >
            Continue with Email (soon)
          </button>
          <button
            disabled
            className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white opacity-60"
            title="Google — coming soon"
          >
            Continue with Google (soon)
          </button>
        </div>

        <p className="mt-4 text-[11px] leading-5 text-zinc-500">
          By continuing, you agree to our Terms and acknowledge the Privacy Policy.
        </p>
      </div>
    </div>
  );
}