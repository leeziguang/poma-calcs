# Ability Cells Panel

## 1. selectedAbilityCells computed in AbilityStore

**Change requested:** Use `trainerStore.selectedTrainerId` to filter `AbilityPanel.json` entries and expose them as `selectedAbilityCells` computed on `AbilityStore`.

**Thought process:** `IAbilityPanel.trainerId` is typed `number`; `ITrainer.trainerId` is `string`. First assumed the panel's numeric field mapped to `ITrainer.number` (the sequential index). User corrected: match via `String(p.trainerId) === trainerId` — the panel ID is the same value as the string trainer ID, just stored as a number. Also added `abilityMap: computed` (keyed by `abilityId`) to avoid re-reducing inside helpers.

**Solution:** Imported `trainerStore` into `AbilityStore`. Added two computeds in `makeObservable` + getters: `abilityMap` and `selectedAbilityCells`. Cross-store computed is valid in MobX at the same layer level.

**Follow-up corrections:**
- Initial filter used `trainer[ETrainerFields.NUMBER]`; corrected to `String(p.trainerId) === trainerStore.selectedTrainerId` directly (no trainer lookup needed).

**Skills and rules referenced:** MobX cross-store computed pattern; `lib ← service ← store ← container` layer rule.

**Time required to implement:** ~15 min.

---

## 2. genAbilityCellDisplayList + passive sider render

**Change requested:** Resolve each ability cell's move/passive/value labels and render the list in `PassiveGridSider` between "Passives / Grid" and "Extra Passives".

**Thought process:** `IAbility` has `type` (→ `EAbilityType` label), `moveId` (→ `moveStore.moveNamesEn`), `passiveId` (→ `resolvePassiveName` chain via `passiveSkillNamesEn` + description parts + digit map), and `value`. Sorted output: move cells first, then passive, then value-only.

**Solution:** Added `ABILITY_TYPE_LABELS` const map and `genAbilityCellDisplayList(trainerId: string)` to `passive-grid-modal/helpers.ts`. Rendered via IIFE in `PassiveGridSider` JSX, reusing existing `passiveGridSider-passives-row` classes.

**Follow-up corrections:**
- Initially called `genAbilityCellDisplayList()` with no args, reading `abilityStore.selectedAbilityCells` (global `trainerStore.selectedTrainerId`). When switching pair tabs, ability cells didn't update because the global ID didn't change. Fix: pass the per-pair `trainerId` prop and filter `abilityStore.abilityPanels` directly inside the helper. `abilityStore.abilityPanels` is observable so `observer` tracks it reactively.

**Skills and rules referenced:** `resolvePassiveName` reuse from same file; `observer` reactive tracking without `useMemo`.

**Time required to implement:** ~30 min.

---

## 3. Disable hex cells by move level

**Change requested:** Disable grid cells whose `conditionIds` require a higher move level than the pair's selected Move Level. Disabled cells: gray `#c8c8c8`, unclickable, excluded from energy. Keep hexagon shape + pointer cursor.

**Thought process:** `conditionId → required level`: 12→2, 13→3, 14→4, 15→5 (other ids ignored). A cell disables if any conditionId's required level exceeds the selected level. `EMoveLevelValues` are strings `"1"`–`"5"` and `"SA 1"`–`"SA 5"`; SA exceeds 5, so it satisfies all (parse as 99). `conditionIds` are typed `string[]` on `IAbilityPanel` but stored as numbers in cache — mapped via `.map(Number)`.

**Solution:** Added `conditionIds: number[]` to `IAbilityCellDisplay`; populated in `genAbilityCellDisplayList`. Threaded `moveLvl` from `data-col-list` (watched form field) → `PassiveGridSider` → `HexAbilityGrid`. Grid computes `isCellDisabled` per cell.

**Follow-up corrections:**
- First applied gray as inline `backgroundColor` on `.hexCell`, but the hexagon is a `::before` clip-path — gray showed as a rectangle. Fixed with a `hexCell--disabled` class coloring `::before` at full opacity.

**Skills and rules referenced:** `Form.useWatch` for reactive form values; `component/` stays presentation-only.

**Time required to implement:** ~25 min.

---

## 4. Passive NameDigit fallback to rank

**Change requested:** Some passives rendered a raw move id (e.g. `Dragon Zone: P-Moves ↑ & S-Moves ↑ 40000336`) instead of the expected `... 5`.

**Thought process:** `[Name:PassiveSkillNameDigit ]` resolves two ways. If the passive description contains a `[Digit:Ndigits]` placeholder, the value comes from `MoveAndPassiveSkillDigit` params (`param2`, `param4`, … per Idx) — e.g. First Aid `param2` = 10/20/…. "Zone"/"Extension" passives have **no** `[Digit:]` tag; their `param2` is a move-id reference (`40000336`), not a display number. For those the intended number is the passive **rank** = `id % 100` (`13084305` → 5, `19060305` → 5).

**Solution:** `resolveNameDigitIdx` now returns `null` (not `0`) when no `[Digit:]` tag exists. The NameDigit replacer falls back to `String(Number(passiveId) % 100)` on `null`; otherwise reads digit params. Added `.trim()` to the resolved name.

**Follow-up corrections:**
- First attempt rendered empty string for the no-digit case; user clarified the expected value is the rank (`5`), not blank.

**Skills and rules referenced:** `resolvePassiveName` chain in `passive-grid-modal/helpers.ts`.

**Time required to implement:** ~30 min (mostly cache spelunking).

---

## 5. Integrate hex grid selections into baseStats and movePower calculations

**Change requested:** Selected stat cells (ATK/SPA by move category) and MOVE_POWER cells from `HexAbilityGrid` should feed into `calcBaseStat` and `calcMovePower` respectively. Remove the manual "Grid Boost" form fields; use hex grid values only.

**Thought process:** Grid is per-pair (not per-column), but each column has its own move category. Store selected cell IDs in `IPairPassiveState.selectedGridCellIds`. Derive the stat/power bonus in `BaseStats` and `MovePower` by filtering `abilityStore.abilityPanels` by trainerId + selectedIds + ability type.

**Solution:** Added `selectedGridCellIds: number[]` to `IPairPassiveState`. `BaseStats` imports `abilityStore`/`EAbilityType`, computes `hexGridStatBonus` via `useMemo` (ATK for physical, SPA for special), passes `hexGridStatBonus` directly as `grid` to `calcBaseStat`. `MovePower` does same for `EAbilityType.MOVE_POWER`. Removed both "Grid Boost" `Form.Item` inputs.

**Follow-up corrections:** None.

**Skills and rules referenced:** MobX observer pattern; `component/` stays presentation-only (bonus computed in component, not store).

**Time required to implement:** ~20 min.

---

## 6. HexAbilityGrid selection performance — ObservableMap per-key reactivity

**Change requested:** Selecting a grid tile re-rendered the entire grid. Optimize so only the toggled cell re-renders.

**Thought process:** Three layers of problem: (1) `PassiveGridSider` (MobX observer) re-rendered `HexAbilityGrid` on store update; (2) `ObservableSet.has()` notifies ALL observers when ANY key changes — not per-key; (3) inline arrow `onSelectionChange` in JSX was a new reference each render, defeating `React.memo`.

**Solution:**
- Replaced `ObservableSet` with `ObservableMap<number, true>` — `ObservableMap.has(key)` tracks per-key, so only the toggled cell's observer fires.
- Extracted `EnergyDisplay` and `SelectedList` as separate `observer` components so `HexAbilityGridInner` is not an observer and never re-renders from selection.
- Wrapped `HexAbilityGridInner` in `React.memo`.
- Extracted `handleGridSelectionChange` with `useCallback([pairFieldName])` before the JSX return in `PassiveGridSider` (hooks in JSX props are unreliable).

**Follow-up corrections:**
- First attempt used `ObservableSet` — still re-rendered all cells. Root cause: `ObservableSet.has()` is not per-key reactive.
- Inline `useCallback` in JSX prop was auto-preserved by linter; had to explicitly wire `handleGridSelectionChange` to the prop.

**Skills and rules referenced:** MobX `ObservableMap` per-key reactivity; `React.memo` + `observer` composition; hooks-at-top-level rule.

**Time required to implement:** ~45 min (multiple correction rounds).

---
