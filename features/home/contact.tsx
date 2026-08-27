import { profile } from "@/config/site";

const links = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Résumé, PDF", href: profile.resumeUrl },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-[1080px] px-5 py-20 md:px-10">
        <h2 className="display max-w-[16ch] text-balance text-[length:var(--text-h1)]">
          Tell me what&apos;s breaking.
        </h2>
        <div className="mt-9 flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-5 text-[15px]">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="link-rule text-brand">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
