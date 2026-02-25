// components/home/Galaxy.tsx
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
  meteors?: boolean;
  pauseWhenHidden?: boolean;
  hue?: number;
  coreGlow?: number;
  nebulaIntensity?: number;
  reverseDir?: boolean;
  trails?: boolean;
  blackHole?: boolean;
  pulse?: boolean;
  colorDrift?: boolean;
  novaRate?: number;
  supernovaRef?: React.MutableRefObject<(() => void) | null>;
  warpRef?: React.MutableRefObject<(() => void) | null>;
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
  meteors = true,
  pauseWhenHidden = true,
  hue = 0,
  coreGlow = 1.0,
  nebulaIntensity = 1.0,
  reverseDir = false,
  trails = false,
  blackHole = false,
  pulse = false,
  colorDrift = false,
  novaRate = 0,
  supernovaRef,
  warpRef,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!size || size < 200) {
      const ctx0 = canvas.getContext('2d');
      if (ctx0) ctx0.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = mm.matches;

    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width  = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);

    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const RMAX = Math.min(CX, CY) * 0.92; // physical canvas pixels

    let s = Math.max(1, Math.floor(seed)) % 2147483647;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    // Spiral parameters (galaxy-coordinate units)
    const SPIRAL_A = 2.0;
    const SPIRAL_B = 0.20;

    // Maximum radius the spiral arms reach in galactic units
    const maxGalacticR = SPIRAL_A * Math.exp(SPIRAL_B * Math.PI * 6.2); // ≈ 98.6

    // Scale factor: maps 1 galactic unit → physical canvas pixels.
    // Targets 86% of RMAX so arms fill the visible circle without clipping.
    const GSCALE = RMAX * 0.86 / maxGalacticR;

    // Galaxy → screen: applies tilt, ellipticity, and the proper scale.
    const tilt = (tiltDeg * Math.PI) / 180;
    const ct = Math.cos(tilt), sinT = Math.sin(tilt);
    const toScreen = (gx: number, gy: number): readonly [number, number] => {
      const ex = gx;
      const ey = gy * ellipticity;
      const tx = ex * ct - ey * sinT;
      const ty = ex * sinT + ey * ct;
      return [CX + tx * GSCALE, CY + ty * GSCALE];
    };

    // Arm angular separation
    const armSep = (Math.PI * 2) / arms;

    type Star = { x: number; y: number; r: number; hue: number; tw: number; rad: number; halo: number };
    const starsBuf: Star[] = [];
    for (let i = 0; i < stars; i++) {
      const armIdx = i % arms;
      const t = (i / stars) * (Math.PI * 6.2) + armIdx * armSep;
      // Radius scatter proportional to spiral spacing; angle scatter proportional to arm separation
      const radius = SPIRAL_A * Math.exp(SPIRAL_B * t) + (rnd() - 0.5) * maxGalacticR * 0.035;
      const theta  = t + (rnd() - 0.5) * armSep * 0.28;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      // nearCore: 1 at center, 0 at 55% of max radius — properly normalised
      const nearCore = Math.max(0, 1 - radius / (maxGalacticR * 0.55));
      const base = rnd();
      const rPix = (base < 0.75 ? 0.6 + base * 1.2 : 1.2 + base * 2.3) + nearCore * 1.4;
      const starHue = 150 + (theta * 36 + armIdx * 22 + rnd() * 12) % 200;
      const halo = 2.8 + rnd() * 2.2;
      starsBuf.push({ x, y, r: rPix * dpr, hue: starHue, tw: rnd() * Math.PI * 2, rad: Math.hypot(x, y), halo });
    }

    type Cloud = { x: number; y: number; rx: number; ry: number; hue: number; a: number };
    const clouds: Cloud[] = [];
    const cloudCount = 16;
    for (let i = 0; i < cloudCount; i++) {
      const armIdx = i % arms;
      const t = (i / cloudCount) * (Math.PI * 6) + armIdx * armSep;
      const radius = (SPIRAL_A * Math.exp(SPIRAL_B * t)) * (0.85 + rnd() * 0.28);
      const theta  = t + (rnd() - 0.5) * armSep * 0.22;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      // Cloud visual size in physical canvas pixels (GSCALE converts galactic units)
      const rx = (6 + rnd() * 8) * GSCALE;
      const ry = rx * (0.6 + rnd() * 0.28);
      const cloudHue = 150 + (armIdx * 28 + i * 7) % 210;
      const a = 0.12 + rnd() * 0.12;
      clouds.push({ x, y, rx, ry, hue: cloudHue, a });
    }

    // Dust: stored as physical canvas pixels so they stay independent of GSCALE
    const dust: { px: number; py: number; r: number; a: number }[] = Array.from({ length: 330 }, () => ({
      px: CX + (rnd() - 0.5) * W * 0.94,
      py: CY + (rnd() - 0.5) * H * 0.94,
      r: (0.3 + rnd() * 0.9) * dpr,
      a: 0.03 + rnd() * 0.05,
    }));

    type Meteor = { x: number; y: number; vx: number; vy: number; life: number };
    let meteor: Meteor | null = null;
    let nextMeteorAt = performance.now() + 2000 + rnd() * 3000;
    const spawnMeteor = () => {
      const ang = (Math.PI * 0.15) + rnd() * 0.2;
      const sp  = 300 * dpr;
      const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp;
      const r0 = RMAX * (0.6 + rnd() * 0.6);
      const a0 = Math.PI * 1.2 + rnd() * 0.4;
      meteor = { x: CX - Math.cos(a0) * r0, y: CY - Math.sin(a0) * r0, vx, vy, life: 0 };
    };

    let supernovaT = 0;
    let lastAutoNova = performance.now();
    let warpTimer = 0;
    const WARP_DURATION = 3.0;

    if (supernovaRef) supernovaRef.current = () => { supernovaT = 0.001; };
    if (warpRef)      warpRef.current      = () => { warpTimer = WARP_DURATION; };

    let tPrev = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - tPrev) / 1000);
      tPrev = now;

      // Warp speed boost
      let effectiveSpeed = speed;
      if (warpTimer > 0) {
        warpTimer = Math.max(0, warpTimer - dt);
        effectiveSpeed = speed + speed * 12 * (warpTimer / WARP_DURATION);
      }

      // Color drift: continuously rotate hue
      const effectiveHue = colorDrift ? (hue + now * 0.01) % 360 : hue;

      // Pulse: core glow oscillates
      const effectiveCoreGlow = pulse
        ? coreGlow * (0.5 + 0.8 * Math.abs(Math.sin(now * 0.0018)))
        : coreGlow;

      // Auto-nova
      if (novaRate > 0 && !reduceMotion && supernovaT === 0) {
        if (now - lastAutoNova > 60000 / novaRate) {
          supernovaT = 0.001;
          lastAutoNova = now;
        }
      }

      const dir        = reverseDir ? 1 : -1;
      const baseAngle  = reduceMotion ? 0 : now * 0.001 * effectiveSpeed * dir;

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      // Vignette (soft centre glow)
      const vig = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 1.1);
      vig.addColorStop(0, 'rgba(255,255,255,0.015)');
      vig.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Core bloom
      const coreH  = (200 + effectiveHue) % 360;
      const coreH2 = (150 + effectiveHue) % 360;
      const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 0.52);
      core.addColorStop(0.00, `rgba(255,255,255,${0.12 * effectiveCoreGlow})`);
      core.addColorStop(0.35, `hsla(${coreH2},80%,75%,${0.10 * effectiveCoreGlow})`);
      core.addColorStop(0.85, `hsla(${coreH},70%,65%,${0.04 * effectiveCoreGlow})`);
      core.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      // Nebula clouds — alpha driven directly by nebulaIntensity
      ctx.globalAlpha = 1;
      for (const c of clouds) {
        // Differential rotation: inner clouds orbit faster (properly normalised)
        const diff = 1 + 0.18 * (1 - Math.hypot(c.x, c.y) / maxGalacticR);
        const ax = c.x * Math.cos(baseAngle * diff) - c.y * Math.sin(baseAngle * diff);
        const ay = c.x * Math.sin(baseAngle * diff) + c.y * Math.cos(baseAngle * diff);
        const [px, py] = toScreen(ax, ay);
        const shiftedHue  = (c.hue + effectiveHue) % 360;
        const cloudAlpha  = Math.min(0.92, c.a * nebulaIntensity * 3.0);
        if (cloudAlpha <= 0) continue;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, Math.max(c.rx, c.ry) * 1.8);
        grad.addColorStop(0, `hsla(${shiftedHue}, 92%, 60%, ${cloudAlpha})`);
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

      // Dust (physical pixel positions, no GSCALE involved)
      ctx.globalCompositeOperation = 'source-over';
      for (const d of dust) {
        ctx.globalAlpha = d.a;
        ctx.fillStyle = 'rgba(180,200,255,1)';
        ctx.beginPath(); ctx.arc(d.px, d.py, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Stars — lighter composite for additive glow
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = opacity;
      for (const st2 of starsBuf) {
        // Differential rotation: properly normalised so inner stars are noticeably faster
        const diff = 1 + 0.22 * (1 - st2.rad / maxGalacticR);
        const ax = st2.x * Math.cos(baseAngle * diff) - st2.y * Math.sin(baseAngle * diff);
        const ay = st2.x * Math.sin(baseAngle * diff) + st2.y * Math.cos(baseAngle * diff);
        const [px, py] = toScreen(ax, ay);

        let coreR: number, tw: number;
        if (warpTimer > 0 && !reduceMotion) {
          const wf = warpTimer / WARP_DURATION;
          tw = 1 + wf * 0.6;
          coreR = Math.max(0.6, st2.r * 0.55) * tw;
          // Warp streak: length in physical pixels (st2.rad * GSCALE converts galactic → physical)
          const streakLen = st2.rad * GSCALE * wf * 0.08;
          const trailX = px - Math.cos(baseAngle + Math.PI / 2) * streakLen * dir * -1;
          const trailY = py - Math.sin(baseAngle + Math.PI / 2) * streakLen * dir * -1;
          const streak = ctx.createLinearGradient(px, py, trailX, trailY);
          const shH2 = (st2.hue + effectiveHue) % 360;
          streak.addColorStop(0, `hsla(${shH2}, 96%, 92%, ${0.7 * wf * opacity})`);
          streak.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.strokeStyle = streak;
          ctx.lineWidth = coreR * 0.7;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(trailX, trailY); ctx.stroke();
        } else {
          tw    = 0.86 + 0.18 * Math.sin(now * 0.0011 + st2.tw);
          coreR = Math.max(0.6, st2.r * 0.55) * tw;
        }

        // Star trails: comet streak in the direction the star came from
        if (trails && !reduceMotion) {
          const dx = px - CX, dy = py - CY;
          const dist = Math.hypot(dx, dy) || 1;
          const tangX = -dy / dist;
          const tangY =  dx / dist;
          const trailMult = dir === -1 ? 1 : -1;
          const tLen = dist * 0.22 * Math.min(1, effectiveSpeed * 8);
          const shH3 = (st2.hue + effectiveHue) % 360;
          const tg = ctx.createLinearGradient(px, py, px + tangX * trailMult * tLen, py + tangY * trailMult * tLen);
          tg.addColorStop(0, `hsla(${shH3}, 90%, 85%, ${opacity * 0.6})`);
          tg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.strokeStyle = tg;
          ctx.lineWidth = coreR;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + tangX * trailMult * tLen, py + tangY * trailMult * tLen);
          ctx.stroke();
        }

        const shiftedHue = (st2.hue + effectiveHue) % 360;
        const g = ctx.createRadialGradient(px, py, 0, px, py, st2.r * (3.6 + st2.halo));
        g.addColorStop(0.00, `hsla(${shiftedHue}, 96%, 92%, ${0.92 * tw})`);
        g.addColorStop(0.20, `hsla(${shiftedHue}, 96%, 70%, ${0.46 * tw})`);
        g.addColorStop(1.00, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, st2.r * (3.6 + st2.halo), 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.94)';
        ctx.beginPath(); ctx.arc(px, py, coreR, 0, Math.PI * 2); ctx.fill();
      }

      // Black hole
      if (blackHole && !reduceMotion) {
        const bhR   = RMAX * 0.065;
        const bhH   = (effectiveHue + 30) % 360;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1;
        const disk = ctx.createRadialGradient(CX, CY, bhR * 0.9, CX, CY, bhR * 3.5);
        disk.addColorStop(0,   `hsla(${bhH}, 95%, 90%, 0.80)`);
        disk.addColorStop(0.3, `hsla(${(bhH + 20) % 360}, 90%, 70%, 0.45)`);
        disk.addColorStop(0.7, `hsla(${(bhH + 40) % 360}, 80%, 50%, 0.15)`);
        disk.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = disk;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        const hole = ctx.createRadialGradient(CX, CY, 0, CX, CY, bhR);
        hole.addColorStop(0,   'rgba(0,0,0,1)');
        hole.addColorStop(0.7, 'rgba(0,0,0,0.95)');
        hole.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = hole;
        ctx.beginPath(); ctx.arc(CX, CY, bhR, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      // Meteor
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (!reduceMotion && meteors) {
        if (!meteor && now > nextMeteorAt) {
          spawnMeteor();
          nextMeteorAt = now + 3000 + rnd() * 4000;
        }
        if (meteor) {
          meteor.life += dt;
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;
          const trail = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.vx * 0.18, meteor.y - meteor.vy * 0.18,
          );
          trail.addColorStop(0,   'rgba(255,255,255,0.98)');
          trail.addColorStop(0.6, 'rgba(180,210,255,0.50)');
          trail.addColorStop(1,   'rgba(96,165,250,0.00)');
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2.5 * dpr;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * 0.18, meteor.y - meteor.vy * 0.18);
          ctx.stroke();
          const head = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 7 * dpr);
          head.addColorStop(0,   'rgba(255,255,255,1.0)');
          head.addColorStop(0.4, 'rgba(200,230,255,0.7)');
          head.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = head;
          ctx.beginPath(); ctx.arc(meteor.x, meteor.y, 7 * dpr, 0, Math.PI * 2); ctx.fill();
          if (meteor.life > 1.8 || meteor.x > W + 50 || meteor.y > H + 50) meteor = null;
        }
      } else {
        meteor = null;
      }

      // Warp radial spokes — stroke lines from centre (no fillRect square artifacts)
      if (warpTimer > 0 && !reduceMotion) {
        const wf = warpTimer / WARP_DURATION;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 1;
        const warpHue = (effectiveHue + 200) % 360;
        for (let i = 0; i < 16; i++) {
          const ang  = (i / 16) * Math.PI * 2 + now * 0.003 * effectiveSpeed;
          const endX = CX + Math.cos(ang) * RMAX * 1.05;
          const endY = CY + Math.sin(ang) * RMAX * 1.05;
          const wg   = ctx.createLinearGradient(CX, CY, endX, endY);
          wg.addColorStop(0,   `hsla(${warpHue}, 90%, 95%, ${wf * 0.85})`);
          wg.addColorStop(0.4, `hsla(${warpHue}, 80%, 70%, ${wf * 0.40})`);
          wg.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.strokeStyle = wg;
          ctx.lineWidth = RMAX * 0.022;
          ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(endX, endY); ctx.stroke();
        }
        ctx.restore();
      }

      // Supernova
      if (supernovaT > 0 && !reduceMotion) {
        supernovaT += dt;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        if (supernovaT < 0.5) {
          const flashA = Math.max(0, (0.5 - supernovaT) / 0.5);
          const flash  = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 0.5);
          flash.addColorStop(0,   `rgba(255,255,240,${flashA * 0.95})`);
          flash.addColorStop(0.3, `rgba(255,220,120,${flashA * 0.60})`);
          flash.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = flash; ctx.fillRect(0, 0, W, H);
        }

        if (supernovaT > 0.05 && supernovaT < 2.4) {
          const t2    = Math.max(0, (supernovaT - 0.05) / 2.35);
          const ringR = RMAX * (0.05 + t2 * 1.4);
          const ringW = RMAX * (0.06 + t2 * 0.04);
          const ringA = Math.max(0, (1 - t2 * 1.1) * 0.65);
          const nH    = (40 + effectiveHue) % 360;
          const ring  = ctx.createRadialGradient(CX, CY, Math.max(0, ringR - ringW), CX, CY, ringR + ringW);
          ring.addColorStop(0,   'rgba(255,255,255,0)');
          ring.addColorStop(0.4, `hsla(${nH},95%,85%,${ringA})`);
          ring.addColorStop(0.7, `hsla(${(nH + 30) % 360},90%,70%,${ringA * 0.5})`);
          ring.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = ring; ctx.fillRect(0, 0, W, H);
        }

        if (supernovaT > 1.2 && supernovaT < 3.5) {
          const t3    = (supernovaT - 1.2) / 2.3;
          const glowA = Math.max(0, (1 - t3) * 0.18);
          const lH    = (40 + effectiveHue) % 360;
          const glow  = ctx.createRadialGradient(CX, CY, 0, CX, CY, RMAX * 0.8);
          glow.addColorStop(0,   `hsla(${lH},90%,85%,${glowA})`);
          glow.addColorStop(0.6, `hsla(${(lH + 40) % 360},80%,65%,${glowA * 0.4})`);
          glow.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
        }

        ctx.restore();
        if (supernovaT > 4.0) supernovaT = 0;
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (!reduceMotion) raf.current = requestAnimationFrame(draw);
    };

    const stopRAF  = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; } };
    const startRAF = () => { if (!raf.current) raf.current = requestAnimationFrame(draw); };

    const onVisibility = () => {
      if (!pauseWhenHidden) return;
      if (document.visibilityState === 'hidden') stopRAF();
      else if (!reduceMotion) { tPrev = performance.now(); startRAF(); }
    };

    const onPrefersChanged = () => {
      if (mm.matches) { stopRAF(); draw(performance.now()); }
      else startRAF();
    };

    if (reduceMotion) {
      draw(performance.now());
    } else if (!pauseWhenHidden || document.visibilityState === 'visible') {
      raf.current = requestAnimationFrame(draw);
    }

    if (pauseWhenHidden) document.addEventListener('visibilitychange', onVisibility);
    mm.addEventListener?.('change', onPrefersChanged);

    return () => {
      stopRAF();
      if (supernovaRef) supernovaRef.current = null;
      if (warpRef)      warpRef.current      = null;
      if (pauseWhenHidden) document.removeEventListener('visibilitychange', onVisibility);
      mm.removeEventListener?.('change', onPrefersChanged);
    };
  }, [size, stars, arms, speed, opacity, seed, tiltDeg, ellipticity, meteors, pauseWhenHidden,
      hue, coreGlow, nebulaIntensity, reverseDir, trails, blackHole, pulse, colorDrift, novaRate]);

  return (
    <div className="galaxy-wrap" aria-hidden>
      <canvas ref={canvasRef} className="galaxy-canvas" />
    </div>
  );
}
