## Why

The poma-calcs tool is a Pokémon Masters EX damage calculator that has been built organically without a formal specification. Documenting the existing system as a spec creates a shared source of truth for future development, onboarding, and feature planning.

## What Changes

- Formalise the damage calculation logic (base stat, move power, field effect) as verified specs
- Document the pair management system (tabs, columns, naming, duplication)
- Document the configuration system (enemy defense, custom mode, trainer selection)
- Document the data display system (damage values, percentages, move-level formatting)

## Capabilities

### New Capabilities

- `damage-calculation`: Core damage formula — base stat × move power × field effect — including all multipliers (stat boosts/drops, move level, Tera, AOE, sync, circles, WTZ, SEUN, rebuff)
- `pair-management`: Managing multiple pairs as tabs and move columns within each pair, including add, remove, duplicate, and rename operations
- `app-configuration`: Global settings (enemy defense, custom mode) and trainer selection that affect all pairs
- `data-display`: Rendering of damage values, totals, and percentage comparisons across pairs and moves

### Modified Capabilities

## Impact

- No code changes — this is a documentation/spec-only change
- Affected areas: `src/store/`, `src/components/`, `src/container/`, `src/lib/`, `src/service/`
