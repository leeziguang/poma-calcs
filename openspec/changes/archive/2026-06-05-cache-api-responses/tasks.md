## 1. Static Fallback Files

- [x] 1.1 Create `src/cache/` directory with 19 JSON files named by URL slug (e.g., `proto__Monster.json`, `lsd__trainer_name_en.json`)
- [x] 1.2 Create `src/cache/index.ts` that imports all 19 JSON files and exports a `Record<string, unknown>` map keyed by slug

## 2. Cache Module

- [x] 2.1 Create `src/cache/cachedFetch.ts` exporting `cachedFetch<T>(url: string): Promise<T>`
- [x] 2.2 Implement cache key derivation: last two URL path segments joined by `__`, prefixed with `poma_cache__`
- [x] 2.3 Implement cache-first read: parse `localStorage[key]` as `{ data, timestamp }`; if age < 3_600_000 ms return data immediately
- [x] 2.4 Implement fetch path: on success write `{ data, timestamp: Date.now() }` to localStorage (catch `QuotaExceededError` silently); return data
- [x] 2.5 Implement fallback chain on failure: return stale localStorage entry if present, else static fallback from index, else re-throw

## 3. Wire Services (already done)

- [x] 3.1 `src/service/monster.ts` — all 4 calls use `cachedFetch`
- [x] 3.2 `src/service/move.ts` — all 4 calls use `cachedFetch`
- [x] 3.3 `src/service/passive.ts` — all 6 calls use `cachedFetch`
- [x] 3.4 `src/service/trainer.ts` — all 5 calls use `cachedFetch`

## 4. Verification

- [x] 4.1 Run `npm run build` with no TypeScript errors
- [ ] 4.2 Open the app; confirm 19 API requests in DevTools Network tab (cold cache)
- [ ] 4.3 Reload within 1 hour; confirm zero requests to the 19 endpoints in Network tab (served from localStorage)
- [ ] 4.4 In DevTools Application → Local Storage confirm 19 `poma_cache__` keys with valid JSON
- [ ] 4.5 Throttle to offline, clear localStorage, reload; confirm app loads using static fallback data
