"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import type { ProjectMeta } from "@/lib/project-kinds";

/** cmdk + the dialog are ~15kB of the bundle nobody needs on first paint. */
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

/** Anything can open the palette by firing this — no context provider needed. */
export const PALETTE_OPEN = "palette:open";

export function CommandMenu({
  posts,
  projects,
}: {
  posts: PostMeta[];
  projects: ProjectMeta[];
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setMounted(true);
        setOpen((v) => !v);
      }
    };
    const onOpen = () => {
      setMounted(true);
      setOpen(true);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_OPEN, onOpen);

    // warm the chunk once the browser is otherwise idle
    const canIdle = typeof window.requestIdleCallback === "function";
    const idle = canIdle
      ? window.requestIdleCallback(() => setMounted(true))
      : window.setTimeout(() => setMounted(true), 2000);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_OPEN, onOpen);
      if (canIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  if (!mounted) return null;
  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      posts={posts}
      projects={projects}
    />
  );
}
