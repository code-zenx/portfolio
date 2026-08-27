/**
 * Parametric particle field — the six presets from the Omarchy Plugins hero.
 *
 * Pure math, no DOM, so the canvas component and parametric.check.ts
 * run exactly the same code.
 */

export type Values = {
  AMP: number;
  WIND: number;
  VS: number;
  VO: number;
  QA: number;
  QF: number;
  SP: number;
  TH: number;
  ORB: number;
  YS: number;
  PD: number;
  PSP: number;
  WV: number;
  WSP: number;
  DOF: number;
  RF: number;
  DPH: number;
  CX: number;
  CY: number;
  DENS: number;
};

export type Preset = {
  name: string;
  zoom: number;
  offsetY: number;
  values: Values;
};

const base: Values = {
  AMP: 4,
  WIND: 35,
  VS: 7,
  VO: 13,
  QA: 2,
  QF: 3,
  SP: 35,
  TH: 9,
  ORB: 40,
  YS: 35,
  PD: 9,
  PSP: 2,
  WV: 9,
  WSP: 2,
  DOF: 4,
  RF: 9,
  DPH: 2,
  CX: 200,
  CY: 0,
  DENS: 235,
};

type PresetSpec = {
  name: string;
  zoom: number;
  offsetY?: number;
  values: Partial<Values>;
};

const SPECS: PresetSpec[] = [
  { name: "ORIGINAL", zoom: 1.08, offsetY: -45, values: {} },
  {
    name: "COCOON",
    zoom: 1.04,
    offsetY: -105,
    values: { WIND: 14.5, AMP: 2.6, TH: 14.2, SP: 70, ORB: 22, YS: 52, RF: 4.2, DENS: 150 },
  },
  {
    name: "STORM",
    zoom: 0.92,
    values: { PD: 2.4, PSP: 4.2, WV: 2.8, RF: 19, DPH: -3.4, WIND: 48, DENS: 110 },
  },
  {
    name: "RAY",
    zoom: 1.18,
    values: {
      AMP: 8.69, WIND: 38.26, VS: 16.38, VO: 11.75, QA: 1.65, QF: 3.47,
      SP: 38.62, TH: 9.63, ORB: 47.63, YS: 7.34, PD: 10.77, PSP: 2.73,
      WV: 7.21, WSP: 3.79, DOF: 5.98, RF: 3.04, DPH: 3.18, CX: 201, CY: 161,
    },
  },
  {
    name: "BIRD",
    zoom: 1.08,
    values: {
      AMP: 9.07, WIND: 73.68, VS: 15.45, VO: 25.38, QA: 4.98, QF: 5.32,
      SP: 44.61, TH: 9.37, ORB: 16.84, YS: 21.85, PD: 12.64, PSP: 3.52,
      WV: 10.31, WSP: 2, DOF: 3.3, RF: 10.2, DPH: 2.76, CX: 200, CY: -261,
    },
  },
  {
    name: "WING",
    zoom: 1.18,
    values: {
      AMP: 7.18, WIND: 47.39, VS: 16.24, VO: 28.23, QA: 3.58, QF: 5.84,
      SP: 38.57, TH: 12.2, ORB: 25.09, YS: 10.8, PD: 15.4, PSP: 3.23,
      WV: 12.94, WSP: 1.19, DOF: 8.59, RF: 10.94, DPH: 0.79, CX: 205, CY: -5,
    },
  },
];

export const PRESETS: Preset[] = SPECS.map((spec) => ({
  name: spec.name,
  zoom: spec.zoom,
  offsetY: spec.offsetY ?? 0,
  values: { ...base, ...spec.values },
}));

export const POINT_COUNT = 3600;
const SOURCE_POINT_COUNT = 6000;

/** Precomputed source indices — the field samples 6000 across 3600 points. */
export const SOURCE_INDICES = Float32Array.from(
  { length: POINT_COUNT },
  (_, i) => i * (SOURCE_POINT_COUNT / POINT_COUNT),
);

/** The mathematical space every preset is authored in. */
export const SPACE = 400;

/** Milliseconds → the field's time unit. */
export const TIME_SCALE = 0.00105;

/**
 * One point of the field, in the 400×400 authoring space.
 * Writes into `out` so the hot loop allocates nothing.
 */
export function pointAt(
  v: Values,
  sourceIndex: number,
  time: number,
  out: [number, number],
) {
  const y = sourceIndex / v.DENS;

  const k =
    (v.AMP + Math.cos(sourceIndex / v.PD - time * v.PSP)) *
    Math.cos(sourceIndex / v.WIND);

  const e = y / v.VS - v.VO;

  const distance =
    Math.hypot(k, e) + Math.sin(e / v.WV + time / v.WSP) - v.DOF;

  const q =
    v.QA * Math.sin(k * v.QF) -
    ((y / v.SP) *
      k *
      (v.TH + k * Math.sin(Math.cos(e) * v.RF - distance * v.DPH + time)));

  const angle = distance - time;

  out[0] = q + v.ORB * Math.cos(angle) + v.CX;
  out[1] = q * Math.sin(angle) + distance * v.YS + v.CY;
}

export type Placement = { scale: number; originX: number; originY: number };

/** Fits the 400×400 space into the canvas, matching the reference. */
export function place(preset: Preset, w: number, h: number): Placement {
  const scale = Math.min(w / SPACE, h / SPACE) * preset.zoom;
  return {
    scale,
    originX: (w - SPACE * scale) / 2,
    originY: (h - SPACE * scale) / 2,
  };
}
