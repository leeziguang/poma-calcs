## MODIFIED Requirements

### Requirement: Ability cells displayed as a hexagonal grid
The ability-cell section of `PassiveGridSider` SHALL replace the flat list with a `HexAbilityGrid` component. The grid SHALL derive cell positions from `IAbilityPanel` `x`/`y`/`z` coordinates, cell colours from `EAbilityType`, and tooltip descriptions from the resolved stat/move/passive label.

#### Scenario: Grid renders instead of flat list
- **WHEN** the `PassiveGridSider` is rendered for a trainer with ability panel data
- **THEN** the ability-cell section SHALL render a `HexAbilityGrid` component instead of a list of `div` rows

#### Scenario: MOVE_HEAL cell is red
- **WHEN** an ability panel cell has `ability.type === EAbilityType.MOVE_HEAL`
- **THEN** the corresponding hex cell SHALL have `cellColor === 'red'`

#### Scenario: PINCH_HEAL cell is yellow
- **WHEN** an ability panel cell has `ability.type === EAbilityType.PINCH_HEAL`
- **THEN** the corresponding hex cell SHALL have `cellColor === 'yellow'`

#### Scenario: Tooltip shows stat description
- **WHEN** a cell represents a stat boost (e.g. ATK +5)
- **THEN** hovering over the hex cell SHALL show `"ATK +5"` in the tooltip

#### Scenario: Tooltip shows passive name
- **WHEN** a cell has a resolved `passiveName` (e.g. `"Healing Sun 1"`)
- **THEN** hovering over the hex cell SHALL show that passive name in the tooltip

## MODIFIED Requirements

### Requirement: IAbilityCellDisplay includes coordinates and colour
`IAbilityCellDisplay` SHALL include `x: number`, `y: number`, `z: number`, `cellColor?: 'red' | 'yellow'`, and `description?: string` fields populated by `genAbilityCellDisplayList`.

#### Scenario: Coordinates populated from panel data
- **WHEN** `genAbilityCellDisplayList` processes a trainer's panels
- **THEN** each returned `IAbilityCellDisplay` SHALL have `x`, `y`, `z` matching the source `IAbilityPanel`

#### Scenario: Description built from ability data
- **WHEN** a cell has a stat value (e.g. ATK type, value 5)
- **THEN** `description` SHALL be `"ATK +5"`

#### Scenario: Description built from move name
- **WHEN** a cell has a resolved `moveName`
- **THEN** `description` SHALL equal the resolved move name

#### Scenario: Description built from passive name
- **WHEN** a cell has a resolved `passiveName`
- **THEN** `description` SHALL equal the resolved passive name
