import { useEffect, useRef } from 'react';

type GalaxyProps = {
  /** Overall size of the canvas in CSS pixels (it is DPR-scaled internally). */
  size?: number;
  /** Number of stars to render */
  stars?: number;
  /** Number of spiral arms */
  arms?: number;
  /** Rotation speed (radians per second) */
  speed?: number;
  /** Opacity of the whole galaxy layer */
  opacity?: number;
};

export default function Galaxy({
  size = 680,
  stars = 1200,
  arms = 4,
  speed = 0.12,
  opacity = 0.5,
}: GalaxyProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = mm.matches;

    const cssSize = size;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;

    // Precompute star positions in galaxy coordinates (r,theta) with some noise.
    // Logarithmic spiral: r = a * e^(b * theta)
    const a = 2.0;
    const b = 0.20; // bigger b => tighter spiral
    const rng = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(1337);

    const starsBuf: { x: number; y: number; r: number; hue: number }[] = [];
    for (let i = 0; i < stars; i++) {
      const armIndex = i % arms;
      const t = (i / stars) * (Math.PI * 6) + armIndex * ((Math.PI * 2) / arms);
      const radius = a * Math.exp(b * t) + (rng() - 0.5) * 6; // spiral + jitter
      const theta = t + (rng() - 0.5) * 0.25; // wiggle along the arm

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      // radius falloff: more + brighter stars near core
      const coreBias = Math.max(0, 1 - radius / (cssSize * 0.45));
      const rPix = (0.6 + rng() * 1.8 + coreBias * 1.6) * dpr;

      // aurora-ish hues: emerald→cyan→magenta
      const hue = 150 + (theta * 35 + armIndex * 20) % 180;

      starsBuf.push({ x, y, r: rPix, hue });
    }

    let t0 = performance.now();
    const draw = (now: number) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      // Clear with gentle vignette
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.min(CX, CY));
      grd.addColorStop(0, 'rgba(255,255,255,0.02)');
      grd.addColorStop(1, 'rgba(0,0,0,0.0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const angle = reduceMotion ? 0 : (now * 0.001 * speed);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      ctx.globalAlpha = opacity;
      for (let i = 0; i < starsBuf.length; i++) {
        const s = starsBuf[i];
        // rotate around center
        const rx = s.x * cosA - s.y * sinA;
        const ry = s.x * sinA + s.y * cosA;

        const px = CX + rx * dpr;
        const py = CY + ry * dpr;

        // star glow
        const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3.6);
        g.addColorStop(0, `hsla(${s.hue}, 90%, 92%, 0.95)`);
        g.addColorStop(0.15, `hsla(${s.hue}, 95%, 70%, 0.45)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // crisp core
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.7, s.r * 0.55), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
  }, [size, stars, arms, speed, opacity]);

  return (
    <div className="galaxy-wrap" aria-hidden>
      <canvas ref={ref} className="galaxy-canvas" />
    </div>
  );
}