## Context

`PassiveGridModal` currently wraps its content in an Ant Design `Modal`. The modal is centred, blocks the underlying pair columns, and presents an OK / Cancel footer. The internal content (default passive list, extra-passive picker, region-members select, conditional inputs), the `IPairPassiveState` draft / commit pattern, and the `passiveStore` integration are all correct and do not need to change.

The only structural problem is the container: a `Drawer` opening from the right gives the same content more appropriate placement and keeps the pair columns visible for comparison.

## Goals / Non-Goals

**Goals:**
- Replace `Modal` with `Drawer` (placement `right`) in `PassiveGridModal`
- State still commits on drawer close (`onClose` → `commit(draft)`)
- Width comparable to the current modal width (480 px)
- No change to content, store, helpers, types, or calculation paths

**Non-Goals:**
- Resizable drawer
- Changing when/how state commits (cancel-discards behaviour is future work)
- Any change to passive logic, multi calculation, or conditional-input wiring

## Decisions

### 1. Ant Design Drawer, placement right

`<Drawer placement="right" width={480} open={open} onClose={() => commit(draft)}>` replaces `<Modal>`.

The `Drawer` has no built-in footer with OK/Cancel — `onClose` is the single commit path, consistent with the existing behaviour where both OK and X already called `commit(draft)`.

### 2. Drop the Modal title prop, use Drawer title

`Drawer` accepts a `title` prop directly. Reuse `"Passives / Grid"`.

### 3. destroyOnHide vs destroyOnClose

Current modal uses `destroyOnClose={false}` to preserve draft state across open/close cycles. Drawer equivalent is `destroyOnClose={false}` (same prop name in antd v4). Keep as-is.

### 4. No style changes required

The existing `.passiveGridModal-*` class names and SCSS remain unchanged. The drawer provides its own scroll container; the content div does not need height adjustments.

## Risks / Trade-offs

- **antd v4 Drawer API**: The project uses antd 4.24.5. `Drawer` at this version supports `open` (preferred) alongside the deprecated `visible`. Use `open` to match the existing `Modal` usage in the codebase.
