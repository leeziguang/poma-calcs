## Why

The ability cell section in `PassiveGridSider` currently renders a flat list, discarding the `x`/`y`/`z` cube coordinates stored in each `IAbilityPanel` entry. This loses spatial information that the game uses to position cells in a hexagonal grid, making it harder for users to visually reason about their ability panel layout.

## What Changes

- Replace the flat ability-cell list in `PassiveGridSider` with a 2-D hexagonal grid component.
- Map cube coordinates (`x`, `y`, `z`) from `IAbilityPanel` to pixel offsets using the standard axial-to-pixel hex formula.
- Colour cells by type: `EAbilityType.MOVE_HEAL` → red, `EAbilityType.PINCH_HEAL` → yellow, all others → default.
- Render each cell's description (stat label + value, move name, or passive name) as an Ant Design `Tooltip` on hover.
- Extend `IAbilityCellDisplay` with `x`, `y`, `z` fields so the grid component receives coordinates alongside display data.

## Capabilities

### New Capabilities

- `hex-ability-grid`: Hexagonal grid display for ability panel cells — renders positioned hex cells with colour coding and tooltip descriptions derived from `IAbilityPanel` + `IAbility` data.

### Modified Capabilities

- `passive-grid-modal`: `PassiveGridSider` ability-cell section changes from a flat list to a hex grid; requires updated `genAbilityCellDisplayList` return shape.

## Impact

- **Modified files**: `src/types/ability.ts`, `src/components/passive-grid-modal/helpers.ts`, `src/components/passive-grid-modal/index.tsx`, `src/components/passive-grid-modal/style.scss`
- **New files**: `src/components/hex-ability-grid/index.tsx`, `src/components/hex-ability-grid/style.scss`
- No API, store, or service changes required; coordinates already exist in fetched data.
