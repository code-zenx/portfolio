"use client";

import { useTheme } from "next-themes";
import { Icon } from "@/components/icon/icon";
import { useMounted } from "@/lib/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // Before mount the resolved theme is unknown, so render a fixed label and
  // icon. Branching here is what caused the hydration mismatch.
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (dark ? "Switch to light" : "Switch to dark") : "Switch color theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-7 w-7 items-center justify-center border border-rule-hair text-ink-3 transition-colors hover:border-rule hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Icon name={dark ? "sun" : "moon"} className="h-3.5 w-3.5" />
    </button>
  );
}
