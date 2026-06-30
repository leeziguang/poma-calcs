## ADDED Requirements

### Requirement: AbilityStore is initialized alongside other stores
The container (`src/container/index.tsx`) SHALL call `abilityStore.initApiCalls()` in the startup `Promise.all` alongside `trainerStore`, `monsterStore`, `moveStore`, and `passiveStore`.

#### Scenario: All stores initialize together on app load
- **WHEN** the app container mounts and triggers its init sequence
- **THEN** `abilityStore.initApiCalls()` SHALL be included in the `Promise.all` call so all stores load in parallel
