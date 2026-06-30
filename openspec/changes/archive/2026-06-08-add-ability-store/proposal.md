## Why

The calculator currently lacks data on Pokémon abilities and ability panel grid cells, which are needed to support ability-based damage modifiers and grid-based passive systems. Adding `AbilityStore` makes this data available to the rest of the app.

## What Changes

- New `AbilityStore` MobX store with `get`/`set` for ability and ability-panel data
- New `abilityService` fetch wrappers for two endpoints: `/Ability.json` and `/AbilityPanel.json`
- New TypeScript types: `IAbility`, `IAbilityPanel`
- Both endpoints initialized in the app's existing `init` call alongside other store fetches

## Capabilities

### New Capabilities

- `ability-store`: MobX store, service layer, and types for Ability and AbilityPanel API resources

### Modified Capabilities

- `move-store`: Init call gains two new fetch invocations (AbilityStore mirrors the existing pattern used by move/passive stores)

## Impact

- **New files**: `src/store/AbilityStore.ts`, `src/service/abilityService.ts`, `src/types/ability.ts`
- **Modified files**: `src/container/` (or wherever the `init` call lives) — add two new fetch calls
- **APIs**: `https://pokemon.brybry.ch/masters/data/proto/Ability.json`, `https://pokemon.brybry.ch/masters/data/proto/AbilityPanel.json`
- No breaking changes; purely additive
