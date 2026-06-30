## ADDED Requirements

### Requirement: Ability and AbilityPanel types are defined
`src/types/ability.ts` SHALL export `IAbility`, `IAbilityApiResponse`, `IAbilityPanel`, and `IAbilityPanelApiResponse` interfaces matching the API shapes.

#### Scenario: IAbility covers all fields from Ability.json
- **WHEN** the Ability.json API returns an entry
- **THEN** every field (`abilityId`, `type`, `passiveId`, `moveId`, `value`, `u6`) SHALL be accessible via `IAbility`

#### Scenario: IAbilityPanel covers all fields from AbilityPanel.json
- **WHEN** the AbilityPanel.json API returns an entry
- **THEN** every field (`cellId`, `version`, `trainerId`, `energyCost`, `orbCost`, `x`, `y`, `z`, `abilityId`, `conditionIds`, `scheduleId`) SHALL be accessible via `IAbilityPanel`

### Requirement: Ability service fetches from correct endpoints
`src/service/ability.ts` SHALL export `fetchAbilities(): Promise<IAbilityApiResponse>` and `fetchAbilityPanels(): Promise<IAbilityPanelApiResponse>` using `cachedFetch`.

#### Scenario: fetchAbilities resolves entries array
- **WHEN** `fetchAbilities()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/proto/Ability.json` and return the parsed JSON

#### Scenario: fetchAbilityPanels resolves entries array
- **WHEN** `fetchAbilityPanels()` is called
- **THEN** it SHALL fetch from `https://pokemon.brybry.ch/masters/data/proto/AbilityPanel.json` and return the parsed JSON

### Requirement: AbilityStore manages ability state
`src/store/ability.ts` SHALL export an `AbilityStore` class and a singleton `abilityStore`. The store SHALL have `abilities: IAbility[]` and `abilityPanels: IAbilityPanel[]` as MobX observables, corresponding `setAbilities` and `setAbilityPanels` actions, `getAbilities` and `getAbilityPanels` fetch-and-set methods, and `initApiCalls` to trigger all fetches.

#### Scenario: initApiCalls triggers both fetches
- **WHEN** `abilityStore.initApiCalls()` is called
- **THEN** both `getAbilities` and `getAbilityPanels` SHALL be invoked in parallel via `Promise.all`

#### Scenario: setAbilities stores entries
- **WHEN** `setAbilities(entries)` is called with an array of `IAbility`
- **THEN** `abilityStore.abilities` SHALL equal that array

#### Scenario: setAbilityPanels stores entries
- **WHEN** `setAbilityPanels(entries)` is called with an array of `IAbilityPanel`
- **THEN** `abilityStore.abilityPanels` SHALL equal that array
