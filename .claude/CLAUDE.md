## Must Read
- Openspec: `openspec/changes` to understand the repo
- Coding conventions: `.claude/rules`
- Habits: `.claude/skills/note-taking`

## Open When Needed
- Feature behavior: read the matching file listed in `openspec/changes`.
- Code edits: read the relevant skill in `.claude/rules`.

## Non-Negotiables

- Respect `lib <- service <- store <- container`.
- `component/` stays presentation-only.
- `.less` files must start with `@import url("/src/styles/variable.less");`.
- End meaningful work with status, verification, and likely next action.
- After meaningful work, conduct `/note-taking` when new reusable business knowledge, coding rules, or user corrections are learned.

## Coding Behavior

Use Caveman style by default: terse, direct, no fluff. Read `.claude/skills/caveman/SKILL.md`.

- Clarify before coding: state assumptions, surface tradeoffs, and ask when requirements have multiple plausible meanings.
- Keep solutions simple: no speculative features, single-use abstractions, or configurability beyond the request.
- Edit surgically: touch only request-linked lines, match existing style, remove only unused code created by your change, and mention unrelated cleanup separately.
- Work goal-first: define verifiable success criteria, use a brief step/verification plan for multi-step work, and loop until checks pass or the blocker is clear.

1. Think before acting. Read existing files before writing code.
2. Be concise in output but thorough in reasoning.
3. Prefer editing over rewriting whole files.
4. Do not re-read files you have already read.
5. Test your code before declaring done.
6. No sycophantic openers or closing fluff.
7. Keep solutions simple and direct.
8. User instructions always override this file. 