## Requirements

### Requirement: PassiveGridModal component exists
`src/components/passive-grid-modal/index.tsx` SHALL export a `PassiveGridModal` component that accepts `pairFieldName: number` as a prop and renders an Ant Design `Drawer` (placement `right`, width `480`).

#### Scenario: Drawer renders without crashing
- **WHEN** `PassiveGridModal` is mounted with a valid `pairFieldName`
- **THEN** it SHALL render without errors

#### Scenario: Drawer opens from the right
- **WHEN** the user clicks the trigger button in the pair toolbar
- **THEN** the `PassiveGridModal` Drawer SHALL slide in from the right side of the viewport

### Requirement: Drawer is opened from the pair toolbar
`DataColList` SHALL render a "VIEW PASSIVE/GRID" button between the Moves `InputNumber` and the `TotalDamageDisplay`.

#### Scenario: Button opens drawer
- **WHEN** the user clicks "VIEW PASSIVE/GRID"
- **THEN** the `PassiveGridModal` Drawer for that pair SHALL become visible

### Requirement: Default passives are displayed in the drawer
The drawer SHALL display the pair's default passives (derived from `genPassiveList`) in a collapsed `Collapse` panel labeled "Passives".

#### Scenario: Default passives list renders
- **WHEN** the drawer is opened for a pair with a trainer selected
- **THEN** each default passive SHALL be shown with its resolved name

#### Scenario: Tooltip shown for passives with descriptions
- **WHEN** a default passive has child descriptions
- **THEN** a tooltip icon SHALL appear beside the passive name

### Requirement: Regional passives render with a region-members Select
Any default passive identified as regional (via `passiveHasRegionTag`) SHALL render an inline `Select` beside its name with options `[1, 2, 3]` and an initial value of `1`.

#### Scenario: Region members Select appears for regional passive
- **WHEN** a default passive is regional
- **THEN** a `Select` with options 1, 2, 3 SHALL appear beside it in the drawer

#### Scenario: Region members Select initial value is 1
- **WHEN** the drawer is opened and no prior state exists for this pair
- **THEN** the regional passive Select SHALL default to `1`

#### Scenario: Region members value is stored per passive
- **WHEN** the user changes the region-members Select for a passive
- **THEN** the new value SHALL be reflected in `passiveStore.pairPassiveState` under `regionMembers` for that pair on drawer close

### Requirement: Passives with conditional parameters render an InputNumber
Passives whose ID matches an entry in `CONDITIONAL_PASSIVE_INPUTS` (e.g. `RISING_TIDE`, `GOOD_FORM`) SHALL render an inline `InputNumber` with the configured `min`, `max`, and `label`.

#### Scenario: Conditional InputNumber appears for RISING_TIDE
- **WHEN** a trainer's default passives include `RISING_TIDE`
- **THEN** an `InputNumber` labeled "Atk stacks" with `min=1 max=6` SHALL appear beside it

#### Scenario: Conditional InputNumber appears for GOOD_FORM
- **WHEN** a trainer's default passives include `GOOD_FORM`
- **THEN** an `InputNumber` labeled "Raised stats" with `min=1 max=41` SHALL appear beside it

#### Scenario: Conditional param is stored on drawer close
- **WHEN** the user changes a conditional InputNumber and closes the drawer
- **THEN** the value SHALL be saved to `passiveStore.pairPassiveState[pairFieldName].conditionalParams`

### Requirement: Extra passives can be added and removed
The drawer SHALL include an "Extra Passives" section with a `+` button to add rows and a delete icon per row. Each row SHALL contain a `Select` populated from the global passive list.

#### Scenario: Adding an extra passive
- **WHEN** the user clicks the add button
- **THEN** a new empty passive selector row SHALL appear

#### Scenario: Removing an extra passive
- **WHEN** the user clicks the delete icon on a row
- **THEN** that row SHALL be removed

### Requirement: Drawer state is committed on close
Closing the Drawer (X button or overlay click) SHALL commit the current draft state to `passiveStore.setPairPassiveState(pairFieldName, state)`.

#### Scenario: State commits on Drawer close
- **WHEN** the user closes the Drawer (X button or overlay click)
- **THEN** `passiveStore.setPairPassiveState(pairFieldName, draft)` SHALL be called, committing the current drawer values

### Requirement: passiveStore state is cleared when a pair is removed
When a `DataColList` unmounts, `passiveStore.clearPairPassiveState(pairFieldName)` SHALL be called to remove stale state.

#### Scenario: State cleared on unmount
- **WHEN** a pair is deleted and its `DataColList` unmounts
- **THEN** `passiveStore.pairPassiveState` SHALL no longer contain an entry for that `pairFieldName`

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
