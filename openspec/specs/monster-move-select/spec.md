## ADDED Requirements

### Requirement: Move Select replaces free-text Move Name input in normal mode
In non-custom mode, the Move Name `<Input>` + **Add** button in `DataColList` SHALL be replaced by an Ant Design `<Select>` showing the selected monster's 4 moves. Each option SHALL display the English move name as label and carry the move's base power as metadata.

#### Scenario: Move Select shows 4 options for the selected monster
- **WHEN** a pair tab is added with a selected trainer/monster and Custom Mode is off
- **THEN** the add-move bar shows a Select with up to 4 options, each labeled with `moveNamesEn[moveId]` and falling back to the raw move ID string if the name is not found

#### Scenario: Move Select option shows base power metadata
- **WHEN** the user opens the Move Select dropdown
- **THEN** each option's label includes the English move name; the move's base power from `moveStore.moves` is accessible as option metadata for pre-filling on add

#### Scenario: Move Select is absent when no monster is selected
- **WHEN** no trainer/monster pair has been added (no monsterId in form state)
- **THEN** the add-move bar is not rendered (or renders without options)

### Requirement: Selecting a move and clicking Add pre-fills Base Power
When the user selects a move from the Select and clicks **Add**, a new data column SHALL be created with:
- Column title set to the selected move's English name
- `EMovePowerFormFields.BASE_MOVE` pre-filled with `IMove.power` for the selected move

#### Scenario: Add with move selected pre-fills Base Power
- **WHEN** the user picks a move from the Select and clicks Add
- **THEN** a new column is created with the move name as title and the Base Power InputNumber set to the move's `power` value

#### Scenario: Add with no move selected is disabled
- **WHEN** the Move Select has no option chosen
- **THEN** the Add button is disabled (or no action is taken on click)

### Requirement: Free-text Move Name input is shown in Custom Mode
In Custom Mode the original `<Input placeholder="Move Name" />` + **Add** button SHALL be shown instead of the Move Select, giving the user full control over column naming and Base Power.

#### Scenario: Free-text input visible in Custom Mode
- **WHEN** Custom Mode is enabled
- **THEN** the add-move bar renders the plain text Input and Add button, not the Move Select

#### Scenario: Move Select hidden in Custom Mode
- **WHEN** Custom Mode is enabled
- **THEN** the Move Select is not rendered

### Requirement: ITrainerOption carries move IDs for the selected monster
`ITrainerOption` in `src/store/trainer.ts` SHALL include `move1Id`, `move2Id`, `move3Id`, `move4Id` fields (typed as `number | undefined`) populated from the monster's `moveNChangeId` fields in `monsterStore`.

#### Scenario: Trainer option includes move IDs after init
- **WHEN** the app finishes loading and `setTrainerOptionsList` is called in the container
- **THEN** each `ITrainerOption` has `move1Id`–`move4Id` set to the corresponding `IMonster.move1ChangeId`–`move4ChangeId` values, or `undefined` if the monster is not found

### Requirement: Move IDs are stored in form state per tab
The four move IDs (`move1Id`–`move4Id`) for the selected monster SHALL be written into the Ant Design form at `EPairListFormFields.PAIR[pairFieldName].MOVE{N}_ID` when Add Pair is clicked, so `DataColList` can read them via `Form.useWatch` without a monsterStore dependency.

#### Scenario: Move IDs available to DataColList via Form.useWatch
- **WHEN** a pair tab is added with a selected monster
- **THEN** `Form.useWatch([EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVE1_ID])` (and MOVE2–MOVE4) returns the correct move ID numbers in `DataColList`
