## ADDED Requirements

### Requirement: Autosave captures all pair state
The system SHALL write an autosave snapshot to localStorage whenever form values, config, passive states, or grid cell selections change. The snapshot SHALL include `pairStores`, `passiveStates`, and `gridCellIds` for all current pairs.

#### Scenario: Form value change triggers autosave
- **WHEN** the user changes any form field (monster, trainer, level, move, data column)
- **THEN** the system writes an autosave snapshot within 500ms

#### Scenario: Passive state change triggers autosave
- **WHEN** the user changes any passive skill selection or grid cell
- **THEN** the system writes an autosave snapshot within 500ms

#### Scenario: Config change triggers autosave
- **WHEN** the user changes enemy def or custom mode toggle
- **THEN** the system writes an autosave snapshot within 500ms

### Requirement: Autosave is suppressed during restore
The system SHALL NOT write an autosave snapshot while a session restore is in progress (between `applySessionState` being called and the hydrate effect completing).

#### Scenario: Form value change during restore is ignored
- **WHEN** `applySessionState` calls `form.setFieldsValue` triggering `onValuesChange`
- **THEN** the autosave debounce SHALL NOT fire until the hydrate effect completes

#### Scenario: Autosave resumes after restore
- **WHEN** the hydrate effect finishes applying `pairStores` and `passiveStates`
- **THEN** the system writes one autosave snapshot with the fully restored state
- **AND** subsequent user changes trigger autosave normally

### Requirement: Session restore is lossless for passive state
The system SHALL restore `passiveStates` and `gridCellIds` to the correct pairs after a save/load round-trip.

#### Scenario: Named session load restores passive state
- **WHEN** the user saves a session with pairs that have passive selections
- **AND** the user loads that session
- **THEN** each pair SHALL have the same passive state as when it was saved

#### Scenario: Autosave restore restores passive state
- **WHEN** the app is reloaded with an existing autosave slot containing passive state
- **THEN** each pair SHALL have the same passive state as before the reload

### Requirement: Named session save/load round-trip
The system SHALL preserve all session data across a manual save and load cycle.

#### Scenario: Save then load produces identical state
- **WHEN** the user saves a session by name
- **AND** loads that session via the load dropdown
- **THEN** all form values, pair names, active tab, passive states, and grid selections SHALL match the saved state

### Requirement: Session JSON schema is stable
The system SHALL use `ISavedSession` version 1 for all saves. No schema migration SHALL be required.

#### Scenario: Existing autosave slot is loadable after deploy
- **WHEN** a user has an autosave slot written before this change
- **AND** the app is deployed with this change
- **THEN** the autosave slot SHALL load without error
