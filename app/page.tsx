import { Hero } from "@/features/home/hero";
import { Work } from "@/features/home/work";
import { Projects } from "@/features/projects/projects-section";
import { Experience } from "@/features/home/experience";
import { Stack } from "@/features/home/stack";
import { Writing } from "@/features/blog/writing-section";
import { Contact } from "@/features/home/contact";
import { postMeta } from "@/features/blog/posts.server";
import { projectMeta } from "@/features/projects/projects.server";

export default function Home() {
  const projects = projectMeta();
  const posts = postMeta();
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <Work posts={posts} />
      {projects.length > 0 ? (
        <Projects
          projects={(featured.length ? featured : projects).slice(0, 4)}
          total={projects.length}
        />
      ) : null}
      <Experience />
      <Stack />
      {posts.length > 0 ? (
        <Writing posts={posts.slice(0, 4)} total={posts.length} />
      ) : null}
      <Contact />
    </>
  );
}
