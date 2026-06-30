## Why

Users currently lose their entire calculator setup on every page refresh — all pair configurations, trainer selections, base stats, and move levels must be re-entered from scratch. This creates friction for repeat sessions and makes it impossible to share or revisit a specific damage scenario.

## What Changes

- Calculator state (pair tabs, form values, pair names, config settings) is automatically saved to `localStorage` and restored on next page load, requiring no user action for the common case
- A named "sessions" system lets users save multiple named snapshots, switch between them, and delete them — all stored in `localStorage` without a backend
- JSON export/import: download the full session state as a `.json` file, and load it back via file upload — enables sharing setups between users
- CSV/TSV export of the damage table for pasting directly into Google Sheets — covers the secondary import/export goal without requiring OAuth or the Sheets API

## Capabilities

### New Capabilities
- `session-persistence`: Auto-save and restore full calculator state (Ant Design form values, pair names, active tab, `configStore` settings, per-tab `PairStore` damage records) to/from `localStorage`; also supports named session slots (save as, load, delete)
- `data-export`: Export current results as JSON snapshot (download/upload) and as TSV for direct paste into Google Sheets

### Modified Capabilities
<!-- No existing specs change behavior -->

## Impact

- **`src/container/index.tsx`**: Add save/restore hooks around form state and `storesRef`; add session toolbar
- **`src/store/config.ts`**: Add serialise/hydrate helpers on `ConfigStore`
- **`src/store/pair.ts`**: Add serialise/hydrate helpers on `PairStore`
- **New `src/store/session.ts`**: MobX store managing named session slots in `localStorage`
- **New `src/components/session-toolbar/`**: UI for session management (save, load, rename, delete) and export buttons (JSON, TSV)
- **No backend or external auth required** — all storage is client-side; Google Sheets export is TSV clipboard/download, not API-driven
