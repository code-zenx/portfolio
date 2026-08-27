import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

/**
 * Highlighting runs at build time via shiki, so posts ship as plain
 * pre-coloured HTML — no highlighter in the client bundle.
 */
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-default" },
  keepBackground: false,
  defaultLang: "plaintext",
};
