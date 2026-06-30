## Context

The app loads all monster stat arrays (`atkValues`, `defValues`, etc. indexed by `level - 140`) and move change IDs (`move1ChangeId`–`move4ChangeId`) into `monsterStore` at startup. `trainerStore.trainerOptionsList` already carries `monsterId` per option, but the selected monster identity is not currently stored in form state — so nested components (`BaseStats`, `DataColList`) cannot reach it.

The Level InputNumber (range 140–200) is already in form state as `EPairListFormFields.LVL` and watched by child components. The Raw Stat InputNumber is currently a plain editable field.

The four move change IDs on each `IMonster` map directly to `IMove.moveId` in `moveStore.moves`, giving base power and a key into `moveStore.moveNamesEn` for the English label.

## Goals / Non-Goals

**Goals:**
- Auto-populate Raw Stat from `monsterStore` at the given level; update reactively as level changes.
- Render Raw Stat as a disabled InputNumber (non-custom mode) to preserve Ant Design Form layout.
- Expose the monster's 4 moves as a Select in the move column add bar (non-custom mode); pre-fill Base Power on add.
- Keep Custom Mode behavior identical to today — all fields remain fully editable.
- Store `monsterId` in form state so any descendant can access it via `Form.useWatch` without prop drilling.
- Expose `move1Id`–`move4Id` on `ITrainerOption` so the selected option is self-contained.

**Non-Goals:**
- Choosing between Atk and SpAtk automatically based on move category — Raw Stat will default to `atkValues` for now.
- Persisting or serialising the form to a URL or localStorage.
- Changing the stat calculation formula or the `calcBaseStat` helper.

## Decisions

### 1. Store `monsterId` as a form field, not in component state

**Decision:** Add `EPairListFormFields.MONSTER_ID` and write the selected `monsterId` as a default value in the `add()` call inside `ActionTopbar`.

**Rationale:** `BaseStats` and `DataColList` are deeply nested inside `Form.List`. Passing `monsterId` via props would require threading it through `PairStoreContext` (semantically wrong — it's not pair damage state) or adding a prop to every intermediate component. `Form.useWatch` is the established pattern in this codebase for sharing form values between arbitrary depths; using it here is consistent and requires no new infrastructure.

**Alternative considered:** A new MobX observable on `PairStore` per tab. Rejected because `PairStore` models damage aggregation, not UI selection state.

### 2. Disabled InputNumber for Raw Stat (not a plain div)

**Decision:** In non-custom mode, render the Raw Stat as `<InputNumber disabled value={autoStat} />`.

**Rationale:** The user flagged that a plain `<div>` may break form item layout (label alignment, spacing). A disabled InputNumber preserves the `Form.Item` structure — label, validation, consistent spacing — with zero style changes.

**Alternative considered:** Plain `<div>` wrapped in `Form.Item`. Rejected because it breaks the existing style without benefit; the user explicitly noted the risk.

### 3. `move1Id`–`move4Id` on `ITrainerOption`, populated in the container

**Decision:** Extend `ITrainerOption` in `src/store/trainer.ts` with optional `move1Id`–`move4Id: number | undefined`. Populate them in the `setTrainerOptionsList` call inside `container/index.tsx` by looking up `monsterStore.monsterById[monsterId]` and reading its `moveNChangeId` fields.

**Rationale:** The container already performs the monster name lookup in the same `runInAction` block; adding move ID extraction there is natural and keeps trainer store free of a monsterStore dependency. Keeping the fields on `ITrainerOption` makes the selected option self-contained — `ActionTopbar` can pass the IDs into `add()` without an extra store lookup.

**Alternative considered:** Compute move IDs from `monsterId` inside `DataColList` at render time. Rejected because it adds a live monsterStore dependency to a UI component; the option data is already computed once on load.

### 4. Move IDs flow into form state alongside `monsterId`

**Decision:** Add `EPairListFormFields.MOVE1_ID`–`MOVE4_ID` alongside `MONSTER_ID` as form fields, written by `add()` defaults in `ActionTopbar`.

**Rationale:** `DataColList` needs all 4 move IDs to build the Select options. Watching `MONSTER_ID` and re-deriving move IDs from monsterStore in the component is possible but adds a store dependency. Storing them in form state keeps the component purely form-driven and matches the existing pattern.

### 5. `monsterById` computed on `MonsterStore`

**Decision:** Add a `monsterById: Record<string, IMonster>` computed to `MonsterStore`.

**Rationale:** Currently monsterStore only exposes `monsterMapById` (a trimmed map of name + baseId). Components need the full `IMonster` (stat arrays, move IDs). Rather than scanning `monsters[]` on every render, a computed map provides O(1) lookup and is cached by MobX.

### 6. `moveById` computed on `MoveStore`

**Decision:** Add `moveById: Record<string, IMove>` computed to `MoveStore` for O(1) power lookup.

**Rationale:** `DataColList` needs to look up base power by move ID when the user selects a move. Scanning the `moves` array on every select interaction is unnecessary; a computed map is cleaner and consistent with the `monsterById` pattern.

## Risks / Trade-offs

- **Wrong stat type (Atk vs SpAtk):** Using `atkValues` for all monsters means the auto-filled stat is incorrect for special attackers. Mitigation: document this clearly; a stat-type selector can be added in a follow-up without architecture changes.
- **Level array bounds:** If `level - 140 > atkValues.length - 1`, the lookup returns `undefined`. Mitigation: guard with `atkValues[level - 140] ?? undefined` and leave the field blank rather than showing `undefined`.
- **move change ID vs move ID mismatch:** The user confirmed `moveNChangeId` maps directly to `IMove.moveId`. If any IDs are missing from the fetched moves list, the Select option label falls back to the raw ID string. Mitigation: `moveNamesEn[String(moveId)] ?? String(moveId)`.
- **Custom Mode UX:** Switching Custom Mode off → on does not re-apply autofill to values the user has already edited. This is intentional (user edited values are preserved), but may surprise users. Mitigation: document in UI tooltip if needed.

## Open Questions

- Should `atkValues` or a user-selectable stat (Atk / SpAtk toggle) drive the Raw Stat autofill? Currently defaulting to `atkValues`.
- Should selecting a move from the Select auto-add the column immediately, or require a separate Add button click? Currently requiring a button click to match the existing UX.
