## Why

The trainer Select dropdown in `ActionTopbar` renders all options at once, causing a noticeable lag on first open when the list is large. Breaking the list into pages loaded on scroll reduces the initial render cost while keeping full-list fuzzy search intact.

## What Changes

- The `trainerOptionList` useMemo in `ActionTopbar` is replaced with paginated state — only the first N options are rendered initially
- On scroll approaching the bottom of the dropdown, the next page of options is appended
- When the user types a search query, pagination is bypassed and all options matching the fuzzy search are shown immediately
- No change to `trainerStore.trainerInfoList` or `monsterStore.monsterMapById` — the full dataset is always held in memory; only what is passed to the Select's `options` prop changes

## Capabilities

### New Capabilities

- `trainer-select-pagination`: Frontend-controlled scroll pagination for the trainer Select, with full-list fuzzy search override when a search query is active

### Modified Capabilities

## Impact

- `src/components/action-topbar/index.tsx`: primary change — new hooks/state for pagination and search handling
- No store changes required
- Ant Design `Select` scroll event via `onPopupScroll` (v4 API)
