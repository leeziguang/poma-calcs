## ADDED Requirements

### Requirement: Raw Stat auto-populates from selected monster at current level
When a pair tab is added with a selected trainer/monster, the Raw Stat field in the Base Stat collapse SHALL display the monster's `atkValues[level - 140]` value. The field SHALL update reactively whenever the Level InputNumber changes.

#### Scenario: Raw Stat populates on pair add
- **WHEN** a user selects a trainer/monster from the dropdown and clicks Add Pair
- **THEN** the Raw Stat field in the Base Stat collapse shows the monster's `atkValues[level - 140]` for the default level of 140

#### Scenario: Raw Stat updates when level changes
- **WHEN** the user changes the Level InputNumber from 140 to any value in 141–200
- **THEN** the Raw Stat field updates to `atkValues[level - 140]` for the same monster

#### Scenario: Raw Stat is blank when stat index out of bounds
- **WHEN** `level - 140` exceeds the length of the monster's `atkValues` array
- **THEN** the Raw Stat field is left blank (no value displayed)

### Requirement: Raw Stat is non-editable in normal mode
In non-custom mode, the Raw Stat field SHALL render as a disabled InputNumber so the autofilled value cannot be overwritten.

#### Scenario: Raw Stat is disabled in normal mode
- **WHEN** Custom Mode is off
- **THEN** the Raw Stat InputNumber is rendered with `disabled={true}` and shows the auto-populated value

### Requirement: Raw Stat is fully editable in Custom Mode
In Custom Mode the Raw Stat field SHALL revert to a normal editable InputNumber with no auto-population.

#### Scenario: Raw Stat is editable in Custom Mode
- **WHEN** the user enables Custom Mode via the checkbox
- **THEN** the Raw Stat InputNumber becomes editable and retains its current value (autofill is not applied)

#### Scenario: Switching to Custom Mode does not reset the Raw Stat value
- **WHEN** the user toggles Custom Mode on after autofill has populated the Raw Stat
- **THEN** the field remains editable with the previously autofilled value still shown (no data is lost)

### Requirement: Monster identity is stored in form state
The selected `monsterId` SHALL be written into the Ant Design form at `EPairListFormFields.PAIR[pairFieldName].MONSTER_ID` when Add Pair is clicked, so any descendant component can access it via `Form.useWatch`.

#### Scenario: monsterId is available to BaseStats via Form.useWatch
- **WHEN** a pair tab is added with a selected monster
- **THEN** `Form.useWatch([EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MONSTER_ID])` returns the correct monsterId string in the BaseStats component
