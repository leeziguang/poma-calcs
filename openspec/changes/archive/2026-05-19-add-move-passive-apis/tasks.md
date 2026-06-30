## 1. Move Types

- [x] 1.1 Create `src/types/move.ts` with `EMoveFields` enum covering all Move.json entry fields (`moveId`, `category`, `u3`, `user`, `group`, `type`, `target`, `u8`, `gaugeDrain`, `power`, `accuracy`, `uses`, `tags`)
- [x] 1.2 Add `IMove` interface using `EMoveFields` enum keys with correct types (`number` for numeric fields, `string` for `category`, `user`, `group`, `target`, `tags`)
- [x] 1.3 Add `IMoveApiResponse` interface with `entries: IMove[]`

## 2. Move Service

- [x] 2.1 Create `src/service/move.ts` with `fetchMove(): Promise<IMoveApiResponse>` fetching from `https://pokemon.brybry.ch/masters/data/proto/Move.json`
- [x] 2.2 Add `fetchMoveNamesEn(): Promise<Record<string, string>>` fetching from `https://pokemon.brybry.ch/masters/data/lsd/move_name_en.json`

## 3. Move Store

- [x] 3.1 Create `src/store/move.ts` with `MoveStore` class containing `moves: IMove[]` and `moveNamesEn: Record<string, string>` as MobX observables
- [x] 3.2 Add `setMoves` and `setMoveNamesEn` MobX actions
- [x] 3.3 Add `getMoves()` method calling `fetchMove` and setting state via `setMoves`
- [x] 3.4 Add `getMoveNamesEn()` method calling `fetchMoveNamesEn` and setting state
- [x] 3.5 Add `initApiCalls()` method invoking `getMoves` and `getMoveNamesEn`
- [x] 3.6 Add `reset()` method restoring `moves` to `[]` and `moveNamesEn` to `{}`
- [x] 3.7 Export `moveStore` singleton instance

## 4. Passive Types

- [x] 4.1 Create `src/types/passive.ts` — passive data has no entries array, so no enum or IPassive interface needed; file can be minimal (just a comment or empty export if needed)

## 5. Passive Service

- [x] 5.1 Create `src/service/passive.ts` with `fetchPassiveSkillNamesEn(): Promise<Record<string, string>>` fetching from `https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_en.json`
- [x] 5.2 Add `fetchPassiveSkillNamePartsEn(): Promise<Record<string, string>>` fetching from `https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_parts_en.json`

## 6. Passive Store

- [x] 6.1 Create `src/store/passive.ts` with `PassiveStore` class containing `passiveSkillNamesEn: Record<string, string>` and `passiveSkillNamePartsEn: Record<string, string>` as MobX observables
- [x] 6.2 Add `setPassiveSkillNamesEn` and `setPassiveSkillNamePartsEn` MobX actions
- [x] 6.3 Add `getPassiveSkillNamesEn()` and `getPassiveSkillNamePartsEn()` methods calling respective service functions
- [x] 6.4 Add `initApiCalls()` invoking both getters
- [x] 6.5 Add `reset()` restoring both maps to `{}`
- [x] 6.6 Export `passiveStore` singleton instance
