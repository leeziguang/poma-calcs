## ADDED Requirements

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

## REMOVED Requirements

### Requirement: regionMembers is a form field in MovePower
**Reason**: regionMembers is now a pair-level concern stored in passiveStore, not a per-column form field.
**Migration**: Read `regionMembers` from `passiveStore.pairPassiveState.get(pairFieldName)?.regionMembers ?? 1`. Remove `EMovePowerFormFields.REGION_MEMBERS` form item from `MovePower`.
