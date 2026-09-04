"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Icon } from "@/components/icon/icon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { PostMeta } from "@/features/blog/posts.server";
import { KIND_LABEL, type ProjectMeta } from "@/features/projects/types";
import { nav, profile } from "@/config/site";

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
              <Icon name="hash" className="size-3.5 shrink-0 text-ink-3" />
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
                <Icon name="git-branch" className="size-3.5 shrink-0 text-ink-3" />
                <span className="truncate">{p.title}</span>
                <span className="ml-auto shrink-0 whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
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
                <Icon name="file-text" className="size-3.5 shrink-0 text-ink-3" />
                <span className="truncate">{p.title}</span>
                <span className="ml-auto shrink-0 whitespace-nowrap text-[0.6875rem] tabular-nums text-ink-3">
                  {p.readingMinutes} min
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        <CommandGroup heading="Theme">
          <CommandItem value="theme light" onSelect={() => run(() => setTheme("light"))}>
            <Icon name="sun" className="size-3.5 shrink-0 text-ink-3" />
            Light
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => run(() => setTheme("dark"))}>
            <Icon name="moon" className="size-3.5 shrink-0 text-ink-3" />
            Dark
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => run(() => setTheme("system"))}>
            <Icon name="monitor" className="size-3.5 shrink-0 text-ink-3" />
            System
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Elsewhere">
          <CommandItem
            value="email contact"
            onSelect={() => run(() => window.open(`mailto:${profile.email}`))}
          >
            <Icon name="mail" className="size-3.5 shrink-0 text-ink-3" />
            {profile.email}
          </CommandItem>
          <CommandItem
            value="github code"
            onSelect={() => run(() => window.open(profile.github, "_blank"))}
          >
            <Icon name="git-branch" className="size-3.5 shrink-0 text-ink-3" />
            GitHub
            <Icon name="arrow-up-right" className="ml-auto size-3 shrink-0 text-ink-3" />
          </CommandItem>
          <CommandItem
            value="resume cv pdf"
            onSelect={() => run(() => window.open(profile.resumeUrl, "_blank"))}
          >
            <Icon name="file-text" className="size-3.5 shrink-0 text-ink-3" />
            Résumé
            <Icon name="arrow-up-right" className="ml-auto size-3 shrink-0 text-ink-3" />
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="flex items-center gap-4 border-t border-rule-hair px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↵</kbd>
          Open
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <kbd className="kbd">esc</kbd>
          Close
        </span>
      </div>
    </CommandDialog>
  );
}
