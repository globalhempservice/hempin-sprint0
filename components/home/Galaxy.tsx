import { useEffect, useRef } from 'react';

type GalaxyProps = {
  size?: number;
  stars?: number;
  arms?: number;
  speed?: number;
  opacity?: number;
  seed?: number;
  tiltDeg?: number;
  ellipticity?: number;
};

export default function Galaxy({
  size = 760,
  stars = 1400,
  arms = 4,
  speed = 0.10,
  opacity = 0.5,
  seed = 1337,
  tiltDeg = 18,
  ellipticity = 0.72,
}: GalaxyProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = mm.matches;

    // DPI / size
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);

    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const RMAX = Math.min(CX, CY) * 0.92;

    // RNG
    let s = Math.max(1, Math.floor(seed)) % 2147483647;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    // Spiral model constants (declare BEFORE any usage)
    const SPIRAL_A = 2.0;
    const SPIRAL_B = 0.20;

    // ----- Stars -----
    type Star = {
      x: number; y: number;
      r: number; hue: number; tw: number; rad: number; halo: number;
    };
    const starsBuf: Star[] = [];
    for (let i = 0; i < stars; i++) {
      const arm = i % arms;
      const t = (i / stars) * (Math.PI * 6.2) + arm * ((Math.PI * 2) / arms);
      const radius = SPIRAL_A * Math.exp(SPIRAL_B * t) + (rnd() - 0.5) * 7;
      const theta  = t + (rnd() - 0.5) * 0.28;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      const nearCore = Math.max(0, 1 - (radius / (size * 0.45)));
      const base = rnd();
      const rPix = (base < 0.75 ? 0.6 + base * 1.2 : 1.2 + base * 2.3) + nearCore * 1.4;
      const hue = 150 + (theta * 36 + arm * 22 + rnd() * 12) % 200;
      const halo = 2.8 + rnd() * 2.2;

      starsBuf.push({ x, y, r: rPix * dpr, hue, tw: rnd() * Math.PI * 2, rad: Math.hypot(x, y), halo });
    }

    // ----- Nebula clouds -----
    type Cloud = { x: number; y: number; rx: number; ry: number; hue: number; a: number };
    const clouds: Cloud[] = [];
    const cloudCount = 16;
    for (let i = 0; i < cloudCount; i++) {
      const arm = i % arms;
      const t = (i / cloudCount) * (Math.PI * 6) + arm * ((Math.PI * 2) / arms);
      const radius = (SPIRAL_A * Math.exp(SPIRAL_B * t)) * (0.85 + rnd() * 0.28);
      const theta  = t + (rnd() - 0.5) * 0.25;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      const rx = (RMAX * (0.10 + rnd() * 0.12)) * dpr;
      const ry = rx * (0.6 + rnd() * 0.28);
      const hue = 150 + (arm * 28 + i * 7) % 210;
      const a = 0.12 + rnd() * 0.12;

      clouds.push({ x, y, rx, ry, hue, a });
    }

    // ----- Dust -----
    const dust: {x:number;y:number;r:number;a:number}[] = Array.from({length: 330}, () => ({
      x: (rnd() * size - size/2),
      y: (rnd() * size - size/2),
      r: (0.3 + rnd() * 0.9) * dpr,
      a: 0.03 + rnd() * 0.05
    }));

    // ----- Shooting star -----
    type Meteor = { x:number; y:number; vx:number; vy:number; life:number };
    let meteor: Meteor | null = null;
    let nextMeteorAt = performance.now() + 12000 + rnd() * 8000;
    const spawnMeteor = () => {
      const ang = (Math.PI * 0.15) + rnd() * 0.2;
      const sp  = 240 * dpr;
      const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp;
      const r0 = RMAX * (0.6 + rnd() * 0.6);
      const a0 = Math.PI * 1.2 + rnd() * 0.4;
      const x = CX - Math.cos(a0) * r0;
      const y = CY - Math.sin(a0) * r0;
      meteor = { x, y, vx, vy, life: 0 };
    };

    const tilt = (tiltDeg * Math.PI) / 180;
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const toScreen = (gx: number, gy: number) => {
      const ex = gx;
      const ey = gy * ellipticity;
      const tx = ex * ct - ey * st;
      const ty = ex * st + ey * ct;
      return [CX + tx * dpr, CY + ty * dpr] as const;
    };

    let tPrev = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - tPrev) / 1000);
      tPrev = now;

      ctx.clearRect(0, 0, W, H);

      // vignette
      const vig = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 1.1);
      vig.addColorStop(0, 'rgba(255,255,255,0.015)');
      vig.addColorStop(1, 'rgba(0,0,0,0.0)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // core bloom
      const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 0.52);
      core.addColorStop(0.00, 'rgba(255,255,255,0.12)');
      core.addColorStop(0.35, 'rgba(110,231,183,0.10)');
      core.addColorStop(0.85, 'rgba(96,165,250,0.03)');
      core.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, W, H);

      // CW rotation; inner faster
      const baseAngle = reduceMotion ? 0 : now * -0.001 * speed;

      // clouds
      ctx.globalAlpha = opacity * 0.9;
      for (const c of clouds) {
        const diff = 1 + (0.10 * (1 - Math.hypot(c.x, c.y) / (RMAX / dpr)));
        const ax = c.x * Math.cos(baseAngle * diff) - c.y * Math.sin(baseAngle * diff);
        const ay = c.x * Math.sin(baseAngle * diff) + c.y * Math.cos(baseAngle * diff);
        const [px, py] = toScreen(ax, ay);

        const grad = ctx.createRadialGradient(px, py, 0, px, py, Math.max(c.rx, c.ry) * 1.8);
        grad.addColorStop(0, `hsla(${c.hue}, 92%, 60%, ${c.a})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(baseAngle * 0.5);
        ctx.scale(1, c.ry / c.rx);
        ctx.beginPath();
        ctx.arc(0, 0, c.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // dust
      ctx.globalAlpha = opacity * 0.55;
      ctx.fillStyle = 'white';
      for (const d of dust) {
        const [px, py] = toScreen(d.x, d.y);
        ctx.globalAlpha = d.a;
        ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // stars
      ctx.globalAlpha = opacity;
      for (const s of starsBuf) {
        const diff = 1 + (0.14 * (1 - s.rad / (RMAX / dpr)));
        const ax = s.x * Math.cos(baseAngle * diff) - s.y * Math.sin(baseAngle * diff);
        const ay = s.x * Math.sin(baseAngle * diff) + s.y * Math.cos(baseAngle * diff);
        const [px, py] = toScreen(ax, ay);

        const tw = 0.86 + 0.18 * Math.sin((now * 0.0011) + s.tw);
        const coreR = Math.max(0.6, s.r * 0.55) * tw;

        const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * (3.6 + s.halo));
        g.addColorStop(0.00, `hsla(${s.hue}, 96%, 92%, ${0.92 * tw})`);
        g.addColorStop(0.20, `hsla(${s.hue}, 96%, 70%, ${0.46 * tw})`);
        g.addColorStop(1.00, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, s.r * (3.6 + s.halo), 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        ctx.beginPath(); ctx.arc(px, py, coreR, 0, Math.PI * 2); ctx.fill();
      }

      // meteor
      if (!reduceMotion) {
        if (!meteor && now > nextMeteorAt) {
          spawnMeteor();
          nextMeteorAt = now + 12000 + rnd() * 8000;
        }
        if (meteor) {
          meteor.life += dt;
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;

          const trail = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.vx * 0.14, meteor.y - meteor.vy * 0.14
          );
          trail.addColorStop(0, 'rgba(255,255,255,0.95)');
          trail.addColorStop(1, 'rgba(96,165,250,0.0)');
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * 0.14, meteor.y - meteor.vy * 0.14);
          ctx.stroke();

          const head = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 6 * dpr);
          head.addColorStop(0, 'rgba(255,255,255,0.95)');
          head.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = head;
          ctx.beginPath(); ctx.arc(meteor.x, meteor.y, 6 * dpr, 0, Math.PI * 2); ctx.fill();

          if (meteor.life > 1.8 || meteor.x > W + 50 || meteor.y > H + 50) meteor = null;
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      if (!reduceMotion) raf.current = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      draw(performance.now());
    } else {
      raf.current = requestAnimationFrame(draw);
    }

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
  }, [size, stars, arms, speed, opacity, seed, tiltDeg, ellipticity]);

  return (
    <div className="galaxy-wrap" aria-hidden>
      <canvas ref={ref} className="galaxy-canvas" />
    </div>
  );
}