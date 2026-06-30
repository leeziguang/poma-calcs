## ADDED Requirements

### Requirement: Auto-save state on change
The system SHALL automatically serialize the full calculator state (form values, pair names, active tab key, per-tab damage store records, and `configStore` settings) to `localStorage` under the key `poma-calcs:auto` whenever any field changes. Saves SHALL be debounced to at most once every 500 ms to avoid excessive writes.

#### Scenario: Form field change triggers auto-save
- **WHEN** the user edits any form field (trainer, monster, move, base stats, move power, field effects, level, move level)
- **THEN** the system SHALL write the serialized state to `localStorage['poma-calcs:auto']` within 500 ms of the last change

#### Scenario: Config change triggers auto-save
- **WHEN** the user changes `enemyDef` or `isCustomMode` in `configStore`
- **THEN** the system SHALL include the updated config in the next debounced auto-save write

#### Scenario: Pair tab added or removed triggers auto-save
- **WHEN** the user adds or removes a pair tab
- **THEN** the system SHALL write the updated state (including the new tab count and names) to auto-save within 500 ms

### Requirement: Restore auto-saved state on page load
The system SHALL restore the auto-saved session from `localStorage['poma-calcs:auto']` when the page loads, after all API data has finished loading. If no auto-save exists the app SHALL start in the default empty state.

#### Scenario: Auto-save present on load
- **WHEN** the page loads and `localStorage['poma-calcs:auto']` contains a valid `ISavedSession` object
- **THEN** the system SHALL call `form.setFieldsValue` with the saved form values, restore `pairNames`, restore `activeKey`, and hydrate each per-tab `PairStore` with its saved `moveDamageRec`, and restore `configStore.enemyDef` and `configStore.isCustomMode`

#### Scenario: No auto-save on load
- **WHEN** the page loads and `localStorage['poma-calcs:auto']` is absent or empty
- **THEN** the system SHALL start with a single empty pair tab and default `configStore` values, identical to the current (pre-feature) behaviour

#### Scenario: Corrupt or unreadable auto-save data
- **WHEN** the page loads and `localStorage['poma-calcs:auto']` contains data that cannot be parsed or whose `version` field is unrecognized
- **THEN** the system SHALL discard the stored value, show a brief toast warning ("Could not restore last session"), and start in the default empty state

#### Scenario: Restore respects API-loaded option lists
- **WHEN** the auto-save contains a `TRAINER_ID` that has been loaded into `trainerStore.trainerOptionsList`
- **THEN** the restored form field SHALL display the correct trainer name

### Requirement: Named session save
The system SHALL allow users to save the current calculator state as a named session. Named sessions SHALL be stored in `localStorage['poma-calcs:sessions']` as a record keyed by session name, separate from the auto-save slot.

#### Scenario: Save new named session
- **WHEN** the user enters a session name in the session toolbar and confirms save
- **THEN** the system SHALL write the current full state snapshot under that name in `localStorage['poma-calcs:sessions']` and display the name as the active session

#### Scenario: Overwrite existing session
- **WHEN** the user saves using a name that already exists in the sessions record
- **THEN** the system SHALL overwrite the existing entry with the current state and update the `savedAt` timestamp

#### Scenario: Session name is empty
- **WHEN** the user attempts to save with an empty name
- **THEN** the system SHALL prevent the save and display an inline validation message ("Session name cannot be empty")

### Requirement: Named session load
The system SHALL allow users to load any previously saved named session from a dropdown in the session toolbar. Loading SHALL replace all current form state and store state.

#### Scenario: Load selected session
- **WHEN** the user selects a named session from the session dropdown and confirms load
- **THEN** the system SHALL fully restore that session's state (form values, pair names, active tab, per-tab stores, config) in the same manner as auto-restore on page load

#### Scenario: Load prompts confirmation when unsaved changes exist
- **WHEN** the user attempts to load a named session while the current state differs from the active named session (or no named session is active)
- **THEN** the system SHALL show a confirmation dialog ("Load session? Unsaved changes will be lost.") before proceeding

### Requirement: Named session delete
The system SHALL allow users to delete any saved named session from the session toolbar.

#### Scenario: Delete named session
- **WHEN** the user selects a session and confirms delete
- **THEN** the system SHALL remove that entry from `localStorage['poma-calcs:sessions']` and remove it from the dropdown list

#### Scenario: Delete requires confirmation
- **WHEN** the user clicks delete for a session
- **THEN** the system SHALL display a confirmation prompt before deleting

### Requirement: localStorage quota error handling
The system SHALL handle `QuotaExceededError` thrown by `localStorage.setItem` without crashing.

#### Scenario: Storage quota exceeded on auto-save
- **WHEN** a write to `localStorage` throws `QuotaExceededError`
- **THEN** the system SHALL display a toast notification ("Storage full — delete saved sessions to free space") and continue operating without crashing

### Requirement: Saved session schema versioning
Every saved session object SHALL include a `version: number` field set to `1` for this implementation. The restore logic SHALL check this field and discard (with warning) any session whose version is not recognized.

#### Scenario: Version 1 session loads correctly
- **WHEN** a session with `version: 1` is read from localStorage
- **THEN** the system SHALL restore it without any migration step

#### Scenario: Unknown version is discarded
- **WHEN** a session with `version: 99` (or any unrecognized value) is found
- **THEN** the system SHALL discard it and show a toast ("Session format not supported — please re-save")
