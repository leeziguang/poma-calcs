## Context

poma-calcs is a client-side React + MobX single-page application for calculating move damage in Pokémon Masters EX. All computation is done in the browser; there is no backend beyond a single external JSON endpoint (`pokemon.brybry.ch`) for trainer names.

The app has been developed incrementally. This change introduces no new functionality — it documents the existing architecture and formalises its behaviour as verifiable specs, enabling systematic future development.

**Current state:**
- React 18 + Ant Design v4 UI
- MobX 6 for reactive state (one `PairStore` per pair tab; singletons `ConfigStore` and `TrainerStore`)
- React Context bridges each `PairStore` to its subtree
- All damage calculations are pure functions in component helper files
- Trainer data fetched once on mount, cached in `TrainerStore`

## Goals / Non-Goals

**Goals:**
- Capture the existing damage formula and all its multiplier paths as testable requirements
- Document pair/column lifecycle (create, rename, duplicate, delete)
- Document global config (enemy defense, custom mode, trainer)
- Document display rules (formatting, percentage comparison, tab label)

**Non-Goals:**
- Changing any existing behaviour
- Adding tests (a follow-on change)
- Refactoring the calculation helpers into a shared lib
- Server-side rendering or persistence

## Decisions

**Single spec per capability, all new** — there are no existing `openspec/specs/` files, so every capability is treated as new rather than a delta.

**Four capabilities, not one** — splitting damage-calculation, pair-management, app-configuration, and data-display keeps each spec focused and independently testable. A single monolithic spec would be hard to maintain and hard to assign to tasks.

**Formulae expressed as SHALL requirements** — the exact arithmetic (floor operations, multiplier order) is normative. Treating them as informative prose would leave room for incorrect re-implementations.

**No migration plan** — this is a documentation-only change; no deployment steps are required.

## Risks / Trade-offs

- **Spec drift** → formulae in spec files may fall out of sync with helper code over time. Mitigation: treat each spec requirement as a test contract and add snapshot/unit tests in a follow-on task.
- **Floor-operation order sensitivity** → the damage formula applies `Math.floor` at multiple intermediate steps. A spec that omits the exact order will produce incorrect results for non-integer intermediates. Mitigation: each formula step is specified explicitly in scenario THEN clauses.
- **External API dependency** → `TrainerStore` fetches from `pokemon.brybry.ch`; if that endpoint changes the app silently breaks. Out of scope for this spec change but noted for future work.
