## Why

The `PassiveGridModal` currently renders as a centred Ant Design `Modal`, which occludes the pair columns underneath while open. A sidebar drawer opening from the right lets the user keep the calculator visible and compare passive configuration against the move columns in real time — without any change to the passive state model, store, or calculation logic.

## What Changes

- Replace the Ant Design `Modal` wrapper in `PassiveGridModal` with an Ant Design `Drawer` that slides in from the right
- Remove the OK / Cancel footer buttons (Drawer has no footer action bar — state commits on close, consistent with the existing `onCancel` behaviour)
- Adjust the trigger label in `DataColList` if needed for clarity (e.g. "PASSIVES / GRID" instead of "VIEW PASSIVE/GRID")
- No changes to internal content, store shape, helpers, or calculation logic

## Capabilities

### Modified Capabilities

- `passive-grid-modal`: Replace Modal shell with Drawer; content and state behaviour unchanged

## Impact

- `src/components/passive-grid-modal/index.tsx` — swap `Modal` for `Drawer`, drop `onOk` prop, keep `onClose` commit behaviour
- `src/components/passive-grid-modal/style.scss` — minor width/padding tweaks if needed for drawer layout
