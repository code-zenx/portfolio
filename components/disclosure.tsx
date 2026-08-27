"use client";

import { Icon } from "@/components/icon/icon";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onToggle: () => void;
  /** Always-visible row content. */
  summary: ReactNode;
  /** Revealed on expand. */
  children: ReactNode;
  label: string;
};

/**
 * A ruled row that expands in place.
 *
 * Height animates via grid-template-rows 0fr→1fr, so there is no
 * measuring pass and no layout thrash on open.
 */
export function Disclosure({ open, onToggle, summary, children, label }: Props) {
  return (
    <div
      data-open={open}
      className="group border-b border-rule-hair transition-colors duration-300 data-[open=true]:shadow-[inset_2px_0_0_var(--brand)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
        data-open={open}
        className="flex w-full cursor-pointer items-start gap-8 py-6 pl-0 pr-1 text-left transition-[padding] duration-200 hover:bg-brand-wash hover:pl-3 data-[open=true]:pl-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="min-w-0 flex-1">{summary}</span>
        <Icon
          name="plus"
          className="mt-[0.35rem] h-3.5 w-3.5 shrink-0 text-ink-3 transition-transform duration-300 group-hover:text-heading group-data-[open=true]:rotate-45 group-data-[open=true]:text-heading"
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out data-[open=true]:grid-rows-[1fr] grid-rows-[0fr]"
        data-open={open}
      >
        <div className="overflow-hidden">
          <div className="pb-7 pr-1 transition-[padding] duration-200 group-data-[open=true]:pl-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
