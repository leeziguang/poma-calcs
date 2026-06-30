## Why

Monster data (stats, base info, English names) from the pokemon.brybry.ch API is needed to display and calculate pair information, but only a stub `fetchMonster` service exists — no types, no additional fetch functions, and an empty MobX store. This mirrors the complete trainer integration pattern that already works.

## What Changes

- Add TypeScript types for `Monster`, `MonsterBase`, and API response wrappers in `src/types/monster.ts`
- Add `fetchMonsterBase` and `fetchMonsterNamesEn` service functions to `src/service/monster.ts` (alongside the existing `fetchMonster`)
- Implement `MonsterStore` in `src/store/monster.ts` with observable state, setters, fetchers, and `initApiCalls` — mirroring `TrainerStore`

## Capabilities

### New Capabilities

- `monster-data-api`: Types, service functions, and MobX store for Monster, MonsterBase, and monster name data fetched from the pokemon.brybry.ch API

### Modified Capabilities

*(none)*

## Impact

- `src/types/monster.ts` — new file with all monster type definitions
- `src/service/monster.ts` — extended with `fetchMonsterBase` and `fetchMonsterNamesEn`
- `src/store/monster.ts` — fully implemented `MonsterStore` replacing the current empty skeleton
