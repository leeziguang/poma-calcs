### Requirement: Monster types defined
`src/types/monster.ts` SHALL export TypeScript interfaces and enums that exactly match the Monster.json, MonsterBase.json, and monster_name_en.json API shapes, plus an enum `EMonsterFields` and `EMonsterBaseFields` for field name constants, and response wrapper interfaces `IMonsterApiResponse` and `IMonsterBaseApiResponse`.

#### Scenario: Monster interface covers all stat arrays
- **WHEN** a developer imports `IMonster` from `src/types/monster.ts`
- **THEN** the interface SHALL have `hpValues`, `atkValues`, `defValues`, `spaValues`, `spdValues`, `speValues` typed as `number[]`, plus `monsterId` as `string`, `monsterBaseId` and `syncMoveId` as `number`, and `move1ChangeId` through `move4ChangeId` as `number`

#### Scenario: MonsterBase interface covers identity fields
- **WHEN** a developer imports `IMonsterBase` from `src/types/monster.ts`
- **THEN** the interface SHALL include `monsterBaseId` (number), `actorId` (string), `actorNumber` (number), `actorVariant` (number), `gender` (number), `strength` (number), `formPassiveId` (number), `formId` (number), `monsterNameId` (number), `isShiny` (boolean), and opaque `u5`, `u7`, `u9`, `u11`, `u13`, `u14` fields typed as `number`, plus `jpName` as `string`

#### Scenario: API response wrappers present
- **WHEN** a developer imports `IMonsterApiResponse` or `IMonsterBaseApiResponse`
- **THEN** each SHALL have an `entries` array of the corresponding item interface

### Requirement: Monster service functions complete
`src/service/monster.ts` SHALL export `fetchMonster`, `fetchMonsterBase`, and `fetchMonsterNamesEn`, each returning a typed Promise that resolves to the respective API response type.

#### Scenario: fetchMonsterBase fetches and parses JSON
- **WHEN** `fetchMonsterBase()` is called
- **THEN** it SHALL fetch `https://pokemon.brybry.ch/masters/data/proto/MonsterBase.json` and resolve with `Promise<IMonsterBaseApiResponse>`

#### Scenario: fetchMonsterNamesEn fetches and parses JSON
- **WHEN** `fetchMonsterNamesEn()` is called
- **THEN** it SHALL fetch `https://pokemon.brybry.ch/masters/data/lsd/monster_name_en.json` and resolve with `Promise<Record<string, string>>`

#### Scenario: fetchMonster is typed
- **WHEN** `fetchMonster()` is called
- **THEN** it SHALL return `Promise<IMonsterApiResponse>` (currently returns untyped `Response` — must be updated to call `.then(rsp => rsp.json())`)

### Requirement: MonsterStore implemented
`src/store/monster.ts` SHALL export a `MonsterStore` class and a singleton `monsterStore` instance, with MobX observables for all monster data, `action`-decorated setters, fetcher methods, `initApiCalls`, and `reset` — following the same pattern as `TrainerStore`.

#### Scenario: Observable state initialised
- **WHEN** `new MonsterStore()` is constructed
- **THEN** `monsters`, `monsterBase`, and `monsterNamesEn` SHALL be observable; `monsters` and `monsterBase` as arrays, `monsterNamesEn` as `Record<string, string>`

#### Scenario: initApiCalls triggers all fetches
- **WHEN** `monsterStore.initApiCalls()` is called
- **THEN** it SHALL invoke `getMonsters()`, `getMonsterBase()`, and `getMonsterNamesEn()`, each of which fetches and sets the corresponding observable

#### Scenario: reset clears all state
- **WHEN** `monsterStore.reset()` is called
- **THEN** `monsters` SHALL be `[]`, `monsterBase` SHALL be `[]`, and `monsterNamesEn` SHALL be `{}`
