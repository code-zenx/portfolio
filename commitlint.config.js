/**
 * Conventional Commits. The changelog is generated from these messages by
 * @release-it/conventional-changelog, so the format is load-bearing —
 * a malformed subject means a missing changelog entry.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "body-case": [2, "always", "lower-case"],
    "body-empty": [2, "never"],
    "body-full-stop": [2, "never"],
  },
};
