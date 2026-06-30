## Context

Passive-related UI (default passive list, extra-passive picker, region-members select) currently lives inside `MovePower`, which is a per-move-column component. This means:

1. The same pair's passives are duplicated/re-derived for every move column.
2. Other pair-level components (`BaseStats`, `FieldEffect`) have no path to passive state without going through the form.
3. `regionMembers` is a form field inside the move column — a structural mismatch because regionals are pair-level, not column-level.

The fix: extract all passive logic into a single pair-level modal, backed by `passiveStore` keyed by `pairFieldName`.

## Goals / Non-Goals

**Goals:**
- Single pair-level `PassiveGridModal` opened via a "VIEW PASSIVE/GRID" button
- `passiveStore` holds per-pair modal state (`regionMembers`, `extraPassives`, `conditionalParams`) so any pair field can observe it
- Conditional `InputNumber` rendered beside passives that need a numeric parameter (currently `RISING_TIDE`, `GOOD_FORM`; extensible)
- Regional passives rendered with a `Select` (1–3, default 1) for `regionMembers`
- State committed on both OK and modal close
- `calcDefaultMultis` reads `regionMembers` from store, not from the form field

**Non-Goals:**
- Wiring conditional passive params into damage calculations (future work — UI inputs only)
- Moving grid management into this modal (stays in `MovePower`)
- Multi-pair aware rendering

## Decisions

### 1. State location: passiveStore (not form, not local React state)

**Chosen**: add `pairPassiveState: ObservableMap<number, IPairPassiveState>` to `PassiveStore`, keyed by `pairFieldName`.

Why not the Ant Design form? The form is already used for per-column move data. Passive state is pair-level and needs to be readable by `BaseStats` and `FieldEffect` without prop drilling or context hacks.

Why not local React state in the modal? The modal unmounts when closed; state must survive across open/close cycles and be accessible from sibling components.

**IPairPassiveState shape:**
```ts
interface IPairPassiveState {
  regionMembers: number;           // 1 | 2 | 3, default 1
  extraPassives: string[];         // selected extra passive IDs
  conditionalParams: Record<string, number>;  // passiveId → numeric param
}
```

Key is `pairFieldName` (the index in the `pairs` form array). This is stable for the lifetime of a pair — deletions that shift indices also cause the affected `DataColList` components to remount, so stale keys are naturally cleaned up.

### 2. Remove regionMembers from the form

`EMovePowerFormFields.REGION_MEMBERS` form item is removed from `MovePower`. `calcDefaultMultis` will instead receive `regionMembers` from `passiveStore.pairPassiveState.get(pairFieldName)?.regionMembers ?? 1`.

This breaks the current dependency on `form.watch` for regionMembers inside `MovePower`. The store observable replaces it as the reactive source.

### 3. Conditional input registry — static map, not dynamic inference

Which passives need a conditional input is defined by a static map in the modal's `constants.ts`:

```ts
const CONDITIONAL_PASSIVE_INPUTS: Record<string, { label: string; min: number; max: number }> = {
  [ESyncPassive.RISING_TIDE]: { label: "Atk stacks", min: 1, max: 6 },
  [EMovePassive.GOOD_FORM]:   { label: "Raised stats", min: 1, max: 41 },
};
```

The modal iterates `passiveOptions`, checks each against this map, and renders an `InputNumber` inline if matched. New conditionals are added to this map only.

### 4. Modal state lifecycle — draft + commit on close/ok

The modal keeps a local draft copy of `IPairPassiveState` while open. On `onOk` or `onClose` (i.e., also when clicking the X or overlay), it calls `passiveStore.setPairPassiveState(pairFieldName, draft)`. This means both dismissal paths commit state — there is no "cancel" that discards changes.

If a discard-on-cancel behavior is needed later, this is where to add it.

### 5. Regional passive detection — reuse existing passiveHasRegionTag

The existing `passiveHasRegionTag` helper in `move-power/helpers.ts` is sufficient. It will be moved to a shared location (`src/lib/passive.ts` or re-exported from `move-power/helpers.ts`). For now, import it directly from the existing path.

## Risks / Trade-offs

- **pairFieldName as key**: If a user deletes a pair in the middle, surviving pairs shift indices and pick up stale store state. Mitigation: `DataColList`'s `useEffect` calls `pairStore.init()` on mount/unmount; extend this pattern to clear `passiveStore.pairPassiveState` on unmount.
- **regionMembers lifted out of form**: Any saved/loaded form state that includes `REGION_MEMBERS` will silently ignore the field. This is acceptable since the field is being removed from the form entirely.
- **RISING_TIDE / GOOD_FORM params not wired to calculation**: The `InputNumber` values are saved to `conditionalParams` in the store but not yet consumed by `calcDefaultMultis`. This is intentional — stated as future work.
