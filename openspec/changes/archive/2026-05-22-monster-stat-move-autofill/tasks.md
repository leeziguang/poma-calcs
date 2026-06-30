## 1. Types & Enums

- [x] 1.1 Add `MONSTER_ID`, `MOVE1_ID`, `MOVE2_ID`, `MOVE3_ID`, `MOVE4_ID` to `EPairListFormFields` in `src/types/index.ts`
- [x] 1.2 Extend `ITrainerOption` in `src/store/trainer.ts` with `move1Id`, `move2Id`, `move3Id`, `move4Id: number | undefined`

## 2. Store Computeds

- [x] 2.1 Add `monsterById: Record<string, IMonster>` computed to `MonsterStore` in `src/store/monster.ts` (map by `String(monsterId)`)
- [x] 2.2 Register `monsterById` as `computed` in `makeObservable` in `MonsterStore`
- [x] 2.3 Add `moveById: Record<string, IMove>` computed to `MoveStore` in `src/store/move.ts` (map by `String(moveId)`)
- [x] 2.4 Register `moveById` as `computed` in `makeObservable` in `MoveStore`

## 3. Container — Populate Move IDs on TrainerOptionsList

- [x] 3.1 In `src/container/index.tsx`, inside the `runInAction` block, look up each option's monster via `monsterStore.monsterById[monsterId]` and include `move1Id`–`move4Id` from the monster's `moveNChangeId` fields when building `ITrainerOption` objects

## 4. ActionTopbar — Pass monsterId & Move IDs into add()

- [x] 4.1 In `src/components/action-topbar/index.tsx`, update `handleSelect` to also capture `opt.monsterId`, `opt.move1Id`–`opt.move4Id` from the selected option into local state
- [x] 4.2 Update `handleAdd` to pass `MONSTER_ID`, `MOVE1_ID`–`MOVE4_ID` as additional default values in the `add()` call

## 5. BaseStats — Auto-populate Raw Stat

- [x] 5.1 In `src/components/base-stats/index.tsx`, add `Form.useWatch` for `[EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MONSTER_ID]` and `[EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.LVL]`
- [x] 5.2 Derive `autoStat` by looking up `monsterStore.monsterById[monsterId]?.atkValues[level - 140]`; guard against out-of-bounds with `?? undefined`
- [x] 5.3 In non-custom mode (`!configStore.isCustomMode`), render the Raw Stat `Form.Item` with `<InputNumber disabled value={autoStat} />` instead of the regular InputNumber
- [x] 5.4 In custom mode, keep the existing editable `<InputNumber min={0} />` (no change)
- [x] 5.5 Import `observer` from `mobx-react` if not already imported; wrap `BaseStats` with `observer` so it reacts to `configStore.isCustomMode`

## 6. DataColList — Move Select Add Bar

- [x] 6.1 In `src/components/data-col-list/index.tsx`, add `Form.useWatch` calls for `MOVE1_ID`–`MOVE4_ID` at path `[EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVE{N}_ID]`
- [x] 6.2 Build `moveOptions` array from the 4 move IDs: `{ label: moveStore.moveNamesEn[String(id)] ?? String(id), value: id, power: moveStore.moveById[String(id)]?.power }` for each non-undefined ID
- [x] 6.3 Add local state `selectedMoveId: number | undefined` to track the currently chosen move from the Select
- [x] 6.4 In non-custom mode, render a `<Select>` with `moveOptions` (instead of `<Input placeholder="Move Name">`), and an **Add** button disabled when `selectedMoveId` is undefined
- [x] 6.5 Update `handleAdd` in non-custom mode to pass column title = move name and pre-populate `EMovePowerFormFields.BASE_MOVE` with the selected move's power via the `add()` default value
- [x] 6.6 In custom mode, keep the existing `<Input placeholder="Move Name" />` + **Add** button unchanged
- [x] 6.7 Reset `selectedMoveId` to `undefined` after a column is added
