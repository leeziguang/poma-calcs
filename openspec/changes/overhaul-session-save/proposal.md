## Why

Save/restore is broken with passive sider: key-space inconsistencies between `pairStores` (keyed by loop index) and `passiveStates`/`gridCellIds` (keyed by `field.name`) cause silent data loss on restore. Autosave also fires mid-restore, overwriting good state with a stale partial snapshot.

## What Changes

- **Fix key normalization**: all per-pair data in the snapshot (`pairStores`, `passiveStates`, `gridCellIds`) keyed consistently by pair index (0-based position at save time)
- **Gate autosave during restore**: block `debouncedAutoSave` from firing while `pendingRestoreRef` is set (i.e. between `applySessionState` and the hydrate effect completing)
- **Deepen passive autorun observation**: observe nested `IPairPassiveState` fields so changes inside an existing map entry trigger autosave
- **Fix `activeKey` restore**: convert stored index back to live `field.key` reliably (already done; verify and document)
- Keep `ISavedSession` JSON shape at `version: 1` — no schema migration needed

## Capabilities

### New Capabilities
- `session-save`: Full save/restore/autosave lifecycle for named sessions and autosave slot, including passive sider state

### Modified Capabilities
<!-- none — no existing specs exist for this -->

## Impact

- `src/components/global-toolbar/helpers.ts` — `buildSnapshot`, autosave effect, hydrate effect
- `src/store/passive.ts` — may need observable accessor for deep autorun
- `src/types/session.ts` — no interface changes; version stays 1
- `src/store/session.ts` — no changes needed
