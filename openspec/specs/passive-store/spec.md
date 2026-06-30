### Requirement: Passive types are defined
`src/types/passive.ts` SHALL export types for passive skill data. Since passive data has no entries array, only name maps are needed — no enum or entries interface is required. It SHALL also export `IPairPassiveState` (see PassiveStore per-pair state requirement below).

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

### Requirement: PassiveStore holds per-pair passive modal state
`PassiveStore` SHALL have a `pairPassiveState: ObservableMap<number, IPairPassiveState>` observable, a `setPairPassiveState(pairFieldName: number, state: IPairPassiveState): void` action, and a `clearPairPassiveState(pairFieldName: number): void` action.

`IPairPassiveState` SHALL be exported from `src/types/passive.ts` as:
```ts
interface IPairPassiveState {
  regionMembers: number;
  extraPassives: string[];
  conditionalParams: Record<string, number>;
}
```

#### Scenario: setPairPassiveState stores state
- **WHEN** `passiveStore.setPairPassiveState(0, { regionMembers: 2, extraPassives: [], conditionalParams: {} })` is called
- **THEN** `passiveStore.pairPassiveState.get(0)?.regionMembers` SHALL equal `2`

#### Scenario: clearPairPassiveState removes entry
- **WHEN** `passiveStore.clearPairPassiveState(0)` is called after state was set
- **THEN** `passiveStore.pairPassiveState.get(0)` SHALL be `undefined`

### Requirement: calcDefaultMultis reads regionMembers from passiveStore
`calcDefaultMultis` in `move-power/helpers.ts` SHALL accept `regionMembers` via `IPassiveMultiParam` as before, but the caller (`MovePower`) SHALL supply the value from `passiveStore.pairPassiveState.get(pairFieldName)?.regionMembers ?? 1` instead of the form field.

#### Scenario: regionMembers from store used in multi calculation
- **WHEN** `passiveStore.pairPassiveState` has `regionMembers: 3` for a pair
- **THEN** `calcDefaultMultis` called with `regionMembers: 3` SHALL return a higher multi than with `regionMembers: 1`

### Removed: regionMembers form field in MovePower
`EMovePowerFormFields.REGION_MEMBERS` form item SHALL NOT exist in `MovePower`. `regionMembers` is a pair-level concern stored in `passiveStore`, read via `passiveStore.pairPassiveState.get(pairFieldName)?.regionMembers ?? 1`.
