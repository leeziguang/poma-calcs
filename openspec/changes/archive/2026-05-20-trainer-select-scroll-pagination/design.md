## Context

`ActionTopbar` holds a `useMemo`-derived `trainerOptionList` built from two MobX computed getters (`trainerStore.trainerInfoList` and `monsterStore.monsterMapById`). The full list is passed directly to Ant Design `Select`'s `options` prop. Even though MobX caches the computation, Ant Design must initialize its dropdown portal and virtual list against the full option count on every first open, producing a visible lag.

The component already uses `observer` + `useMemo` correctly. The fix is purely at the options-feeding layer — never touching the stores.

## Goals / Non-Goals

**Goals:**
- Reduce first-open lag by limiting the initial `options` array to the first page (PAGE_SIZE = 100)
- Append subsequent pages when the user scrolls to the bottom of the dropdown
- When a search query is active, bypass pagination entirely and pass all fuzzy-matched options so no result is ever hidden

**Non-Goals:**
- Server-side or async pagination — all data is already in memory
- Changing `trainerStore`, `monsterStore`, or any store logic
- Replacing Ant Design Select with a different component
- Infinite scroll beyond the total list length

## Decisions

### 1. Page size: 100

100 items covers most viewable cases and keeps the first render fast. Alternatives: 50 (too aggressive, more scroll events), 200 (defeats the purpose for lists around that size). 100 is a reasonable default constant that can be adjusted.

### 2. Scroll detection via `onPopupScroll`

Ant Design v4 `Select` exposes `onPopupScroll: (e: React.UIEvent<HTMLDivElement>) => void`. Checking `scrollTop + clientHeight >= scrollHeight - threshold` (threshold ~20px) inside this handler is the correct approach — no external scroll library needed.

### 3. Search bypasses pagination via `filterOption` returning the full list

When `searchValue` is non-empty, the component sets `options` to the full `trainerOptionList` (all items). Ant Design's built-in `filterOption` then narrows it client-side. This means the user always searches across 100% of options regardless of which page they're on.

Alternative considered: keep `options` paginated and implement a custom `filterOption` that searches the full list returning `true/false`. This doesn't work because Ant Design only searches within the currently supplied `options` array — there is no way to inject results outside of it.

### 4. State: `page` (number) + `searchValue` (string) as local React state

Both are component-local; no store involvement needed. `page` resets to 1 whenever `trainerOptionList` reference changes (i.e., when the store data updates).

## Risks / Trade-offs

- **Scroll handler fires frequently** → Mitigation: guard with a short-circuit check (`currentPage * PAGE_SIZE >= total`) to avoid setState after the last page is loaded.
- **Search resets to full list on every keystroke** → Mitigation: this is intentional and fast because the data is already in memory; no debounce needed.
- **Page does not reset on store data change** → Mitigation: a `useEffect` watching `trainerOptionList` resets `page` to 1 to avoid stale slice boundaries.
