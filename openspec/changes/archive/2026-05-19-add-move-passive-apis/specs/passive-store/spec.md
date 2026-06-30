## ADDED Requirements

### Requirement: Passive types are defined
`src/types/passive.ts` SHALL export types for passive skill data. Since passive data has no entries array, only name maps are needed — no enum or entries interface is required.

#### Scenario: Type file is minimal and correct
- **WHEN** passive service functions are typed
- **THEN** both `fetchPassiveSkillNamesEn` and `fetchPassiveSkillNamePartsEn` SHALL resolve to `Record<string, string>` with no additional wrapper types needed

### Requirement: Passive service fetches from correct endpoints
`src/service/passive.ts` SHALL export `fetchPassiveSkillNamesEn(): Promise<Record<string, string>>` and `fetchPassiveSkillNamePartsEn(): Promise<Record<string, string>>`.

#### Scenario: fetchPassiveSkillNamesEn resolves name map
- **WHEN** `fetchPassiveSkillNamesEn()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_en.json` and return the parsed JSON

#### Scenario: fetchPassiveSkillNamePartsEn resolves name parts map
- **WHEN** `fetchPassiveSkillNamePartsEn()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_parts_en.json` and return the parsed JSON

### Requirement: PassiveStore manages passive skill state
`src/store/passive.ts` SHALL export a `PassiveStore` class and a singleton `passiveStore`. The store SHALL have `passiveSkillNamesEn: Record<string, string>` and `passiveSkillNamePartsEn: Record<string, string>` as MobX observables, corresponding setter actions, getter methods that call the service and set state, `initApiCalls`, and `reset`.

#### Scenario: initApiCalls triggers all fetches
- **WHEN** `passiveStore.initApiCalls()` is called
- **THEN** both passive skill name fetches SHALL be invoked

#### Scenario: reset clears state
- **WHEN** `passiveStore.reset()` is called
- **THEN** both `passiveSkillNamesEn` and `passiveSkillNamePartsEn` SHALL be `{}`
