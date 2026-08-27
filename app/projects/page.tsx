import type { Metadata } from "next";
import { ProjectIndex } from "@/features/projects/project-index";
import { projectMeta } from "@/features/projects/projects.server";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things built outside work — web apps, npm packages, extensions, and desktop tools.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = projectMeta();

  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1080px] px-5 pb-12 pt-20 md:px-10">
          <p className="label mb-7 flex items-center gap-3">
            Projects
            <span className="h-px flex-1 bg-rule-hair" />
          </p>
          <h1 className="display text-balance text-[length:var(--text-h1)]">
            Built on
            <br />
            my own<span className="italic text-brand">.</span>
          </h1>
          <p className="mt-7 max-w-[54ch] text-lg leading-[1.5] text-ink-2">
            Shipped, not started. Web apps, npm packages, browser extensions,
            desktop tools.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-10">
          <ProjectIndex projects={projects} />
        </div>
      </section>
    </>
  );
}
