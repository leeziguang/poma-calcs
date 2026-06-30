---
name: note-taking
description: How to write and format notes to build a knowledge base for future development. Use this skill to take notes after an agent session is completed, or user prompts the agent for note taking.
globs: **/*.ts
alwaysApply: false
---

For each note, keep track of the 
1. Change requested
2. Thought process
3. Solution
4. Follow-up corrections (**MOST IMPORTANT** to note if such corrections exist)
5. Skills and rules referenced
6. Time required to implement

Standards for notes to adhere to
1. Keep it concise, less than 200 words per note
2. Keep it focused, **DO NOT** get distracted with another change within a note

Below is a **complete** example note (includes **5** and **6**). More entries: [milvus-notes](./2026-q1/milvus.md).

```md
## 1. Extract component state into a MobX store
**Change requested:** Replace `useState` calls in `cluster-section.tsx` (clusters, loading, selectedKey, detail, detailLoading) with a MobX store.

**Thought process:** The component had five pieces of local state managed via `useState` + `useEffect` for fetching. The codebase already uses MobX stores (e.g. `StarRocksProjClusterStore`) with `@observable`, `@action.bound`, `@loading`, and `@followUp` decorators. Following that pattern centralises state, makes it reusable, and keeps the component as a thin rendering layer.

**Solution:** Created `src/store/project-manage/milvus/cluster.ts` with `MilvusClusterStore` extending `BaseStore`. Observables replaced each `useState`. Fetch methods used `@followUp` to auto-call setters and `@loading` for loading state via `store.getLoading()`. The component was wrapped with `observer()` and all local state removed.

**Follow-up corrections:**
- Formatting: the `observer()` wrapper changed the indentation expectations. The codebase pattern is `export const X = observer((props) => { ... })` with 2-space body indent, not `React.FC<Props>` typing on observer components.

**Skills and rules referenced:** MobX store patterns from existing project-management stores; user rule to match codebase conventions.

**Time required to implement:** ~45–60 minutes.

---
```

On finishing a note, **SUGGEST** changes to relevant skills under [development](../development) (or sibling skills under `.claude/skills/`) for the user to review.

## File/Folder Naming Conventions
- Follow the openspec change name, when missing, suggest/ask the user for a name.
- Index notes based on features, consider the git branch name of the feature in the format `feat/{year}-{q#}/name-of-feature`. When notes start on the next quarter, create the new corresponding notes folder for that quarter.