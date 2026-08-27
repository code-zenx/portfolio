"use client";

import { useEffect, useState } from "react";

/**
 * False on the server and on the first client render, true after.
 *
 * next-themes can't know the resolved theme during SSR, so anything that
 * branches on it must wait — otherwise the server HTML and the first client
 * render disagree and React throws a hydration mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
