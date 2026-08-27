import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { Icon } from "@/components/icon/icon";
import { allProjects, getProject, KIND_LABEL } from "@/features/projects/projects.server";
import { prettyCodeOptions } from "@/lib/mdx";
import { profile } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  const written = allProjects().filter((p) => p.hasBody);
  if (written.length > 0) return written.map((p) => ({ slug: p.slug }));

  // See the note in app/blog/[slug]/page.tsx — same reason.
  return [{ slug: "none" }];
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary || project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary || project.tagline,
      url: `${profile.siteUrl}/projects/${project.slug}`,
      tags: project.tags,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project || !project.hasBody) notFound();

  return (
    <article>
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[1080px] px-5 pb-11 pt-16 md:px-10">
          <Link
            href="/projects"
            className="link-rule mb-9 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink-3"
          >
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            All projects
          </Link>

          <p className="label mb-4">
            {KIND_LABEL[project.kind]}
            {project.status ? ` · ${project.status}` : ""}
          </p>

          <h1 className="display max-w-[20ch] text-balance text-[length:var(--text-h1)]">
            {project.title}
          </h1>
          {project.tagline ? (
            <p className="mt-4 max-w-[54ch] text-lg text-ink-2">{project.tagline}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 border-t border-rule pt-4 text-[12px] uppercase tracking-[0.08em] text-ink-3">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          {project.links.length ? (
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-rule inline-flex items-center gap-1.5 text-brand"
                >
                  {l.label}
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] px-5 py-14 md:px-10">
        <div className="md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-10">
          <div className="mb-8 md:mb-0">
            <span className="label">Write-up</span>
          </div>
          <div className="prose prose-broadsheet min-w-0 max-w-[68ch]">
            <MDXRemote
              source={project.body}
              options={{
                mdxOptions: {
                  rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
                },
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
