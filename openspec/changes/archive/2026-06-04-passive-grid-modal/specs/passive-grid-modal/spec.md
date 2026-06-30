## ADDED Requirements

### Requirement: PassiveGridModal component exists
`src/components/passive-grid-modal/index.tsx` SHALL export a `PassiveGridModal` component that accepts `pairFieldName: number` as a prop and renders an Ant Design `Modal`.

#### Scenario: Modal renders without crashing
- **WHEN** `PassiveGridModal` is mounted with a valid `pairFieldName`
- **THEN** it SHALL render without errors

### Requirement: Modal is opened from the pair toolbar
`DataColList` SHALL render a "VIEW PASSIVE/GRID" button between the Moves `InputNumber` and the `TotalDamageDisplay`.

#### Scenario: Button opens modal
- **WHEN** the user clicks "VIEW PASSIVE/GRID"
- **THEN** the `PassiveGridModal` for that pair SHALL become visible

### Requirement: Default passives are displayed in the modal
The modal SHALL display the pair's default passives (derived from `genPassiveList`) in a collapsed `Collapse` panel labeled "Passives".

#### Scenario: Default passives list renders
- **WHEN** the modal is opened for a pair with a trainer selected
- **THEN** each default passive SHALL be shown with its resolved name

#### Scenario: Tooltip shown for passives with descriptions
- **WHEN** a default passive has child descriptions
- **THEN** a tooltip icon SHALL appear beside the passive name

### Requirement: Regional passives render with a region-members Select
Any default passive identified as regional (via `passiveHasRegionTag`) SHALL render an inline `Select` beside its name with options `[1, 2, 3]` and an initial value of `1`.

#### Scenario: Region members Select appears for regional passive
- **WHEN** a default passive is regional
- **THEN** a `Select` with options 1, 2, 3 SHALL appear beside it in the modal

#### Scenario: Region members Select initial value is 1
- **WHEN** the modal is opened and no prior state exists for this pair
- **THEN** the regional passive Select SHALL default to `1`

#### Scenario: Region members value is stored per passive
- **WHEN** the user changes the region-members Select for a passive
- **THEN** the new value SHALL be reflected in `passiveStore.pairPassiveState` under `regionMembers` for that pair on modal close

### Requirement: Passives with conditional parameters render an InputNumber
Passives whose ID matches an entry in `CONDITIONAL_PASSIVE_INPUTS` (e.g. `RISING_TIDE`, `GOOD_FORM`) SHALL render an inline `InputNumber` with the configured `min`, `max`, and `label`.

#### Scenario: Conditional InputNumber appears for RISING_TIDE
- **WHEN** a trainer's default passives include `RISING_TIDE`
- **THEN** an `InputNumber` labeled "Atk stacks" with `min=1 max=6` SHALL appear beside it

#### Scenario: Conditional InputNumber appears for GOOD_FORM
- **WHEN** a trainer's default passives include `GOOD_FORM`
- **THEN** an `InputNumber` labeled "Raised stats" with `min=1 max=41` SHALL appear beside it

#### Scenario: Conditional param is stored on modal close
- **WHEN** the user changes a conditional InputNumber and closes the modal
- **THEN** the value SHALL be saved to `passiveStore.pairPassiveState[pairFieldName].conditionalParams`

### Requirement: Extra passives can be added and removed
The modal SHALL include an "Extra Passives" section with a `+` button to add rows and a delete icon per row. Each row SHALL contain a `Select` populated from the global passive list.

#### Scenario: Adding an extra passive
- **WHEN** the user clicks the add button
- **THEN** a new empty passive selector row SHALL appear

#### Scenario: Removing an extra passive
- **WHEN** the user clicks the delete icon on a row
- **THEN** that row SHALL be removed

### Requirement: Modal state is committed on OK and on close
Clicking the modal's OK button or closing the modal (X button or overlay click) SHALL both commit the current draft state to `passiveStore.setPairPassiveState(pairFieldName, state)`.

#### Scenario: State saved on OK
- **WHEN** the user clicks OK
- **THEN** `passiveStore.pairPassiveState` SHALL reflect the current modal values

#### Scenario: State saved on close
- **WHEN** the user closes the modal via the X or overlay
- **THEN** `passiveStore.pairPassiveState` SHALL reflect the current modal values

### Requirement: passiveStore state is cleared when a pair is removed
When a `DataColList` unmounts, `passiveStore.clearPairPassiveState(pairFieldName)` SHALL be called to remove stale state.

#### Scenario: State cleared on unmount
- **WHEN** a pair is deleted and its `DataColList` unmounts
- **THEN** `passiveStore.pairPassiveState` SHALL no longer contain an entry for that `pairFieldName`
