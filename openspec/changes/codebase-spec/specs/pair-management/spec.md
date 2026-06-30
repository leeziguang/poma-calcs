## ADDED Requirements

### Requirement: Creating a pair
The system SHALL allow the user to add a new pair tab. Adding a pair requires a trainer to be selected from the trainer dropdown. Each pair is initialised with an empty move-column list and a default level of 140.

#### Scenario: Add pair button disabled without trainer
- **WHEN** no trainer is selected in the topbar
- **THEN** the Add Pair button SHALL be disabled

#### Scenario: Add pair with trainer selected
- **WHEN** a trainer is selected and the user clicks Add Pair
- **THEN** a new tab SHALL appear with a default pair name and no move columns
- **THEN** the new pair's level SHALL be initialised to 140 and move level to 1 at creation time, so the tab label displays them immediately without waiting for the form to mount

### Requirement: Removing a pair
The system SHALL allow the user to remove any existing pair tab. Removing the last pair SHALL leave the tab list empty.

#### Scenario: Remove pair via tab close button
- **WHEN** the user clicks the close (×) icon on a pair tab
- **THEN** that pair and all its move columns SHALL be removed

### Requirement: Renaming a pair
In custom mode, the system SHALL allow the user to rename a pair by clicking its tab label and editing the inline input.

#### Scenario: Rename pair in custom mode
- **WHEN** custom mode is active and the user clicks a pair's tab label
- **THEN** an editable input SHALL appear pre-filled with the current name
- **THEN** pressing Enter or blurring the input SHALL commit the new name

#### Scenario: Rename not available outside custom mode
- **WHEN** custom mode is inactive
- **THEN** clicking the pair tab label SHALL NOT open an edit input

### Requirement: Move column lifecycle
Each pair SHALL support a dynamic list of move columns. The user can add columns by entering a name and clicking Add, duplicate an existing column, and delete any column.

#### Scenario: Add move column
- **WHEN** the user enters a name in the column name input and clicks the Add button
- **THEN** a new move column SHALL appear with the entered name and default values (stat boost +6, all other fields at their defaults)

#### Scenario: Duplicate move column
- **WHEN** the user clicks the Duplicate icon on a move column
- **THEN** a new column SHALL appear immediately after the duplicated column with identical values and the same name

#### Scenario: Delete move column
- **WHEN** the user clicks the Delete icon on a move column
- **THEN** that column SHALL be removed and the pair's totalDamage SHALL update accordingly

### Requirement: Renaming a move column
In custom mode, the system SHALL allow the user to rename a move column by clicking its title.

#### Scenario: Rename column in custom mode
- **WHEN** custom mode is active and the user clicks a column title
- **THEN** an editable input SHALL appear pre-filled with the current column name
- **THEN** blurring or pressing Enter SHALL commit the new name

### Requirement: Pair level and move level selection
Each pair SHALL have an independently configurable level (140–200) and a move level (1, 2, 3, 4, 5, SA 1, SA 2, SA 3, SA 4, SA 5). Both values affect all move columns within the pair.

#### Scenario: Changing pair level updates calculations
- **WHEN** the user changes the pair's level value
- **THEN** all move columns in that pair SHALL recalculate their baseStat with the new level context

#### Scenario: Changing move level updates calculations
- **WHEN** the user changes the pair's move level
- **THEN** all move columns SHALL recalculate movePower and baseStat using the new move-level multipliers
