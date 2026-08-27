"use client";

import { useEffect, useRef } from "react";
import { Motorcycle } from "@/components/motorcycle";

/**
 * Reading progress, drawn as the header's bottom rule with a rider on the
 * leading edge.
 *
 * The bar and the rider both read a single `--progress` custom property set
 * on the container, so they can never disagree. The bar scales (cheap, stays
 * on the compositor); the rider is positioned instead of scaled, because a
 * scaled rider would stretch.
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-6"
    >
      {/* the track the rider travels along — at the top of the page this was
          borrowed from the header's bottom border */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-rule-hair" />
      <span className="scroll-meter absolute inset-x-0 bottom-0 h-px bg-brand" />
      <span className="scroll-rider absolute bottom-px block">
        <Motorcycle className="h-[22px] w-[38px] text-heading" />
      </span>
    </div>
  );
}
