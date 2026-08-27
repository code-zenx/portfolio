"use client";

import { Icon as Iconify, addCollection } from "@iconify/react/offline";
import { lucideSubset, type IconName } from "@/lib/icons.generated";

// Registered once per bundle. The `/offline` entry has no API client in it,
// so nothing is ever fetched from iconify.design at runtime.
addCollection(lucideSubset);

type Props = {
  name: IconName;
  className?: string;
  /** Decorative by default; pass a label when the icon is the only content. */
  label?: string;
};

export function Icon({ name, className, label }: Props) {
  return (
    <Iconify
      icon={`lucide:${name}`}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
