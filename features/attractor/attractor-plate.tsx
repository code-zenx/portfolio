"use client";

import dynamic from "next/dynamic";
import { useMounted } from "@/lib/use-mounted";

// Canvas work never needs to be in the first-paint bundle.
const Attractor = dynamic(
  () => import("@/features/attractor/attractor").then((m) => m.Attractor),
  { ssr: false },
);

/**
 * Hidden below lg — a 270px decorative canvas is the first thing that should
 * go on a phone, and it costs a frame budget those devices need elsewhere.
 */
export function AttractorPlate() {
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="hidden lg:block">
      <Attractor />
    </div>
  );
}
