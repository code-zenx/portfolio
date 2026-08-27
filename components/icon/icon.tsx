"use client";

import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowUpRight,
  LuCheck,
  LuFileText,
  LuGitBranch,
  LuHash,
  LuMail,
  LuMenu,
  LuMonitor,
  LuMoon,
  LuPlus,
  LuSearch,
  LuSun,
  LuX,
} from "react-icons/lu";

/**
 * Static named imports, so the bundler drops the ~1,526 Lucide icons this
 * site doesn't use. Measured: these 15 come to ~1.8 kB gzipped out of a
 * 793 kB module.
 *
 * The kebab-case keys keep call sites readable and give `IconName` its
 * union, so a typo is a compile error rather than a blank space.
 */
const ICONS = {
  "arrow-down": LuArrowDown,
  "arrow-left": LuArrowLeft,
  "arrow-up-right": LuArrowUpRight,
  check: LuCheck,
  "file-text": LuFileText,
  "git-branch": LuGitBranch,
  hash: LuHash,
  mail: LuMail,
  menu: LuMenu,
  monitor: LuMonitor,
  moon: LuMoon,
  plus: LuPlus,
  search: LuSearch,
  sun: LuSun,
  x: LuX,
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  className?: string;
  /** Decorative by default; pass a label when the icon is the only content. */
  label?: string;
};

export function Icon({ name, className, label }: Props) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
