## Context

`usePairSession` in `helpers.ts` owns the full save/load/autosave lifecycle. It operates on three parallel data structures keyed per-pair: `pairStores` (via `PairStore.serialize()`), `passiveStates` (from `passiveStore.pairPassiveState`), and `gridCellIds` (from `passiveStore.selectedGridCellIds`).

The passive store uses `field.name` (AntD Form.List integer index, stable within a session but meaningless across sessions) as its map key. At save time, `buildSnapshot` iterates `fields` with a loop counter `i` and uses both `field.name` and `i` — but these are the same value since Form.List names are 0-based contiguous indices. At restore time, the hydrate effect receives a new set of `fields` with potentially different `field.key` values. The code correctly maps saved index `i` → `fields[i]` → `field.name` for passive data — so the key logic is actually consistent.

The real bugs are:
1. **Autosave fires mid-restore.** `applySessionState` calls `form.setFieldsValue` which triggers `onValuesChange` → `debouncedAutoSave`. At that point `fields` still reflects the old pair count, so `buildSnapshot` captures a partial state and overwrites the autosave slot.
2. **`autorun` shallow passive observation.** `void [...passiveStore.pairPassiveState.values()]` spreads the map values at call time but doesn't subscribe to mutations inside each `IPairPassiveState` object. If passive sub-fields are observable, mutations won't retrigger the autorun.

## Goals / Non-Goals

**Goals:**
- Autosave never fires while a restore is in flight
- Passive state mutations (inside existing map entries) trigger autosave
- Save/restore round-trips are lossless for all fields including passive sider
- Zero changes to `ISavedSession` JSON schema (version stays 1)
- Existing named sessions in localStorage remain loadable

**Non-Goals:**
- Dirty tracking / unsaved-changes indicator
- Multi-slot autosave history
- Migrating version 1 sessions to a new format

## Decisions

### D1: Gate autosave with a `isRestoring` ref

**Decision:** Add `isRestoringRef = useRef(false)` in `usePairSession`. Set to `true` at the start of `applySessionState`, set back to `false` at the end of the hydrate effect (after `pendingRestoreRef.current = null`). `debouncedAutoSave` checks the ref and no-ops if restoring.

**Alternatives considered:**
- Cancel the debounce in `applySessionState` — doesn't prevent immediate calls via `autorun` which fires synchronously when MobX observables change.
- Disable `onValuesChange` during restore by setting a form-level flag — more invasive, requires threading a flag into the JSX layer.

**Rationale:** A ref is the minimal non-reactive state needed. No re-renders, no prop drilling.

### D2: Deep observation via `passiveStore` computed getter

**Decision:** Add a `passiveStateSnapshot` computed (or plain getter with `JSON.stringify`) on `PassiveStore` that MobX tracks deeply. The `autorun` in `usePairSession` observes this instead of spreading map values.

**Alternative:** Use `reaction` with a deep equality comparator on the map values.

**Rationale:** A computed getter accessed inside `autorun` causes MobX to track all observable accesses made during that computation. If `IPairPassiveState` fields are `observable`, accessing them in the computed will create subscriptions. This is the idiomatic MobX approach.

**Implementation note:** If `IPairPassiveState` is a plain object (not observable class), the map values themselves are the full observable surface — mutations replace the whole entry via `setPairPassiveState`, so the current `values()` spread is actually correct. Need to verify whether passive sub-field mutations call `setPairPassiveState` or mutate in-place.

### D3: No key-space changes

After re-analysis, `passiveStates` and `gridCellIds` are already keyed correctly by loop index matching `pairNames` order. No change needed.

## Risks / Trade-offs

- **`isRestoringRef` window is React-render-cycle-dependent.** The hydrate `useEffect` runs after render. If `fields.length` doesn't match `expectedCount` in the first render after `applySessionState`, the effect defers — meaning `isRestoringRef` stays `true` longer. This is the desired behavior (keep autosave gated until hydration completes).
- **Deep passive observation may fire more often.** If the computed getter is expensive, autorun fires on every passive sub-change. Acceptable — `buildSnapshot` is cheap and debounced at 500ms.

## Migration Plan

No migration needed. `ISavedSession.version` stays `1`. Existing autosave slot and named sessions are compatible. Deploy is a static gh-pages push — no rollback complexity.

## Open Questions

- Does `IPairPassiveState` mutate in-place or always replace via `setPairPassiveState`? If in-place mutation exists, D2 is required. If always via setter, D2 is low-priority. → Check `passive.ts` usages before implementing.
