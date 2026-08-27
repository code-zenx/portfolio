"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress, drawn as the header's bottom rule.
 * Writes a CSS var and lets the compositor scale a 1px bar —
 * no React re-render per scroll event.
 */
export function ScrollMeter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty("--progress", String(Math.min(1, Math.max(0, ratio))));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-meter absolute inset-x-0 bottom-[-1px] h-px bg-brand"
    />
  );
}
