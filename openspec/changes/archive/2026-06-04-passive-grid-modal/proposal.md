## Why

Passive/grid logic is currently buried inside `move-power` per-column, making it invisible to other pair fields (stat, field-effect) and creating duplicated state per move column. Extracting it into a pair-level modal gives all fields a single shared passive context and makes the UI navigable at the pair level rather than the move level.

## What Changes

- Remove passive display, extra-passive selection, and region-members input from `MovePower` component
- Add **VIEW PASSIVE/GRID** button to the pair toolbar (between Moves count and Total Pair Damage)
- New `PassiveGridModal` component: displays pair's default passives, allows extra-passive selection, conditionally shows numeric inputs for passives that require additional parameters (e.g. `RISING_TIDE` attack stack count 1–6, `GOOD_FORM` raised-stat count 1–41), and shows a region-members Select (1–3, default 1) beside any regional passive
- Modal saves state on both OK and dismiss (close)
- `passiveStore` extended to hold per-pair passive modal state (region members, extra passives, conditional passive params) so `move-power`, `base-stats`, and `field-effect` components can all read from it

## Capabilities

### New Capabilities

- `passive-grid-modal`: Pair-level passive/grid modal — default passive display with conditional inputs, extra passive selection, region-members Select, state persisted in passiveStore

### Modified Capabilities

- `passive-store`: Add per-pair modal state (regionMembers, extraPassives, conditionalParams) to existing store

## Impact

- `src/components/move-power/index.tsx` — remove passive block (lines 264–304), remove `hasRegionPassive` / `regionMembers` form field
- `src/components/data-col-list/index.tsx` — add VIEW PASSIVE/GRID button between Moves and TotalDamageDisplay
- `src/store/passive.ts` — new observable fields for modal state
- `src/types/passive.ts` — possibly new types for conditional passive params
- New files: `src/components/passive-grid-modal/index.tsx`, `src/components/passive-grid-modal/style.scss`
