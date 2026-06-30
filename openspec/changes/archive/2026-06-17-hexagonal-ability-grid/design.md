## Context

`PassiveGridSider` renders ability cells as a flat ordered list. Each `IAbilityPanel` entry already contains `x`, `y`, `z` cube coordinates but they are unused. The game uses a flat-top hexagonal grid. The sider is a narrow right panel (~280–320px wide), so the grid must be compact and scrollable.

Current flow: `abilityStore.selectedAbilityCells` → `genAbilityCellDisplayList` → flat `IAbilityCellDisplay[]` → list rows.

## Goals / Non-Goals

**Goals:**
- Render ability cells in a 2-D hex grid matching spatial layout from data.
- Colour `MOVE_HEAL` cells red, `PINCH_HEAL` cells yellow, others neutral.
- Show cell description (stat label + value / move name / passive name) as an Ant Design `Tooltip`.
- Keep the implementation self-contained in a new `hex-ability-grid` component.

**Non-Goals:**
- Interaction (click to unlock, energy cost display) — display only.
- Zoom or pan controls.
- Changes to store fetching or API layer.

## Decisions

### 1. Cube → pixel conversion (flat-top hex)

Use flat-top orientation; standard formula:
```
px = size * (3/2 * q)           where q = x
py = size * (√3/2 * q + √3 * r) where r = z
```
`y` is derived (`y = -x - z`) and not needed for pixel math. Cell size ~18–22px to fit within the sider.

**Why not offset coordinates?** The data is already in cube form; converting to offset and back adds steps.

### 2. Separate `HexAbilityGrid` component

New component at `src/components/hex-ability-grid/index.tsx`. Receives `cells: IAbilityCellDisplay[]` as prop. Parent (`PassiveGridSider`) passes `gridTiles` directly.

**Why new component vs inline?** `PassiveGridSider` is already large. Hex layout math is self-contained and reusable.

### 3. Extend `IAbilityCellDisplay` with coordinates + colour

Add `x`, `y`, `z: number` and `cellColor?: 'red' | 'yellow'` to `IAbilityCellDisplay`. `genAbilityCellDisplayList` populates them from `IAbilityPanel`.

**Why not compute in the component?** Component stays presentation-only; logic stays in helpers.

### 4. Tooltip content = description string

Build a short description in `genAbilityCellDisplayList`: e.g. `"ATK +5"`, `"Healing Sun 1"`, `"SPE +5"`. Store as `description?: string` on `IAbilityCellDisplay`. Ant Design `Tooltip` wraps each hex cell.

### 5. SVG vs absolute-positioned divs

Use absolute-positioned `div` elements inside a `position: relative` container. Simpler to style with SCSS and Ant Design `Tooltip` attaches naturally to DOM elements.

**Why not SVG?** Tooltips on SVG elements require extra wiring; div approach is consistent with existing component patterns.

## Risks / Trade-offs

- **Unknown grid bounds**: coordinates may vary per trainer. Container uses `min-width`/`min-height` computed from `Math.max` of all px offsets + one cell diameter → may be tall/wide for large grids. Mitigation: cap container height with `overflow: auto`.
- **Cube coordinate validity**: if data has malformed coords, cells may overlap. Mitigation: render as-is; overlapping is visible but not crashing.
- **Sorting order lost**: current list sorts moves → passives → values. Hex grid ignores sort order (position is from coordinates). Acceptable — spatial layout is the goal.
