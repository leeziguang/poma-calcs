## 1. Types and shared serialization shape

- [x] 1.1 Add `ISavedSession` interface to `src/types/session.ts` (version, name, savedAt, config, formValues, pairNames, activeKey, pairStores)
- [x] 1.2 Add `serialize()` and `hydrate(data)` methods to `ConfigStore` in `src/store/config.ts`
- [x] 1.3 Add `serialize()` and `hydrate(data)` methods to `PairStore` in `src/store/pair.ts`

## 2. SessionStore

- [x] 2.1 Create `src/store/session.ts` — MobX singleton `SessionStore` with observables: `namedSessions: Record<string, ISavedSession>`, `activeSessionName: string | undefined`
- [x] 2.2 Implement `SessionStore.loadFromStorage()` — read and parse `localStorage['poma-calcs:sessions']`, handle JSON parse errors gracefully
- [x] 2.3 Implement `SessionStore.saveSession(name, data: ISavedSession)` — write to `localStorage['poma-calcs:sessions']`, catch `QuotaExceededError` and emit error event
- [x] 2.4 Implement `SessionStore.deleteSession(name)` — remove entry and persist updated record
- [x] 2.5 Implement `SessionStore.readAutoSave()` — read `localStorage['poma-calcs:auto']`, validate `version === 1`, return `ISavedSession | null`
- [x] 2.6 Implement `SessionStore.writeAutoSave(data: ISavedSession)` — write to `localStorage['poma-calcs:auto']`, catch `QuotaExceededError`
- [x] 2.7 Export `sessionStore` singleton from `src/store/session.ts`

## 3. Auto-save wiring in container

- [x] 3.1 In `src/container/index.tsx` `PairListBody`, create a debounced `saveToAutoSlot` callback (500 ms) that snapshots `form.getFieldsValue()`, `pairNames`, `activeKey`, all `storesRef.current` entries, and `configStore.serialize()`
- [x] 3.2 Pass `onValuesChange={saveToAutoSlot}` to the `<Form>` in `PokemonList` (thread `saveToAutoSlot` down as a prop or via context)
- [x] 3.3 Add a MobX `autorun` in `MainPage` that calls `saveToAutoSlot` whenever `configStore.enemyDef` or `configStore.isCustomMode` changes
- [x] 3.4 Cancel debounce and dispose `autorun` in the `MainPage` `useEffect` cleanup

## 4. Restore on page load

- [x] 4.1 In `MainPage` `useEffect`, after the `Promise.all` API fetch resolves (inside `.finally`), call `sessionStore.readAutoSave()`
- [x] 4.2 If a valid saved session exists: call `form.setFieldsValue(saved.formValues)`, set `pairNames` state, set `activeKey` state, and for each entry in `saved.pairStores` call `getOrCreateStore(key).hydrate(storeData)` keyed by index order
- [x] 4.3 Restore `configStore` via `configStore.hydrate(saved.config)`
- [x] 4.4 Show a toast on corrupt/version-mismatch auto-save data and fall back to default state

## 5. SessionToolbar component

- [x] 5.1 Create `src/components/session-toolbar/index.tsx` — observer component accepting `onSave`, `onLoad`, `onDelete`, `onExportJson`, `onExportTsv`, `onImport` props
- [x] 5.2 Render session name display with an editable "Save As" input and confirm button
- [x] 5.3 Render an AntD `Select` dropdown populated from `sessionStore.namedSessions` keys for loading sessions
- [x] 5.4 Render delete button (with AntD `Popconfirm` for confirmation) for the active session
- [x] 5.5 Render "Export JSON", "Export TSV", and "Import" (file input) buttons in a visually distinct group
- [x] 5.6 Add basic SCSS styles in `src/components/session-toolbar/style.scss`
- [x] 5.7 Mount `<SessionToolbar>` inside `PairListBody` above the `<Tabs>`, wiring all handlers

## 6. Named session save / load handlers

- [x] 6.1 Implement `handleSaveSession(name)` in `PairListBody` — snapshot current state into `ISavedSession` and call `sessionStore.saveSession(name, snapshot)`
- [x] 6.2 Implement `handleLoadSession(name)` in `PairListBody` — call `sessionStore.namedSessions[name]`, show AntD `Modal.confirm` if there are unsaved changes, then restore state (same logic as auto-restore)
- [x] 6.3 Implement `handleDeleteSession(name)` in `PairListBody` — call `sessionStore.deleteSession(name)`, clear `activeSessionName` if it matches

## 7. JSON export / import

- [x] 7.1 Implement `handleExportJson()` — build `ISavedSession` snapshot, `JSON.stringify`, create `Blob`, trigger download as `poma-calcs-<Date.now()>.json`
- [x] 7.2 Implement `handleImportJson(file: File)` — read file via `FileReader`, parse JSON, validate `version` field, show confirm dialog if unsaved changes exist, then restore state
- [x] 7.3 Show success toast on successful import; show error toast on malformed file

## 8. TSV export

- [x] 8.1 Implement `buildTsvRows(fields, pairNames, storesRef, formValues)` pure helper in `src/lib/export.ts` — returns header row + one row per pair tab with: Pair, Trainer, Monster, Move, Base Stat, Move Power, Field Effect, Final Damage
- [x] 8.2 Implement `handleExportTsv()` in `PairListBody` — call `buildTsvRows`, join with `\t` and `\n`, create `Blob` with `text/tab-separated-values`, trigger download as `poma-calcs-<Date.now()>.tsv`
- [x] 8.3 Ensure empty/undefined numeric fields are output as `0` in TSV rows

## 9. Error handling and edge cases

- [x] 9.1 Wire `QuotaExceededError` from `sessionStore` to an AntD `notification.error` toast in the appropriate component
- [x] 9.2 Handle the case where a saved `TRAINER_ID` / `MONSTER_ID` / `MOVE_ID` no longer exists in API data — leave the field value but accept that the select display may show the raw ID; do not crash
- [x] 9.3 Verify that restoring 0 pair tabs (edge case: saved session with empty pair list) falls back gracefully to one empty tab
