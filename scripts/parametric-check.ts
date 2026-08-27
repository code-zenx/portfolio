/**
 * The presets are authored for a full-viewport hero (tall). Our plate is a
 * short 360×270 panel, so the 400×400 space is fitted to the SHORT side and
 * a preset with a large CY offset can drop most of its points off-canvas.
 *
 * This projects every preset at several points in its animation cycle and
 * asserts enough particles actually land in frame.
 *
 *   bun run check:parametric
 */
import {
  PRESETS,
  POINT_COUNT,
  SOURCE_INDICES,
  TIME_SCALE,
  place,
  pointAt,
} from "@/lib/parametric";

const W = 360;
const H = 270;
const SAMPLES = 12;
const SPAN_MS = 24_000;
const MIN_VISIBLE = 0.2;

let failed = 0;

for (const preset of PRESETS) {
  const { scale, originX, originY } = place(preset, W, H);
  const out: [number, number] = [0, 0];

  let worst = 1;
  let worstAt = 0;

  for (let s = 0; s < SAMPLES; s++) {
    const time = ((SPAN_MS / SAMPLES) * s) * TIME_SCALE;
    let visible = 0;

    for (let i = 0; i < POINT_COUNT; i++) {
      pointAt(preset.values, SOURCE_INDICES[i], time, out);

      if (!Number.isFinite(out[0]) || !Number.isFinite(out[1])) {
        throw new Error(`${preset.name}: non-finite point at t=${time}`);
      }

      const x = originX + out[0] * scale;
      const y = originY + (out[1] + preset.offsetY) * scale;
      if (x >= 0 && x <= W && y >= 0 && y <= H) visible++;
    }

    const ratio = visible / POINT_COUNT;
    if (ratio < worst) {
      worst = ratio;
      worstAt = time;
    }
  }

  const ok = worst >= MIN_VISIBLE;
  if (!ok) failed++;

  console.log(
    `${ok ? "ok  " : "FAIL"} ${preset.name.padEnd(9)} ` +
      `zoom ${preset.zoom.toFixed(2)}  offsetY ${String(preset.offsetY).padStart(5)}  ` +
      `worst visible ${(worst * 100).toFixed(1).padStart(5)}% at t=${worstAt.toFixed(2)}`,
  );
}

if (failed) {
  console.error(`\n${failed} preset(s) mostly off-canvas at 360x270`);
  process.exit(1);
}
console.log("\nall presets stay in frame");
