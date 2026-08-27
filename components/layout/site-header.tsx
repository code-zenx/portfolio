"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/common/icon";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ScrollMeter } from "@/components/layout/scroll-meter";
import { PALETTE_OPEN } from "@/components/command-menu";
import { nav, profile } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6 px-5 py-3 md:px-10">
        <Link
          href="/"
          className="link-rule text-[13px] font-semibold uppercase tracking-[0.1em]"
        >
          {profile.name}
        </Link>

        <nav className="hidden items-baseline gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-rule text-[12px] uppercase tracking-[0.08em] text-ink-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(PALETTE_OPEN))}
            aria-label="Open command menu"
            className="flex h-7 items-center gap-2 border border-rule-hair px-2 text-ink-3 transition-colors hover:border-rule hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Icon name="search" className="h-3.5 w-3.5" />
            <span className="hidden text-[10.5px] tracking-[0.1em] sm:inline">
              ⌘K
            </span>
          </button>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex h-7 w-7 items-center justify-center border border-rule-hair text-ink-3 md:hidden"
            >
              <Icon name="menu" className="h-3.5 w-3.5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-rule bg-background"
            >
              <SheetTitle className="label px-5 pt-5">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col border-t border-rule">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="h2 border-b border-rule-hair px-5 py-4 text-2xl"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ScrollMeter />
    </header>
  );
}
