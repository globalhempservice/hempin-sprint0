'use client';
import { useEffect, useRef } from 'react';

type Star = {
  x: number; y: number; r: number; a: number; tw: number; speed: number; hue: number; layer: 0|1;
};

export default function Starfield() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const farRef  = useRef<HTMLCanvasElement | null>(null);
  const nearRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef   = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const cFar  = farRef.current!;
    const cNear = nearRef.current!;
    const cFx   = fxRef.current!;
    const ctxF  = cFar.getContext('2d')!;
    const ctxN  = cNear.getContext('2d')!;
    const ctxX  = cFx.getContext('2d')!;
    const dpr   = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // size to viewport
    const size = () => {
      const { clientWidth: Wcss, clientHeight: Hcss } = wrap;
      const W = Math.max(1, Math.floor(Wcss * dpr));
      const H = Math.max(1, Math.floor(Hcss * dpr));
      for (const c of [cFar, cNear, cFx]) {
        c.style.width = Wcss + 'px';
        c.style.height = Hcss + 'px';
        c.width = W; c.height = H;
      }
      return { W, H, Wcss, Hcss };
    };
    let { W, H } = size();

    // deterministic RNG for consistent look
    let seed = 0xC0FFEE ^ W ^ H;
    const rnd = () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // --- star distribution (much sparser, dimmer) ---
    const stars: Star[] = [];
    const densityBase = 0.00022;                 // ↓ from 0.0009 (≈75% fewer)
    const total = Math.floor(W * H * densityBase);
    for (let i = 0; i < total; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const layer = rnd() < 0.85 ? 0 : 1;        // far 85%, near 15% (was 60/40)
      const r = (layer ? 0.8 : 0.5) * (0.4 + rnd() * 1.0) * dpr; // smaller cores
      const a = 0.12 + rnd() * 0.25;            // lower alpha
      const tw = rnd() * Math.PI * 2;
      const speed = (layer ? 0.018 : 0.008) * (0.6 + rnd() * 0.8); // slower drift
      const hue = 190 + Math.floor(rnd() * 30) - 15;               // tighter palette
      stars.push({ x, y, r, a, tw, speed, hue, layer: layer as 0|1 });
    }

    // --- pre-rendered sprite for glow (smaller) ---
    const sprite = document.createElement('canvas');
    const sctx   = sprite.getContext('2d')!;
    const SR = 4 * dpr;                          // ↓ from 6
    sprite.width = sprite.height = SR * 2;
    const grad = sctx.createRadialGradient(SR, SR, 0, SR, SR, SR);
    grad.addColorStop(0, 'rgba(255,255,255,0.80)');  // dimmer
    grad.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = grad;
    sctx.beginPath(); sctx.arc(SR, SR, SR, 0, Math.PI * 2); sctx.fill();

    // --- nebulas (fewer, softer) ---
    type Blob = { x:number; y:number; r:number; hue:number; alpha:number; vx:number; vy:number };
    const blobs: Blob[] = [];
    const blobCount = 1 + Math.floor(rnd() * 2);        // 1–2 blobs (was 2–3)
    for (let i = 0; i < blobCount; i++) {
      const r = (Math.min(W, H) * (0.28 + rnd() * 0.18)); // a touch smaller
      blobs.push({
        x: rnd() * W, y: rnd() * H, r,
        hue: 165 + Math.floor(rnd() * 60),                 // cyan→violet
        alpha: 0.018 + rnd() * 0.022,                      // much softer
        vx: (rnd() - 0.5) * 0.015 * dpr,
        vy: (rnd() - 0.5) * 0.015 * dpr,
      });
    }

    // draw static positions once (base alpha, no twinkle)
    const paintStatic = () => {
      ctxF.clearRect(0, 0, W, H);
      ctxN.clearRect(0, 0, W, H);

      for (const s of stars) {
        const ctx = s.layer === 0 ? ctxF : ctxN;
        ctx.globalAlpha = s.a * 0.75;           // dimmer base
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.4);
        g.addColorStop(0, `hsla(${s.hue}, 90%, 92%, 0.75)`);
        g.addColorStop(0.25, `hsla(${s.hue}, 80%, 68%, 0.30)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2); ctx.fill();

        // crisp-ish core (only some stars get it to reduce “sparkle noise”)
        if (s.a > 0.22) {
          ctx.globalAlpha = Math.min(1, s.a + 0.1);
          ctx.drawImage(sprite, s.x - SR/2, s.y - SR/2, SR, SR);
        }
      }
      ctxF.globalAlpha = ctxN.globalAlpha = 1;
    };

    // animation
    let tPrev = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - tPrev) / 1000);
      tPrev = now;

      const px = reduce ? 0 : now * 0.0016;     // slower parallax
      const py = reduce ? 0 : now * 0.0008;

      for (const layer of [0, 1] as const) {
        const ctx = layer === 0 ? ctxF : ctxN;
        ctx.clearRect(0, 0, W, H);
        for (const s of stars) {
          if (s.layer !== layer) continue;
          const ox = (s.x + px * s.speed) % W;
          const oy = (s.y + py * s.speed) % H;

          const twFactor = reduce ? 1 : 0.96 + 0.04 * Math.sin((now * 0.0011) + s.tw); // gentler twinkle
          const R = s.r * (2.0 + (layer ? 1.4 : 1.0)) * twFactor;                       // smaller halo

          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R);
          g.addColorStop(0, `hsla(${s.hue}, 95%, 92%, ${0.7 * twFactor})`);
          g.addColorStop(0.25, `hsla(${s.hue}, 80%, 68%, ${0.26 * twFactor})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = s.a;
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.fill();

          if (s.a > 0.22) {
            ctx.globalAlpha = Math.min(1, s.a + 0.08);
            ctx.drawImage(sprite, ox - SR/2, oy - SR/2, SR, SR);
          }
        }
        ctx.globalAlpha = 1;
      }

      // FX layer: soft nebulas drifting
      ctxX.clearRect(0, 0, W, H);
      for (const b of blobs) {
        if (!reduce) { b.x += b.vx; b.y += b.vy; }
        if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;

        const g = ctxX.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue}, 70%, 65%, ${b.alpha})`);
        g.addColorStop(0.6, `hsla(${b.hue + 35}, 70%, 58%, ${b.alpha * 0.5})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctxX.fillStyle = g;
        ctxX.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }

      if (!reduce) raf.current = requestAnimationFrame(draw);
    };

    paintStatic();
    if (reduce) draw(performance.now());
    else raf.current = requestAnimationFrame(draw);

    const onResize = () => {
      const dims = size();
      W = dims.W; H = dims.H;
      seed = 0xC0FFEE ^ W ^ H;

      // rebuild stars with sparser density
      stars.length = 0;
      const totalR = Math.floor(W * H * 0.00022);
      for (let i = 0; i < totalR; i++) {
        const x = rnd() * W, y = rnd() * H, lay = rnd() < 0.85 ? 0 : 1;
        const r = (lay ? 0.8 : 0.5) * (0.4 + rnd() * 1.0) * dpr;
        const a = 0.12 + rnd() * 0.25, tw = rnd() * Math.PI * 2;
        const speed = (lay ? 0.018 : 0.008) * (0.6 + rnd() * 0.8);
        const hue = 190 + Math.floor(rnd() * 30) - 15;
        stars.push({ x, y, r, a, tw, speed, hue, layer: lay as 0|1 });
      }
      paintStatic();
      if (reduce) draw(performance.now());
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="starfield-root">
      <canvas ref={farRef} className="starfield-canvas far" />
      <canvas ref={nearRef} className="starfield-canvas near" />
      <canvas ref={fxRef} className="starfield-canvas fx" />
    </div>
  );
}