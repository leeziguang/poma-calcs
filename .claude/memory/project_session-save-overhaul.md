---
name: session-save-overhaul
description: Ongoing overhaul of save/load/autosave session feature — passive sider hydration still broken
metadata:
  type: project
---

Active change: `openspec/changes/overhaul-session-save/`

## Current status (2026-06-17)

isRestoringRef gate implemented (tasks 2.1–2.4 done). Key-space confirmed consistent (3.1–3.3 done).

**Two bugs found during verification, NOT yet fixed:**

### Bug 1 — Autosave not written after reload
After page reload, autosave restore runs via `applySessionState` → `pendingRestoreRef` → hydrate `useEffect`. But `fields.length` check (`fields.length !== expectedCount`) may fail if `expectedCount = Math.max(pairNames.length, 1)` but `pairNames` is empty in the autosave slot (verified: `pairNames: []` after reload). Root cause: autosave snapshot written during restore writes BEFORE `setPairNames` has updated, so `pairNames` is still `[]`.

### Bug 2 — Named session load only restores pair 0 passive state
`gridCellIds[1]` undefined after loading `test-session` that had 2 pairs. Pair 1 passive/grid data lost. Likely cause: hydrate effect `fields.length !== expectedCount` check — when loading via toolbar (not autosave), `fields` may not reach the right count to trigger hydration of all pairs.

### Bug 3 — Stale autosave after loading single-pair session
After loading `single-pair` session into a 2-pair state, autosave still shows 2 pairNames. `isRestoringRef` gate may not be holding long enough, or the gate clears before `setPairNames` renders down to 1 field.

## Next session tasks

1. Debug why `pairNames: []` in autosave after reload — check timing of `setPairNames` vs `buildSnapshot` in the hydrate effect
2. Debug why pair 1 data not hydrated in named session load — trace the `fields.length !== expectedCount` condition
3. Fix stale autosave after single-pair load — gate may clear too early

**Why:** Too many back-and-forth issues with save after passive sider was added. User OK with complete overhaul.

**How to apply:** `/opsx:apply overhaul-session-save` resumes from tasks 4.x once fixes land.
