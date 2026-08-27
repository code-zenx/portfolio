import type { ReactNode } from "react";

type Props = {
  id: string;
  /** Small uppercase eyebrow — what this section is. */
  label: string;
  title: string;
  /** Right-aligned figure on the rule. A real count, not a decorative index. */
  count?: string;
  children: ReactNode;
};

/**
 * Full-bleed section. The old version spent a 140px rail plus a 40px gap on
 * a decorative numeral; that gutter is now content width.
 */
export function Section({ id, label, title, count, children }: Props) {
  return (
    <section id={id} className="scroll-mt-[var(--header-h)]">
      <div className="mx-auto max-w-[1080px] px-5 md:px-10">
        <div className="border-t border-rule-hair py-20">
        <div className="sec-head">
          <span className="label">{label}</span>
          {count ? (
            <span className="label tabular-nums">{count}</span>
          ) : null}
        </div>

        <h2 className="h2 mt-5 text-balance text-[length:var(--text-h2)]">
          {title}
        </h2>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
