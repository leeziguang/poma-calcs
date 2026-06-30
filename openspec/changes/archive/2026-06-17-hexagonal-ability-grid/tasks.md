## 1. Types

- [x] 1.1 Add `x`, `y`, `z: number`, `cellColor?: 'red' | 'yellow'`, and `description?: string` to `IAbilityCellDisplay` in `src/types/ability.ts`

## 2. Helper — genAbilityCellDisplayList

- [x] 2.1 Copy `x`, `y`, `z` from each `IAbilityPanel` into the returned `IAbilityCellDisplay`
- [x] 2.2 Set `cellColor: 'red'` when `ability.type === EAbilityType.MOVE_HEAL`
- [x] 2.3 Set `cellColor: 'yellow'` when `ability.type === EAbilityType.PINCH_HEAL`
- [x] 2.4 Build `description` string: stat label + `+value` for stat cells, move name for move cells, passive name for passive cells

## 3. HexAbilityGrid component

- [x] 3.1 Create `src/components/hex-ability-grid/index.tsx` exporting `HexAbilityGrid` with prop `cells: IAbilityCellDisplay[]`
- [x] 3.2 Implement flat-top cube→pixel conversion (`px = size * 1.5 * x`, `py = size * (√3/2 * x + √3 * z)`) with a chosen cell size (e.g. 20px)
- [x] 3.3 Offset all positions so minimum `px`/`py` is 0 (shift grid to top-left)
- [x] 3.4 Render each cell as an absolutely positioned div clipped to a hex shape via CSS clip-path
- [x] 3.5 Apply `.hexCell--red` class for `cellColor === 'red'`, `.hexCell--yellow` for `'yellow'`
- [x] 3.6 Wrap each cell in Ant Design `Tooltip` with `title={cell.description}` (skip tooltip when no description)
- [x] 3.7 Create `src/components/hex-ability-grid/style.scss` with base hex cell styles, `--red`, and `--yellow` modifier classes; import variable.less at top

## 4. PassiveGridSider integration

- [x] 4.1 Replace the flat ability-cell list in `src/components/passive-grid-modal/index.tsx` with `<HexAbilityGrid cells={gridTiles} />`
- [x] 4.2 Remove unused list-row SCSS rules from `src/components/passive-grid-modal/style.scss` (only those created for the flat list)

## 5. Verification

- [x] 5.1 Select a trainer in the UI and open the sider — confirm hex grid renders with correct spatial layout
- [x] 5.2 Confirm MOVE_HEAL cells are red and PINCH_HEAL cells are yellow
- [x] 5.3 Hover over cells — confirm tooltip shows e.g. `"ATK +5"`, `"Healing Sun 1"`, `"SPE +5"`
- [x] 5.4 Run TypeScript build (`npm run build`) with no new errors
