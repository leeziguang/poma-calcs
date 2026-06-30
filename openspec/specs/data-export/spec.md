## ADDED Requirements

### Requirement: JSON snapshot download
The system SHALL allow the user to download the current full calculator state as a `.json` file. The downloaded file SHALL contain a valid `ISavedSession` object (same shape as a named session) and be named `poma-calcs-<timestamp>.json`.

#### Scenario: Export JSON
- **WHEN** the user clicks "Export JSON" in the session toolbar
- **THEN** the system SHALL serialize the current state and trigger a browser file download of a `.json` file containing the full session snapshot

#### Scenario: JSON file includes all state
- **WHEN** the JSON file is opened
- **THEN** it SHALL contain `version`, `name`, `savedAt`, `config`, `formValues`, `pairNames`, `activeKey`, and `pairStores` fields

### Requirement: JSON snapshot import
The system SHALL allow the user to upload a previously exported `.json` file to restore its state. The import SHALL behave identically to loading a named session.

#### Scenario: Valid JSON file uploaded
- **WHEN** the user selects a `.json` file via the file-picker in the session toolbar and the file contains a valid `ISavedSession` object
- **THEN** the system SHALL restore the full calculator state from the file and display a success toast ("Session imported")

#### Scenario: Invalid or malformed JSON file uploaded
- **WHEN** the user selects a file whose contents cannot be parsed as a valid `ISavedSession`
- **THEN** the system SHALL display an error toast ("Invalid session file — could not import") and leave the current state unchanged

#### Scenario: Import prompts confirmation when unsaved changes exist
- **WHEN** the user uploads a JSON file while the current state has unsaved changes relative to the active named session
- **THEN** the system SHALL show a confirmation dialog ("Import will replace current session. Continue?") before restoring

### Requirement: TSV export for Google Sheets
The system SHALL allow the user to download the current damage results as a tab-separated values (TSV) file. The file SHALL contain one header row and one data row per pair tab, covering: pair name, trainer name, monster name, move name, base stat, move power, field effect multiplier, and final damage.

#### Scenario: Export TSV
- **WHEN** the user clicks "Export TSV" in the session toolbar
- **THEN** the system SHALL build a TSV table from the current pair tabs and trigger a browser download of a `.tsv` file named `poma-calcs-<timestamp>.tsv`

#### Scenario: TSV includes header row
- **WHEN** the exported TSV file is opened or imported into Google Sheets
- **THEN** the first row SHALL contain column headers: `Pair`, `Trainer`, `Monster`, `Move`, `Base Stat`, `Move Power`, `Field Effect`, `Final Damage`

#### Scenario: TSV row per pair tab
- **WHEN** there are N pair tabs open
- **THEN** the TSV SHALL contain N data rows (excluding header), one per tab, in tab order

#### Scenario: Empty damage values shown as zero
- **WHEN** a pair tab has no damage calculation yet (e.g. no trainer selected)
- **THEN** the corresponding TSV row SHALL show `0` for numeric fields rather than blank or undefined

### Requirement: Export buttons placement
Export controls (Export JSON, Export TSV, Import JSON) SHALL be grouped in the `SessionToolbar` component, visually distinct from session save/load controls.

#### Scenario: Export buttons visible in toolbar
- **WHEN** the calculator is loaded with at least one pair tab
- **THEN** the session toolbar SHALL display "Export JSON", "Export TSV", and "Import" buttons
