"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  POINT_COUNT,
  PRESETS,
  SOURCE_INDICES,
  TIME_SCALE,
  place,
  pointAt,
} from "@/features/attractor/parametric";

/**
 * Parametric particle field. Six presets, click to cycle.
 *
 * Every frame clears and redraws all 3600 particles from the field equation —
 * there is no accumulation buffer, which is what makes the form actually move
 * rather than settle.
 */

function readColor(el: Element, prop: string, fallback: string) {
  const raw = getComputedStyle(el).getPropertyValue(prop).trim();
  return /^#[0-9a-f]{3,8}$/i.test(raw) ? raw : fallback;
}

export function Attractor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(3); // start on RAY, as the reference does

  const preset = PRESETS[index];
  const cycle = useCallback(() => setIndex((i) => (i + 1) % PRESETS.length), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ink = readColor(host, "--heading", "#d7d7d9");
    let accent = readColor(host, "--brand", "#ff5a36");

    let frame = 0;
    let running = !document.hidden;
    let w = 0;
    let h = 0;
    let startedAt = 0;
    const point: [number, number] = [0, 0];

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      const time = (now - startedAt) * TIME_SCALE;
      const { scale, originX, originY } = place(preset, w, h);
      const v = preset.values;

      for (let i = POINT_COUNT; i--; ) {
        pointAt(v, SOURCE_INDICES[i], time, point);

        const x = originX + point[0] * scale;
        const y = originY + (point[1] + preset.offsetY) * scale;
        if (x < 0 || x > w || y < 0 || y > h) continue;

        ctx.globalAlpha = i % 13 === 0 ? 0.48 : 0.27;
        ctx.fillStyle = i % 19 === 0 ? accent : ink;
        const size = i % 29 === 0 ? 1.3 : 0.8;
        ctx.fillRect(x, y, size, size);
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = 0;
      if (!running) return;
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      resize();
      // Draw one frame synchronously. resize() clears the canvas and rAF does
      // not run in a hidden or throttled tab, so without this the panel can
      // sit empty indefinitely.
      startedAt = performance.now();
      draw(startedAt);
      if (reduced) return;
      frame = requestAnimationFrame(loop);
    };

    start();

    /*
     * Colours come from the DOM, not from useTheme(): this effect belongs to
     * a child of ThemeProvider and React runs child effects before parent
     * ones, so on a toggle it would read the outgoing palette.
     */
    const themeObserver = new MutationObserver(() => {
      ink = readColor(host, "--heading", "#d7d7d9");
      accent = readColor(host, "--brand", "#ff5a36");
      // Repaint now. Under prefers-reduced-motion there is no loop to pick
      // the new colours up, and a throttled tab would keep showing the old
      // theme's particles — near-white ink on paper reads as blank.
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    // Don't burn frames on a panel nobody can see.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden;
      if (running && !frame && !reduced) frame = requestAnimationFrame(loop);
      else if (!running) stop();
    });
    io.observe(host);

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !frame && !reduced) frame = requestAnimationFrame(loop);
      else if (!running) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stop();
        start();
      }, 180);
    });
    ro.observe(host);

    return () => {
      running = false;
      stop();
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [preset]);

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${preset.name} field. Activate for the next one.`}
      className="group relative block h-[270px] w-full cursor-pointer overflow-hidden bg-transparent text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <canvas ref={canvasRef} className="block h-full w-full opacity-[0.84]" />

      {/* preset rail — the tick marks which of the six is showing, so the
          position reads at a glance without parsing the counter */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-7 left-1 top-7 w-px bg-ink-3/40"
      >
        <span
          className="absolute -left-[3px] block h-px w-[7px] bg-brand transition-[top] duration-300 ease-out"
          style={{ top: `${(index / (PRESETS.length - 1)) * 100}%` }}
        />
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 right-[7px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand tabular-nums"
      >
        {preset.name} {String(index + 1).padStart(2, "0")}/
        {String(PRESETS.length).padStart(2, "0")}
      </span>

      <span className="pointer-events-none absolute bottom-1 left-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        Click to change
      </span>
    </button>
  );
}
