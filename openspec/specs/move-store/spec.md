### Requirement: Move types are defined
`src/types/move.ts` SHALL export an `EMoveFields` enum with all move entry fields, an `IMove` interface typed via that enum, an `IMoveApiResponse` interface with `entries: IMove[]`, and no other types.

#### Scenario: All fields from Move.json are covered
- **WHEN** the Move.json API returns an entry
- **THEN** every field (`moveId`, `category`, `u3`, `user`, `group`, `type`, `target`, `u8`, `gaugeDrain`, `power`, `accuracy`, `uses`, `tags`) SHALL be accessible via the typed interface

### Requirement: Move service fetches from correct endpoints
`src/service/move.ts` SHALL export `fetchMove(): Promise<IMoveApiResponse>` and `fetchMoveNamesEn(): Promise<Record<string, string>>` pointing to the correct API URLs.

#### Scenario: fetchMove resolves entries array
- **WHEN** `fetchMove()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/proto/Move.json` and return the parsed JSON

#### Scenario: fetchMoveNamesEn resolves name map
- **WHEN** `fetchMoveNamesEn()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/lsd/move_name_en.json` and return the parsed JSON

### Requirement: MoveStore manages move state
`src/store/move.ts` SHALL export a `MoveStore` class and a singleton `moveStore`. The store SHALL have `moves: IMove[]` and `moveNamesEn: Record<string, string>` as MobX observables, corresponding `setMoves` and `setMoveNamesEn` actions, `getMoves` and `getMoveNamesEn` getter methods, `initApiCalls` to trigger all fetches, and `reset` to restore initial state.

#### Scenario: initApiCalls triggers all fetches
- **WHEN** `moveStore.initApiCalls()` is called
- **THEN** both `getMoves` and `getMoveNamesEn` SHALL be invoked

#### Scenario: reset clears state
- **WHEN** `moveStore.reset()` is called
- **THEN** `moves` SHALL be `[]` and `moveNamesEn` SHALL be `{}`

## ADDED Requirements

### Requirement: AbilityStore is initialized alongside other stores
The container (`src/container/index.tsx`) SHALL call `abilityStore.initApiCalls()` in the startup `Promise.all` alongside `trainerStore`, `monsterStore`, `moveStore`, and `passiveStore`.

#### Scenario: All stores initialize together on app load
- **WHEN** the app container mounts and triggers its init sequence
- **THEN** `abilityStore.initApiCalls()` SHALL be included in the `Promise.all` call so all stores load in parallel
