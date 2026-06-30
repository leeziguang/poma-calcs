## Why

The app currently fetches trainer and monster data from the Pokemon Masters API but lacks move and passive skill data, which are needed to display complete sync pair information including move details and passive skills.

## What Changes

- Add `IMove` type and `IMoveApiResponse` wrapping `{ entries: IMove[] }` for Move.json data
- Add `IMoveNames` as `Record<string, string>` type for move_name_en.json
- Add `fetchMove` and `fetchMoveNamesEn` service functions
- Add `MoveStore` with `moves`, `moveNamesEn` observables and `initApiCalls`/`reset` methods
- Add `IPassiveSkillName` and `IPassiveSkillNameParts` as `Record<string, string>` types
- Add `fetchPassiveSkillNamesEn` and `fetchPassiveSkillNamePartsEn` service functions
- Add `PassiveStore` with `passiveSkillNamesEn`, `passiveSkillNamePartsEn` observables and `initApiCalls`/`reset` methods

## Capabilities

### New Capabilities
- `move-store`: Types, service, and MobX store for move data (Move.json + move_name_en.json)
- `passive-store`: Types, service, and MobX store for passive skill data (passive_skill_name_en.json + passive_skill_name_parts_en.json)

### Modified Capabilities

## Impact

- New files: `src/types/move.ts`, `src/service/move.ts`, `src/store/move.ts`
- New files: `src/types/passive.ts`, `src/service/passive.ts`, `src/store/passive.ts`
- No breaking changes to existing trainer/monster stores
