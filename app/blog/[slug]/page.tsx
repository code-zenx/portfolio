import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { Icon } from "@/components/icon/icon";
import { allPosts, getPost } from "@/features/blog/posts.server";
import { prettyCodeOptions } from "@/lib/mdx";
import { longDate } from "@/lib/format";
import { profile } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = allPosts();
  if (posts.length > 0) return posts.map((p) => ({ slug: p.slug }));

  // `output: export` refuses to build a dynamic route with zero params, and
  // right now every post is a draft. This placeholder renders the 404 (the
  // slug matches nothing), and disappears the moment a real post is added.
  return [{ slug: "none" }];
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
      url: `${profile.siteUrl}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <header>
        <div className="mx-auto max-w-[1080px] px-5 pb-11 pt-16 md:px-10">
          <Link
            href="/blog"
            className="link-rule mb-9 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink-3"
          >
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            All writing
          </Link>

          <h1 className="display max-w-[22ch] text-balance text-[length:var(--text-h1)]">
            {post.title}
          </h1>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 border-t border-rule-hair pt-4 text-[12px] uppercase tracking-[0.08em] tabular-nums text-ink-3">
            <time dateTime={post.date}>{longDate(post.date)}</time>
            <span>{post.readingMinutes} min read</span>
            {post.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] px-5 py-14 md:px-10">
        <div className="md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-10">
          <div className="mb-8 md:mb-0">
            <span className="label">Article</span>
          </div>
          <div className="prose prose-broadsheet min-w-0 max-w-[68ch]">
            <MDXRemote
              source={post.body}
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
