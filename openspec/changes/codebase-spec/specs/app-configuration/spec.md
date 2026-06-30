## ADDED Requirements

### Requirement: Enemy defense setting
The system SHALL provide a global enemy defense input in the topbar. The value SHALL default to 50 and SHALL be a non-negative integer. Changing this value SHALL immediately affect the `baseStat` calculation of all move columns across all pairs.

#### Scenario: Default enemy defense
- **WHEN** the app first loads
- **THEN** the enemy defense input SHALL show 50

#### Scenario: Changing enemy defense propagates to all pairs
- **WHEN** the user changes the enemy defense value to N
- **THEN** all move columns across all pairs SHALL recalculate their baseStat using N as the new enemyDef

#### Scenario: Enemy defense cannot be negative
- **WHEN** the user enters a value below 0
- **THEN** the input SHALL enforce a minimum of 0

### Requirement: Custom mode toggle
The system SHALL provide a Custom Mode checkbox in the topbar. When enabled, pair tabs and move column titles become inline-editable. When disabled, editing is not available and default names are used.

#### Scenario: Enable custom mode
- **WHEN** the user checks the Custom Mode checkbox
- **THEN** pair tab labels and column titles SHALL become clickable for renaming

#### Scenario: Disable custom mode
- **WHEN** the user unchecks the Custom Mode checkbox
- **THEN** pair tab labels and column titles SHALL revert to non-editable display mode

### Requirement: Trainer data loading
On application mount, the system SHALL fetch trainer data from four external endpoints in parallel and store the results in TrainerStore:
- `Trainer.json` → `trainers: ITrainer[]` (full trainer roster with moves, passives, type, rarity, role)
- `TrainerBase.json` → `trainerBase: ITrainerBasePicked[]` (id mapped to `trainerBaseId`, plus `trainerNameId`)
- `trainer_name_en.json` → `trainerNamesEn: Record<string, string>` (short trainer names keyed by name ID)
- `trainer_verbose_name_en.json` → `verboseTrainerNamesEn: Record<string, string>` (full trainer names keyed by name ID)

#### Scenario: Trainer APIs called on mount
- **WHEN** the application initialises
- **THEN** `TrainerStore.initApiCalls()` SHALL be invoked, triggering all four fetches concurrently

### Requirement: Trainer selection dropdown
The system SHALL provide a searchable trainer dropdown in the topbar. Its options come from `trainerStore.trainerOptionsList`, a MobX observable array set by the container after all trainer and monster APIs finish loading. Each option is `{ label: "${trainerName} & ${monsterName}", value: "${trainerName} & ${monsterName}", monsterId, monsterBaseId }`, deduplicated by `value`. Verbose trainer names take precedence over short names. Selecting a trainer is required before adding a pair.

#### Scenario: Trainer dropdown populated after all APIs load
- **WHEN** all trainer and monster APIs have resolved at app init
- **THEN** the container calls `trainerStore.setTrainerOptionsList(...)` with options combining trainer name and monster name

#### Scenario: Trainer dropdown searches by display name
- **WHEN** the user types in the trainer dropdown
- **THEN** the dropdown SHALL filter options by label (trainer + monster name), not by value

#### Scenario: Add pair button disabled until trainer selected
- **WHEN** no trainer is selected
- **THEN** the Add Pair button SHALL be disabled

#### Scenario: Add pair enabled after trainer selected
- **WHEN** a trainer is selected from the dropdown
- **THEN** the Add Pair button SHALL become enabled

### Requirement: Config reset on unmount
The system SHALL reset ConfigStore to its defaults (enemyDef = 50, isCustomMode = false) when the topbar action component unmounts.

#### Scenario: Config resets on unmount
- **WHEN** the ActionTopbar component unmounts
- **THEN** ConfigStore.reset() SHALL be called, restoring default values
