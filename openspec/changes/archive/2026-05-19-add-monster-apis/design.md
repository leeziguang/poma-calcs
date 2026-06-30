## Context

The app fetches sync pair data from pokemon.brybry.ch. Trainer data has a complete integration: types in `src/types/trainer.ts`, three fetch functions in `src/service/trainer.ts`, and a full `TrainerStore` with observables, setters, and `initApiCalls`. Monster data has only a bare `fetchMonster` stub and an empty `MonsterStore`. This change brings monsters to parity with trainers.

Three API endpoints are relevant:
- `Monster.json` — per-pair stat arrays (7 values per stat tier), sync move ID, move change IDs
- `MonsterBase.json` — per-pokémon identity: actorId, actorNumber, variant, gender, strength, shiny flag, name ID
- `monster_name_en.json` — flat `Record<string, string>` mapping name ID → English name

## Goals / Non-Goals

**Goals:**
- Define TypeScript types mirroring the exact API shapes for all three endpoints
- Add `fetchMonsterBase` and `fetchMonsterNamesEn` alongside the existing `fetchMonster`
- Implement `MonsterStore` with the same observable/setter/fetcher/`initApiCalls`/`reset` pattern as `TrainerStore`

**Non-Goals:**
- Computed selectors or derived data (e.g. resolved name lookup) — can be added later when consumers exist
- Modifying the trainer store or any existing component

## Decisions

**Mirror the TrainerStore pattern exactly.**
Rationale: consistency lowers the cognitive cost of reading the codebase. Trainers use `observable` arrays/records, `action` setters named `setX`, getter methods named `getX` that call fetch and then the setter, `initApiCalls` to kick off all fetches, and `reset` to clear state. Monsters follow the same shape.

**Keep stat arrays as `number[]` (not fixed-length tuples).**
The 7-element stat arrays (`hpValues`, `atkValues`, etc.) could be typed as `[number, number, number, number, number, number, number]`, but `number[]` is simpler and the API shape is stable enough that tuple strictness adds little value.

**Store `monsterNamesEn` as `Record<string, string>`.**
Matches the raw API shape and what `trainerNamesEn` uses — no transformation at fetch time.

**`src/service/monster.ts` is the source file** (without the trailing `s`). The proposal mentioned `src/services/monster.ts` but the project uses `src/service/` (singular) — trainer and the existing monster stub both live there.

## Risks / Trade-offs

- [Shape drift] API fields with `u`-prefixed names (e.g. `u5`, `u7`) are opaque. Typed as `number` for now; if semantics become known the type should be updated. → Accepted — same approach used for trainer.
- [Empty store on first render] `MonsterStore` starts empty; consumers must await `initApiCalls`. → Same as `TrainerStore`; not a new problem.
