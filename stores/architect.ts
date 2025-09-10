// stores/architect.ts
import { create } from 'zustand';
import { defaultConfig, defaultNodes, Node, SystemConfig } from '@/lib/cosmos';

type ArchState = {
  nodes: Node[];
  config: SystemConfig;

  // config helpers
  setConfig: (patch: Partial<SystemConfig>) => void;
  setShow: (patch: Partial<SystemConfig['show']>) => void;
  setOrbitVisibility: (orbit: 1 | 2 | 3, visible: boolean) => void;

  // per-orbit tilt helpers
  setOrbitTilts: (patch: Partial<NonNullable<SystemConfig['orbitTilts']>>) => void;
  setOrbitTilt: (orbit: 1 | 2 | 3, tiltDeg: number) => void;

  // node helpers
  setNode: (id: string, patch: Partial<Node>) => void;
  rotateNode: (id: string, deltaDeg: number) => void;

  reset: () => void;
};

// shallow merge for plain objects
function merge<T extends Record<string, any>>(base: T, patch?: Partial<T>): T {
  if (!patch) return base;
  return { ...base, ...patch };
}

// helper: build a *full* `show` object from a partial patch
function buildShow(
  base: SystemConfig['show'],
  patch?: Partial<SystemConfig['show']>
): SystemConfig['show'] {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    orbits: {
      ...base.orbits,
      ...(patch.orbits ?? {}),
    },
  };
}

// deep merge specialized for SystemConfig (so nested fields persist)
function mergeConfig(base: SystemConfig, patch?: Partial<SystemConfig>): SystemConfig {
  if (!patch) return base;

  return {
    ...base,
    // primitives first
    size: patch.size ?? base.size,
    tiltDeg: patch.tiltDeg ?? base.tiltDeg,

    // nested objects — keep existing keys unless overridden
    radii: merge(base.radii, patch.radii),
    speeds: merge(base.speeds, patch.speeds),

    // per-orbit tilts (optional on type; normalize safely)
    orbitTilts: merge(
      base.orbitTilts ?? ({} as NonNullable<SystemConfig['orbitTilts']>),
      patch.orbitTilts
    ),

    // Hardened: always normalize `show` with buildShow
    show: buildShow(base.show, patch.show),
  };
}

export const useArchitect = create<ArchState>((set, get) => ({
  nodes: defaultNodes,
  config: defaultConfig,

  setConfig: (patch) =>
    set({ config: mergeConfig(get().config, patch) }),

  // Make the passed `show` value *complete* so the type matches
  setShow: (patch) =>
    set({
      config: mergeConfig(get().config, {
        show: buildShow(get().config.show, patch),
      }),
    }),

  // Visibility toggle now constructs a full `show` object
  setOrbitVisibility: (orbit, visible) =>
    set({
      config: mergeConfig(get().config, {
        show: buildShow(get().config.show, {
          orbits: { ...get().config.show.orbits, [orbit]: visible },
        }),
      }),
    }),

  // set multiple tilts at once
  setOrbitTilts: (patch) =>
    set({
      config: mergeConfig(get().config, { orbitTilts: patch }),
    }),

  // set a single orbit's tilt
  setOrbitTilt: (orbit, tiltDeg) =>
    set({
      config: mergeConfig(get().config, {
        orbitTilts: { ...((get().config.orbitTilts ?? {}) as Record<1 | 2 | 3, number>), [orbit]: tiltDeg },
      }),
    }),

  setNode: (id, patch) =>
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }),

  rotateNode: (id, delta) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, angle: ((n.angle ?? 0) + delta) % 360 } : n
      ),
    }),

  reset: () => set({ nodes: defaultNodes, config: defaultConfig }),
}));