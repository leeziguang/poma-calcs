## Context

The codebase follows a consistent three-layer pattern for each data domain: `src/types/<domain>.ts` defines interfaces and enums, `src/service/<domain>.ts` holds fetch functions, and `src/store/<domain>.ts` provides a MobX class store with observables, setters, getters, `initApiCalls`, and `reset`. Trainer and Monster already follow this pattern. Move and Passive need to be added in the same shape.

Move data comes from two endpoints: a protobuf-derived JSON with `{ entries: IMove[] }` structure and a name lookup `Record<string, string>`. Passive data comes from two name-lookup endpoints, both `Record<string, string>`, with no entries array.

## Goals / Non-Goals

**Goals:**
- Add `MoveStore` mirroring `MonsterStore` in structure (observables, setters, getters, `initApiCalls`, `reset`)
- Add `PassiveStore` with two name maps, same structural pattern
- Type all API responses accurately using enums + interfaces
- Follow existing naming conventions exactly (`fetchXxx`, `XxxStore`, `xxxStore` singleton)

**Non-Goals:**
- Exposing computed selectors (like `trainerOptList`) — not needed for move/passive yet
- Integrating stores into UI components
- Transforming/filtering entries on fetch (passive has no entries, move entries stored as-is)

## Decisions

**Use enum + interface pattern for Move fields** — consistent with ITrainer/IMonster; all existing types use this approach, so Move should too even though the shape is simpler.

**Passive has no entries array, only name maps** — `PassiveStore` holds two `Record<string, string>` observables with no `IPassive` interface needed. This is simpler than Move.

**No index barrel for stores/services** — the existing `src/service/index.ts` was deleted (per git status). New files are imported directly by consumers, same as trainer/monster services.

## Risks / Trade-offs

- API field types are inferred from the sample payload; unknown (`u3`, `u8`) fields typed as `number` by convention matching the existing pattern in trainer/monster types.
- `tags` field on IMove is typed as `string` — the sample shows `"none"` but could be a union enum in the future.

## Migration Plan

No migration needed — purely additive new files. Existing stores are untouched.
