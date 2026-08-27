import Link from "next/link";
import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { ProjectRow } from "@/components/sections/project-index";
import type { ProjectMeta } from "@/lib/project-kinds";

export function Projects({
  projects,
  total,
}: {
  projects: ProjectMeta[];
  total: number;
}) {
  return (
    <Section
      id="projects"
      label="Built on my own"
      title="Shipped, not started"
      count={String(total).padStart(2, "0")}
    >
      <div className="border-t border-rule-hair">
        {projects.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}
      </div>

      <Link
        href="/projects"
        className="link-rule mt-6 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-2"
      >
        {total > projects.length ? `All ${total} projects` : "All projects"}
        <Icon name="arrow-up-right" className="h-3 w-3" />
      </Link>
    </Section>
  );
}
