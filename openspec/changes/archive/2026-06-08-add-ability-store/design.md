## Context

The app fetches Pokémon Masters EX game data from `https://pokemon.brybry.ch/masters/`. Each resource follows the same pattern: a TypeScript interface in `src/types/`, a `cachedFetch` wrapper in `src/service/`, and a MobX store in `src/store/` with `get`/`set` methods and an `initApiCalls()`. The container (`src/container/index.tsx`) calls each store's `initApiCalls()` in a `Promise.all` at startup.

Two new resources need coverage: `Ability.json` and `AbilityPanel.json`.

## Goals / Non-Goals

**Goals:**
- Add `IAbility`, `IAbilityPanel` types matching the API shapes
- Add `fetchAbilities` and `fetchAbilityPanels` in `src/service/ability.ts`
- Add `AbilityStore` with `abilities`/`abilityPanels` observables, corresponding setters, `getAbilities`/`getAbilityPanels` fetch-and-set methods, and `initApiCalls()`
- Wire `abilityStore.initApiCalls()` into the container's startup `Promise.all`

**Non-Goals:**
- Consuming ability/panel data in UI components (follow-on work)
- Derived computed maps (add when a consumer needs them)
- Reset logic (add when session reset needs to clear this data)

## Decisions

**Mirror the passive/move store pattern exactly** — same file layout (`types → service → store`), same observable/action/computed structure, same singleton export. This keeps the codebase uniform and makes the store immediately familiar.

**Use `cachedFetch`** — both endpoints are static JSON, same as all other proto endpoints. No reason to bypass the cache.

**Single `ability.ts` file per layer** — both resources (Ability and AbilityPanel) are closely related and small; splitting into two files per layer would be premature.

## Risks / Trade-offs

- `u6` field in `IAbility` is an opaque integer with no documented meaning → include it as `u6: number` for completeness; rename later when purpose is known.
- `conditionIds` in `IAbilityPanel` is typed as `string[]` (array seen as empty in sample) — adjust if non-string entries appear.
