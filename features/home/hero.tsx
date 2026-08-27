import { facts, profile } from "@/config/site";
import { AttractorPlate } from "@/features/attractor/attractor-plate";

export function Hero() {
  return (
    <section id="top">
      <div className="mx-auto max-w-[1080px] px-5 pb-20 pt-16 md:px-10">
        <p className="label mb-6 flex items-center gap-3.5">
          {profile.role} · {profile.location}
          <span className="h-px flex-1 bg-rule-hair" />
          Available
        </p>

        <div className="grid items-end gap-x-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <h1 className="display text-balance text-[length:var(--text-display)]">
              Siddharth
              <br />
              Rathod<span className="italic text-brand">.</span>
            </h1>

            <p className="mt-7 max-w-[52ch] text-[length:var(--text-lead)] leading-[1.5] text-ink-2">
              {profile.deck}
            </p>
          </div>

          <AttractorPlate />
        </div>

        <dl className="mt-11 grid grid-cols-2 border-t border-rule-hair md:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={[
                "py-6 pr-5",
                // rules sit BETWEEN columns — never trailing off the end
                i % 2 === 1 ? "border-l border-rule-hair pl-5" : "",
                i < 2 ? "border-b border-rule-hair md:border-b-0" : "",
                "md:border-l md:border-rule-hair md:pl-6",
                "md:first:border-l-0 md:first:pl-0",
              ].join(" ")}
            >
              <dd
                className={`m-0 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none tracking-[-0.035em] tabular-nums ${
                  f.accent ? "text-brand" : "text-heading"
                }`}
              >
                {f.value}
              </dd>
              <dt className="label mt-3 leading-relaxed">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
