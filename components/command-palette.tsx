"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Icon } from "@/components/common/icon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { PostMeta } from "@/lib/posts";
import { KIND_LABEL, type ProjectMeta } from "@/lib/project-kinds";
import { nav, profile } from "@/lib/site";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: PostMeta[];
  projects: ProjectMeta[];
};

export function CommandPalette({ open, onOpenChange, posts, projects }: Props) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command menu"
      description="Jump to a section, a post, or a link"
    >
      <CommandInput placeholder="Jump to…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {nav.map((item) => (
            <CommandItem
              key={item.href}
              value={`go ${item.label}`}
              onSelect={() => run(() => router.push(item.href))}
            >
              <Icon name="hash" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {projects.length ? (
          <CommandGroup heading="Projects">
            {projects.map((p) => (
              <CommandItem
                key={p.slug}
                value={`project ${p.title} ${p.kind} ${p.tags.join(" ")}`}
                onSelect={() =>
                  run(() =>
                    p.hasBody
                      ? router.push(`/projects/${p.slug}`)
                      : p.links[0]
                        ? window.open(p.links[0].href, "_blank")
                        : router.push("/projects"),
                  )
                }
              >
                <Icon name="git-branch" />
                <span className="truncate">{p.title}</span>
                <span className="ml-auto text-[11px] text-ink-3">
                  {KIND_LABEL[p.kind]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {posts.length ? (
          <CommandGroup heading="Writing">
            {posts.map((p) => (
              <CommandItem
                key={p.slug}
                value={`post ${p.title} ${p.tags.join(" ")}`}
                onSelect={() => run(() => router.push(`/blog/${p.slug}`))}
              >
                <Icon name="file-text" />
                <span className="truncate">{p.title}</span>
                <span className="ml-auto text-[11px] tabular-nums text-ink-3">
                  {p.readingMinutes} min
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        <CommandGroup heading="Theme">
          <CommandItem value="theme light" onSelect={() => run(() => setTheme("light"))}>
            <Icon name="sun" />
            Light
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => run(() => setTheme("dark"))}>
            <Icon name="moon" />
            Dark
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => run(() => setTheme("system"))}>
            <Icon name="monitor" />
            System
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Elsewhere">
          <CommandItem
            value="email contact"
            onSelect={() => run(() => window.open(`mailto:${profile.email}`))}
          >
            <Icon name="mail" />
            {profile.email}
          </CommandItem>
          <CommandItem
            value="github code"
            onSelect={() => run(() => window.open(profile.github, "_blank"))}
          >
            <Icon name="git-branch" />
            GitHub
            <Icon name="arrow-up-right" className="ml-auto size-3.5" />
          </CommandItem>
          <CommandItem
            value="resume cv pdf"
            onSelect={() => run(() => window.open(profile.resumeUrl, "_blank"))}
          >
            <Icon name="file-text" />
            Résumé
            <Icon name="arrow-up-right" className="ml-auto size-3.5" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
