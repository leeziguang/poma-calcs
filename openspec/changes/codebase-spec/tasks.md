## 1. Damage Calculation Spec

- [ ] 1.1 Verify `calcBaseStat` in `src/components/base-stats/helpers.ts` matches the floor-order formula in `damage-calculation/spec.md`
- [ ] 1.2 Verify `MOVE_LEVEL_STAT_BOOST_MAP` in `src/components/action-topbar/constants.tsx` matches specified multipliers (SA 1–5 = 1.1, others = 1.0)
- [ ] 1.3 Verify stat boost and defense drop multiplier maps in `src/components/base-stats/constants.tsx` match spec tables
- [ ] 1.4 Verify `calcMovePower` in `src/components/move-power/helpers.ts` matches regular-move formula (Tera buff, move-level boost, grid, SM/PMUN, multis, innate, AOE)
- [ ] 1.5 Verify `calcSyncPower` in `src/components/move-power/helpers.ts` matches sync-move formula (Tech buff, sync-level boost, SyUN, innate, AOE = 3.0)
- [ ] 1.6 Verify `calcFieldEffect` in `src/components/field-effects/helpers.ts` matches field effect formula (sync boosts, WTZ, circles, rebuff, SEUN)
- [ ] 1.7 Verify `PairStore.updateMoveInfo` computes `finalDamage = baseStat × movePower × fieldEffect` and `totalDamage = Σ finalDamage`

## 2. Pair Management Spec

- [ ] 2.1 Verify Add Pair button in `src/components/action-topbar/index.tsx` is disabled when no trainer is selected
- [ ] 2.2 Verify new pair tab initialises with level 140 and empty move columns in `src/container/index.tsx`
- [ ] 2.3 Verify tab close removes the pair and its store state
- [ ] 2.4 Verify rename behavior: tab label editable only in custom mode; Enter/blur commits name
- [ ] 2.5 Verify Add Column creates a column with default values (statBoost +6, all others at defaults) in `src/components/data-col-list/constants.tsx`
- [ ] 2.6 Verify Duplicate Column copies all field values to a new adjacent column
- [ ] 2.7 Verify Delete Column removes the column and reactively updates `totalDamage`
- [ ] 2.8 Verify column rename is editable only in custom mode via `RenameableTitle`
- [ ] 2.9 Verify pair level (140–200) and move level selectors exist and trigger recalculation on change

## 3. App Configuration Spec

- [ ] 3.1 Verify `ConfigStore.enemyDef` defaults to 50 and is rendered in the topbar `InputNumber`
- [ ] 3.2 Verify changing enemy defense propagates to all `baseStat` calculations via `configStore` observer
- [ ] 3.3 Verify enemy defense input enforces minimum of 0
- [ ] 3.4 Verify Custom Mode checkbox toggles `configStore.isCustomMode`
- [ ] 3.5 Verify trainer dropdown populates from `trainerStore.trainerOptList` and is searchable
- [ ] 3.6 Verify `configStore.reset()` is called when `ActionTopbar` unmounts

## 4. Data Display Spec

- [ ] 4.1 Verify `numberToDisplayString` in `src/lib/helpers.ts` formats to max 6 decimal places, trailing zeros removed
- [ ] 4.2 Verify `getPercent` returns " - %" when denominator is 0 or NaN
- [ ] 4.3 Verify `MoveDamageDisplay` shows both raw `finalDamage` and percentage of `totalDamage`
- [ ] 4.4 Verify `TotalDamageDisplay` shows the reactive `totalDamage` for the pair
- [ ] 4.5 Verify `TabLabel` shows: pair name, level, formatted move level, and percentage vs first pair
- [ ] 4.6 Verify `formatMoveLevel` in `src/lib/helpers.ts`: regular levels append "/5", SA levels remove the space
- [ ] 4.7 Verify first pair's tab label does not show a percentage comparison value
