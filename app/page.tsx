import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";
import { postMeta } from "@/lib/posts";
import { projectMeta } from "@/lib/projects";

export default function Home() {
  const projects = projectMeta();
  const posts = postMeta();
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <Work />
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
