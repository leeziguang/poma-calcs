## Context

The app is a client-side React SPA (CRA, deployed to gh-pages). All data comes from 19 `fetch()` calls across four service files (`monster.ts`, `move.ts`, `passive.ts`, `trainer.ts`), all hitting `https://pokemon.brybry.ch/masters/`. There is currently zero caching: every page load re-fetches all data, and if the external API is down the app is broken.

## Goals / Non-Goals

**Goals:**
- Cache-first: return localStorage data immediately if the entry is less than 1 hour old — no network call
- On cache miss or expiry: call the live API, write result to localStorage with timestamp, return data
- On API failure: serve stale localStorage entry if any, else static fallback JSON, else throw
- `src/cache/` holds one committed JSON file per endpoint as a last-resort fallback (first load, API down, localStorage empty)
- No manual refresh script needed — the browser populates and refreshes the cache automatically

**Non-Goals:**
- In-memory-only caching (resets on page reload)
- A daily refresh script for populating cache
- Offline mode as a first-class feature

## Decisions

### 1 — localStorage for persistent 1 h cache

**Choice:** `localStorage`, keyed by URL slug, value `{ data, timestamp }` serialised as JSON.

**Rationale:** Persists across page reloads within the same browser, requires no server or build-step, and makes the 1 h TTL meaningful across sessions. The browser manages it automatically — no external script needed.

**Alternative considered:** In-memory `Map` — discarded because it resets on every page load, making the 1 h window meaningless for returning visitors.

### 2 — Cache key = URL slug prefixed with `poma_cache__`

**Choice:** Last two URL path segments joined by `__`, e.g. `poma_cache__proto__Monster.json`.

**Rationale:** Deterministic, collision-free, no manual registry. The prefix namespaces our entries.

### 3 — Cache-first flow

**Choice:** Read localStorage before any network call; only fetch when the entry is missing or ≥ 1 h old.

**Rationale:** Matches the stated requirement: serve cached data for an hour, then refresh.

### 4 — Cache flow per request

```
cachedFetch<T>(url):
  key = "poma_cache__" + last two path segments joined by "__"

  1. entry = localStorage[key] parsed as { data, timestamp }
     a. entry exists + age < 1 h → return entry.data  (no network)
     b. missing or stale         → go to step 2

  2. fetch(url).then(r => r.json())
     a. success → write { data, timestamp: now } to localStorage (catch QuotaExceededError silently)
                → return data
     b. failure → stale entry exists?  → return entry.data
               → static fallback exists? → return static data
               → else throw
```

**Example timeline (persistent across reloads):**
- t=0 min: no localStorage → API call → stored
- t=50 min: localStorage age=50 m < 1 h → return cached (no API, even after page reload)
- t=61 min: localStorage age=61 m ≥ 1 h → API call → localStorage updated

### 5 — Static committed JSON files as last-resort fallback

**Choice:** 19 JSON files under `src/cache/`, imported at build time via `src/cache/index.ts`.

**Rationale:** Covers the edge case where the user visits for the very first time with the API down and localStorage empty. Once the API succeeds once, localStorage takes over as the fallback.

### 6 — `src/cache/cachedFetch.ts` exports a single `cachedFetch<T>` function

All four service files replace `fetch(url).then(r => r.json())` with `cachedFetch<T>(url)`. No signature changes.

## Risks / Trade-offs

- **localStorage quota**: 19 entries × ~500 KB ≈ 9 MB; browsers cap at 5–10 MB per origin. Write failures are caught silently — the app degrades to always-live fetches without crashing.
- **Stale static fallback**: Committed JSON ages over time; only matters on first-ever load with no network. Acceptable.
- **First-load latency unchanged**: Cold cache always hits the network. Repeat visits within 1 h are instant.
