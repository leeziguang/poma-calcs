## 1. Types

- [x] 1.1 Create `src/types/ability.ts` with `IAbility`, `IAbilityApiResponse`, `IAbilityPanel`, `IAbilityPanelApiResponse` interfaces

## 2. Service

- [x] 2.1 Create `src/service/ability.ts` with `fetchAbilities` and `fetchAbilityPanels` using `cachedFetch`

## 3. Store

- [x] 3.1 Create `src/store/ability.ts` with `AbilityStore` class: `abilities` and `abilityPanels` observables, `setAbilities` and `setAbilityPanels` actions, `getAbilities` and `getAbilityPanels` fetch-and-set methods, `initApiCalls` via `Promise.all`
- [x] 3.2 Export singleton `abilityStore` from the same file

## 4. Container Wiring

- [x] 4.1 Import `abilityStore` in `src/container/index.tsx`
- [x] 4.2 Add `abilityStore.initApiCalls()` to the startup `Promise.all` alongside the other stores
