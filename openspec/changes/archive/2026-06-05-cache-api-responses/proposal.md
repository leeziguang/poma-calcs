## Why

All data is fetched live from `pokemon.brybry.ch` on every app load with no caching, causing unnecessary network round-trips and making the app non-functional when the external API is unavailable. A daily cache layer in `src/cache/` will reduce load times and provide offline resilience.

## What Changes

- Add a `src/cache/` directory to store per-endpoint JSON response cache files (one `.json` per API resource)
- Introduce a `cacheService` that wraps each fetch with: try live API → on success write cache → on failure read cache
- Cache TTL is 24 hours; stale cache is still served as fallback if API is unreachable
- All 4 service files (`monster.ts`, `move.ts`, `passive.ts`, `trainer.ts`) delegate through the cache layer instead of calling `fetch` directly
- Cache files are keyed by a stable slug matching the URL path segment (e.g. `Monster.json`, `move_name_en.json`)

## Capabilities

### New Capabilities
- `api-response-cache`: Daily file-based cache for all 19 external API JSON endpoints; API-first with cache fallback

### Modified Capabilities
<!-- No spec-level requirement changes to existing capabilities; this is an infrastructure concern only -->

## Impact

- **Services**: `src/service/monster.ts`, `src/service/move.ts`, `src/service/passive.ts`, `src/service/trainer.ts` — each fetch is replaced with a cached variant
- **New files**: `src/cache/<slug>.json` (one per endpoint, committed as empty stubs or seeded on first run), `src/service/cacheService.ts`
- **No store or component changes** — the service layer is the only integration point
- **External dependency**: none; uses browser `localStorage` or in-memory + IndexedDB, TBD in design
