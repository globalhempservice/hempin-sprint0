import { useEffect, useRef } from 'react';

type GalaxyProps = {
  size?: number;      // CSS pixels; DPR-scaled internally
  stars?: number;     // number of stars
  arms?: number;      // spiral arm count
  speed?: number;     // base rotation speed (radians/sec)
  opacity?: number;   // global opacity of the galaxy layer
  seed?: number;      // RNG seed for reproducible looks
};

export default function Galaxy({
  size = 680,
  stars = 1200,
  arms = 4,
  speed = 0.12,
  opacity = 0.5,
  seed = 1337,
}: GalaxyProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = mm.matches;

    // canvas DPI
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);

    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const RMAX = Math.min(CX, CY) * 0.9; // layout radius

    // ---------------- RNG (LCG) ----------------
    let s = Math.max(1, Math.floor(seed)) % 2147483647;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    // ---------------- Spiral model ----------------
    // r = a * e^(bθ)
    const a = 2.0;
    const b = 0.20;

    // Precompute stars
    type Star = {
      x: number; y: number;    // base galactic coords (before rotation)
      r: number;               // pixel radius (DPR-scaled)
      hue: number;             // color hue
      tw: number;              // twinkle phase
      rad: number;             // distance from center for differential rotation
    };
    const starsBuf: Star[] = [];

    for (let i = 0; i < stars; i++) {
      const armIndex = i % arms;
      const t = (i / stars) * (Math.PI * 6) + armIndex * ((Math.PI * 2) / arms);
      const radius = a * Math.exp(b * t) + (rnd() - 0.5) * 6;
      const theta  = t + (rnd() - 0.5) * 0.25;

      // Base Cartesian position (galactic space)
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      const coreBias = Math.max(0, 1 - (radius / (size * 0.45)));
      const rPix = (0.6 + rnd() * 1.8 + coreBias * 1.6) * dpr;

      // aurora palette: emerald → cyan → magenta
      const hue = 150 + (theta * 35 + armIndex * 20) % 180;

      // twinkle phase
      const tw = rnd() * Math.PI * 2;

      starsBuf.push({ x, y, r: rPix, hue, tw, rad: Math.hypot(x, y) });
    }

    // Nebula “clouds” hugging the arms (few big gradients for color volume)
    type Cloud = { x: number; y: number; rx: number; ry: number; hue: number; alpha: number; };
    const clouds: Cloud[] = [];
    const cloudCount = 14;
    for (let i = 0; i < cloudCount; i++) {
      const armIndex = i % arms;
      const t = (i / cloudCount) * (Math.PI * 6) + armIndex * ((Math.PI * 2) / arms);
      const radius = (a * Math.exp(b * t)) * (0.85 + rnd() * 0.25);
      const theta = t + (rnd() - 0.5) * 0.22;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      const rx = (RMAX * (0.08 + rnd() * 0.10)) * dpr;
      const ry = rx * (0.65 + rnd() * 0.25);
      const hue = 150 + (armIndex * 28 + i * 5) % 200;
      const alpha = 0.10 + rnd() * 0.10;

      clouds.push({ x, y, rx, ry, hue, alpha });
    }

    // Shooting star state
    type Meteor = { x: number; y: number; vx: number; vy: number; life: number; };
    let meteor: Meteor | null = null;
    let nextMeteorAt = performance.now() + 12000 + rnd() * 8000;

    const spawnMeteor = () => {
      // start from top-left quadrant to diagonally cross
      const angle = (Math.PI * 0.15) + rnd() * 0.2;
      const speedPx = 240 * dpr; // px/sec
      const vx = Math.cos(angle) * speedPx;
      const vy = Math.sin(angle) * speedPx;
      const startR = RMAX * (0.6 + rnd() * 0.6);
      const startA = Math.PI * 1.2 + rnd() * 0.4;
      const x = CX - Math.cos(startA) * startR;
      const y = CY - Math.sin(startA) * startR;
      meteor = { x, y, vx, vy, life: 0 };
    };

    // ---------- draw loop ----------
    let tPrev = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - tPrev) / 1000);
      tPrev = now;

      // clear (soft vignette)
      ctx.clearRect(0, 0, W, H);
      const vignette = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 1.1);
      vignette.addColorStop(0, 'rgba(255,255,255,0.015)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.0)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // core bloom
      const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 0.55);
      core.addColorStop(0.00, 'rgba(255,255,255,0.14)');
      core.addColorStop(0.45, 'rgba(110,231,183,0.10)');
      core.addColorStop(0.90, 'rgba(96,165,250,0.02)');
      core.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, W, H);

      // base rotation angle + differential: inner spins slightly faster
      const baseAngle = reduceMotion ? 0 : now * 0.001 * speed;

      // nebula clouds
      ctx.globalAlpha = opacity * 0.85;
      for (const c of clouds) {
        // rotate cloud with slight radial differential
        const diff = 1 + (0.08 * (1 - Math.hypot(c.x, c.y) / (RMAX / dpr)));
        const ax = c.x * Math.cos(baseAngle * diff) - c.y * Math.sin(baseAngle * diff);
        const ay = c.x * Math.sin(baseAngle * diff) + c.y * Math.cos(baseAngle * diff);
        const px = CX + ax * dpr, py = CY + ay * dpr;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, Math.max(c.rx, c.ry) * 1.6);
        grad.addColorStop(0, `hsla(${c.hue}, 90%, 60%, ${c.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(baseAngle * 0.5);           // slight orientation drift
        ctx.scale(1, c.ry / c.rx);
        ctx.beginPath();
        ctx.arc(0, 0, c.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // stars
      ctx.globalAlpha = opacity;
      for (const s of starsBuf) {
        // differential rotation factor by radius (inner faster)
        const diff = 1 + (0.12 * (1 - s.rad / (RMAX / dpr)));
        const ax = s.x * Math.cos(baseAngle * diff) - s.y * Math.sin(baseAngle * diff);
        const ay = s.x * Math.sin(baseAngle * diff) + s.y * Math.cos(baseAngle * diff);
        const px = CX + ax * dpr, py = CY + ay * dpr;

        // twinkle (very subtle; prevents shimmer)
        const tw = 0.85 + 0.15 * Math.sin((now * 0.001 * 1.3) + s.tw);
        const coreR = Math.max(0.6, s.r * 0.55) * tw;

        // glow
        const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3.6);
        g.addColorStop(0.00, `hsla(${s.hue}, 95%, 92%, ${0.90 * tw})`);
        g.addColorStop(0.18, `hsla(${s.hue}, 95%, 70%, ${0.42 * tw})`);
        g.addColorStop(1.00, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, s.r * 3.6, 0, Math.PI * 2); ctx.fill();

        // core
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath(); ctx.arc(px, py, coreR, 0, Math.PI * 2); ctx.fill();
      }

      // shooting star (disabled if reduced motion)
      if (!reduceMotion) {
        if (!meteor && now > nextMeteorAt) {
          spawnMeteor();
          nextMeteorAt = now + 12000 + rnd() * 8000;
        }
        if (meteor) {
          meteor.life += dt;
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;

          // trail
          const trail = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 0.12, meteor.y - meteor.vy * 0.12);
          trail.addColorStop(0, 'rgba(255,255,255,0.9)');
          trail.addColorStop(1, 'rgba(96,165,250,0.0)');
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * 0.12, meteor.y - meteor.vy * 0.12);
          ctx.stroke();

          // head
          const head = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 6 * dpr);
          head.addColorStop(0, 'rgba(255,255,255,0.95)');
          head.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = head;
          ctx.beginPath(); ctx.arc(meteor.x, meteor.y, 6 * dpr, 0, Math.PI * 2); ctx.fill();

          // die when off-screen
          if (meteor.life > 1.8 || meteor.x > W + 50 || meteor.y > H + 50) meteor = null;
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      if (!reduceMotion) raf.current = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      draw(performance.now()); // single paint
    } else {
      raf.current = requestAnimationFrame(draw);
    }

    // cleanup
    const onChange = () => {
      if (mm.matches && raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
        draw(performance.now());
      }
    };
    mm.addEventListener?.('change', onChange);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      mm.removeEventListener?.('change', onChange);
    };
  }, [size, stars, arms, speed, opacity, seed]);

  return (
    <div className="galaxy-wrap" aria-hidden>
      <canvas ref={ref} className="galaxy-canvas" />
    </div>
  );
}