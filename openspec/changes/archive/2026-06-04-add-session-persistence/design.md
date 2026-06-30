## Context

The app has no persistence today — all state lives in React component state (`pairNames`, `storesRef`), Ant Design Form (`EPairListFormFields`), and MobX singletons (`configStore`). On every page reload everything is lost. State spans two layers that need coordinated serialization: the AntD form tree (owns pair config, trainer/monster/move selections, base stats) and per-tab `PairStore` instances held in a `useRef<Map<React.Key, PairStore>>` inside `PairListBody`.

## Goals / Non-Goals

**Goals:**
- Auto-save full calculator state to `localStorage` on every change; restore on page load with no user action
- Named session slots: save as / load / delete snapshots, all client-side
- JSON snapshot download + upload (file-based sharing between users)
- TSV download of the damage table for pasting into Google Sheets

**Non-Goals:**
- Google Sheets API / OAuth integration (TSV covers the use case without auth complexity)
- Cloud sync or server-side storage
- Undo/redo history
- Cross-tab sync (`storage` event handling)

## Decisions

### 1. `localStorage` over `sessionStorage`
sessionStorage resets when the tab closes — the primary ask is cross-session persistence. localStorage survives closes and is supported everywhere. Storage budget (~5 MB) is ample for form field text + damage numbers.

*Alternative considered:* IndexedDB — far more capacity but async API adds complexity for no benefit at current data sizes.

### 2. Single serialization shape with version field
All saved state is one JSON object per session:
```typescript
interface ISavedSession {
  version: 1;
  name: string;
  savedAt: string; // ISO
  config: { enemyDef: number; isCustomMode: boolean };
  formValues: ReturnType<FormInstance["getFieldsValue"]>;
  pairNames: string[];
  activeKey: string | undefined;
  pairStores: Record<string, Record<string, IMoveInfo>>; // tabKey → moveDamageRec
}
```
`version` allows future migrations without breaking saved data.

*Alternative considered:* Storing form and stores separately in different localStorage keys — creates partial-save race conditions and complicates restore ordering.

### 3. Auto-save via `useEffect` + `onValuesChange` (not MobX autorun)
The source of truth for form fields is the AntD `FormInstance`, which is not a MobX observable. A `onValuesChange` callback on `<Form>` fires for every field edit; we debounce 500ms and then snapshot the full form + stores + config into `localStorage['poma-calcs:auto']`. `configStore` changes are captured in a lightweight MobX `autorun` that also triggers the debounced save.

*Alternative considered:* Polling on an interval — wasteful and causes stale saves; rejected.

### 4. New `SessionStore` MobX singleton for named sessions
`sessionStore` owns `Record<string, ISavedSession>` loaded from `localStorage['poma-calcs:sessions']` at startup. It exposes `saveSession(name, data)`, `loadSession(name)`, `deleteSession(name)`. Named sessions are separate from the auto-save slot so an auto-save can never clobber a deliberate snapshot.

### 5. Restore is done at Form mount via `form.setFieldsValue` + manual store hydration
On `MainPage` mount, after API data loads (so dropdown options exist), we call `form.setFieldsValue(saved.formValues)` and replay `saved.pairStores` into the storesRef entries. This ordering is required because AntD validates selects against their option list — hydrating before options are ready can cause field resets.

### 6. TSV export builds rows from `pairStore.moveDamageRec`
Each row = one pair tab; columns = pair name, base stat, move power, field effect, final damage. Output is a tab-separated string offered as a file download (`Blob` + `URL.createObjectURL`). Users can paste the file into Google Sheets via File → Import. No API key or OAuth required.

### 7. Session toolbar as a new top-level component
A new `<SessionToolbar>` sits above the `<Tabs>` inside `PairListBody`. It renders: session name display / save-as button, load dropdown, delete, export JSON, export TSV. Keeps session concerns out of `ActionTopbar` (which owns pair add/remove).

## Risks / Trade-offs

- **storesRef is a React ref, not observable** → We can't reactively watch it. Mitigation: serialize stores at save time (inside the debounced callback) by iterating `storesRef.current`, which always has the latest values.
- **Form restore before options load causes reset** → Mitigated by calling `setFieldsValue` inside the `.finally` of the API `Promise.all` in `MainPage`, not in a separate effect that could race.
- **localStorage quota** — Unlikely to hit 5 MB with text data, but if the user has many saved sessions: Mitigation: show a toast on `QuotaExceededError` and prompt to delete old sessions.
- **TSV export only, no Sheets API** — Users must manually import the file; can't push directly to a sheet. This is the intended scope; the proposal explicitly excludes OAuth.
- **No migration logic yet for version > 1** — Acceptable for v1; add a `migrateSession(raw)` utility when needed.

## Migration Plan

1. No data to migrate (feature is net-new).
2. On first load, `localStorage['poma-calcs:auto']` is absent → app starts fresh (existing behaviour).
3. If a future schema version breaks compatibility, detect `version !== CURRENT_VERSION` in `SessionStore.load` and discard stale data with a user-facing warning rather than crashing.

## Open Questions

- Should the auto-save slot be user-visible (listed alongside named sessions) or hidden? → Recommend hidden; surface it only as "restore last session" on load if no named session is active.
- Tab key stability: AntD `Form.List` keys are generated integers that reset between page loads. The restore logic must re-create stores by *index* order, not by the original React key, since keys will differ. Need to verify this assumption against the `fields[i].key` generation in `Form.List`.
