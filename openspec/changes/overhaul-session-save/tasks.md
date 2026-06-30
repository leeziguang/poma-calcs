## 1. Investigate

- [x] 1.1 Confirm `IPairPassiveState` mutations always go through `setPairPassiveState` (never in-place) — determines if deep autorun is needed (current grep shows yes, always via setter, so shallow observation is fine)

## 2. Fix autosave gate during restore

- [x] 2.1 Add `isRestoringRef = useRef(false)` in `usePairSession`
- [x] 2.2 Set `isRestoringRef.current = true` at the start of `applySessionState`
- [x] 2.3 Guard `debouncedAutoSave` to no-op when `isRestoringRef.current === true`
- [x] 2.4 Set `isRestoringRef.current = false` at the end of the hydrate `useEffect` (after `pendingRestoreRef.current = null`), then immediately write one clean autosave snapshot

## 3. Verify passive state round-trip

- [x] 3.1 Trace `buildSnapshot` — confirm `passiveStates` keyed by loop index `i` matches `fields[i].name` used in hydrate effect (should be equivalent; document why)
- [x] 3.2 Trace `gridCellIds` same way
- [x] 3.3 Fix any key mismatch found in 3.1 / 3.2

## 4. Manual verification

- [ ] 4.1 Add 2+ pairs, set passive skills and grid cells on each, save named session, reload page → verify autosave restores full passive state
- [ ] 4.2 Add 2+ pairs, set passive skills, save named session, load it via toolbar → verify passive state matches
- [ ] 4.3 Verify no stale autosave snapshot written during load (add 2 pairs, load session with 1 pair → autosave should reflect 1 pair not 2)
- [ ] 4.4 Verify existing localStorage sessions still load (no version mismatch)
