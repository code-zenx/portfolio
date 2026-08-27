import Link from "next/link";
import { profile } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto flex max-w-[1080px] flex-wrap justify-between gap-3 px-5 pb-8 pt-5 text-[12px] tracking-[0.04em] text-ink-3 md:px-10">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="flex gap-5">
          <Link href="/projects" className="link-rule">
            Projects
          </Link>
          <Link href="/blog" className="link-rule">
            Blog
          </Link>
          <a href={profile.github} className="link-rule">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="link-rule">
            Email
          </a>
        </span>
      </div>
    </footer>
  );
}
