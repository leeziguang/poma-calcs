### Requirement: Cache checked before API call
The system SHALL read localStorage before making any network request; a fresh entry SHALL prevent the network call entirely.

#### Scenario: Fresh cache hit — no network call
- **WHEN** `cachedFetch` is called for an endpoint whose localStorage entry is less than 1 hour old
- **THEN** the cached data is returned immediately and no network request is made

#### Scenario: Fresh cache hit persists across page reloads
- **WHEN** a page is reloaded within 1 hour of the last API call for an endpoint
- **THEN** the cached data is returned from localStorage without a network request

### Requirement: API called when cache is missing or stale
The system SHALL make a live API call when no localStorage entry exists or the entry is 1 hour old or older.

#### Scenario: No cache entry on first call
- **WHEN** `cachedFetch` is called for an endpoint with no localStorage entry
- **THEN** a network request is made to the live API

#### Scenario: Cache expired after 1 hour
- **WHEN** `cachedFetch` is called for an endpoint whose localStorage entry is 1 hour old or older
- **THEN** a network request is made to the live API

### Requirement: Successful response written to localStorage with timestamp
The system SHALL persist a successful API response to localStorage as `{ data, timestamp }` so subsequent calls within 1 hour are served from cache.

#### Scenario: Cache written after successful fetch
- **WHEN** the live API returns a successful JSON response
- **THEN** the response data and current timestamp are stored in localStorage under `poma_cache__<slug>`

#### Scenario: Subsequent call within 1 hour uses stored entry
- **WHEN** `cachedFetch` is called for the same endpoint within 1 hour of a successful API call
- **THEN** the previously stored data is returned without a network request

### Requirement: localStorage quota exceeded handled gracefully
The system SHALL catch `QuotaExceededError` on localStorage write and continue serving the live API response without crashing.

#### Scenario: Quota exceeded on cache write
- **WHEN** writing to localStorage throws `QuotaExceededError`
- **THEN** the error is caught silently and the API response is still returned

### Requirement: Stale localStorage entry served on API failure
The system SHALL return the stale localStorage entry when the live API fails and any previous entry exists, regardless of age.

#### Scenario: API failure with stale cache available
- **WHEN** the live API request fails
- **AND** a previous localStorage entry exists for that endpoint
- **THEN** the stale cached data is returned without throwing

### Requirement: Static bundled fallback served when localStorage is empty and API fails
The system SHALL return the bundled static JSON when the live API fails and no localStorage entry exists.

#### Scenario: First load, API down, no localStorage
- **WHEN** the live API request fails
- **AND** no localStorage entry exists for the endpoint
- **AND** a static JSON file exists in `src/cache/` for that endpoint
- **THEN** the static data is returned without throwing

### Requirement: Error propagated when no fallback exists
The system SHALL propagate the original fetch error when the API fails, localStorage is empty, and no static fallback exists.

#### Scenario: Total failure
- **WHEN** the live API request fails
- **AND** no localStorage entry exists
- **AND** no static fallback exists for the endpoint
- **THEN** the original error is thrown

### Requirement: Cache key derived from URL
The system SHALL derive the localStorage key from the last two URL path segments prefixed with `poma_cache__`.

#### Scenario: Key derivation
- **WHEN** the URL is `https://pokemon.brybry.ch/masters/data/proto/Monster.json`
- **THEN** the localStorage key is `poma_cache__proto__Monster.json`

### Requirement: All 19 service functions use the cache layer
The system SHALL route all existing service fetch calls through `cachedFetch` with no change to return types or function signatures.

#### Scenario: Service return type unchanged
- **WHEN** any service function is called
- **THEN** it returns the same typed `Promise<T>` regardless of data source
