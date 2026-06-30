## Requirements

### Requirement: HexAbilityGrid renders cells at hex-coordinate positions
`src/components/hex-ability-grid/index.tsx` SHALL export a `HexAbilityGrid` component that accepts `cells: IAbilityCellDisplay[]` and renders each cell as an absolutely positioned div inside a `position: relative` container, using flat-top hex pixel conversion from the cell's `x`/`z` cube coordinates.

#### Scenario: Cells positioned by coordinates
- **WHEN** `HexAbilityGrid` receives cells with distinct `x`/`z` values
- **THEN** each cell SHALL be rendered at a unique pixel offset corresponding to its cube coordinate

#### Scenario: Empty cells array
- **WHEN** `HexAbilityGrid` receives an empty `cells` array
- **THEN** the component SHALL render an empty container without errors

### Requirement: MOVE_HEAL cells are coloured red
Cells whose `cellColor` is `'red'` SHALL render with a red background.

#### Scenario: Red cell rendering
- **WHEN** a cell has `cellColor === 'red'`
- **THEN** that hex cell element SHALL have the CSS class `hexCell--red`

### Requirement: PINCH_HEAL cells are coloured yellow
Cells whose `cellColor` is `'yellow'` SHALL render with a yellow background.

#### Scenario: Yellow cell rendering
- **WHEN** a cell has `cellColor === 'yellow'`
- **THEN** that hex cell element SHALL have the CSS class `hexCell--yellow`

### Requirement: Cell description shown as tooltip
Each hex cell SHALL be wrapped in an Ant Design `Tooltip` displaying the cell's `description` string on hover.

#### Scenario: Tooltip content matches description
- **WHEN** the user hovers over a hex cell
- **THEN** the Ant Design Tooltip SHALL display the cell's `description` (e.g. `"ATK +5"`, `"Healing Sun 1"`)

#### Scenario: No tooltip for cells with no description
- **WHEN** a cell has no `description`
- **THEN** no tooltip SHALL appear on hover
