## Why

Users currently must manually type the raw stat value (e.g., Attack) and move base power for every pair tab, even though monsterStore already holds the stat arrays and move IDs for every sync pair. This is tedious and error-prone — autofilling from the selected monster's data removes the manual step and ensures accuracy.

## What Changes

- When a trainer/monster pair is added, each tab's **Raw Stat** field in the Base Stat collapse is auto-populated from the monster's stat array at the user-selected level (read-only unless Custom Mode is on).
- The **Level** InputNumber drives the displayed stat in real time — changing level updates the auto-populated stat immediately.
- The free-text **Move Name** input + **Add** button in `DataColList` is replaced (in non-custom mode) by a **Select** showing the monster's 4 moves (label from `moveNamesEn`, value pre-fills Base Power on add).
- `ITrainerOption` gains `move1Id`–`move4Id` so the selected option carries all the move IDs needed downstream.
- `MonsterStore` gains a `monsterById` computed map for O(1) monster lookup by `monsterId`.
- `EPairListFormFields` gains a `MONSTER_ID` field so the selected monster is stored in form state and accessible to any nested component via `Form.useWatch`.
- **Custom Mode** bypasses all autofill — the Raw Stat InputNumber is editable, and the Move Name free-text input + Add button are shown as before.

## Capabilities

### New Capabilities

- `monster-stat-autofill`: Auto-populate and reactively display the Raw Stat in the Base Stat collapse from the selected monster's stat array at the current level, disabled in non-custom mode.
- `monster-move-select`: Replace the free-text move name input with a Select of the monster's 4 moves (labeled by English name, pre-filling Base Power on add) when not in Custom Mode.

### Modified Capabilities

- `monster-data-api`: `MonsterStore` gains a `monsterById` computed for fast monster lookup — internal implementation change only, no requirement change.

## Impact

- **`src/store/monster.ts`** — add `monsterById` computed
- **`src/store/trainer.ts`** — extend `ITrainerOption` with `move1Id`–`move4Id`; populate them in container
- **`src/types/index.ts`** — add `MONSTER_ID` to `EPairListFormFields`
- **`src/components/action-topbar/index.tsx`** — pass `monsterId` into `add()` default values
- **`src/container/index.tsx`** — populate `move1Id`–`move4Id` on `ITrainerOption` from `monsterStore`
- **`src/components/base-stats/index.tsx`** — watch `MONSTER_ID` + level; render disabled stat or editable InputNumber depending on Custom Mode
- **`src/components/data-col-list/index.tsx`** — watch `MONSTER_ID`; show move Select vs free-text input based on Custom Mode; pre-fill Base Power on column add
- **`src/store/move.ts`** — optionally add `moveById` computed for O(1) power lookup
