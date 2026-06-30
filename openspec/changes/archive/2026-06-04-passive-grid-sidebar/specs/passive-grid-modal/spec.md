## MODIFIED Requirements

### Requirement: PassiveGridModal component uses a Drawer, not a Modal
`src/components/passive-grid-modal/index.tsx` SHALL render an Ant Design `Drawer` (placement `right`, width `480`) instead of a `Modal`. All internal content (default passive list, extra-passive picker, region-members select, conditional inputs) remains unchanged.

#### Scenario: Drawer opens from the right
- **WHEN** the user clicks the trigger button in the pair toolbar
- **THEN** the `PassiveGridModal` Drawer SHALL slide in from the right side of the viewport

#### Scenario: State commits on Drawer close
- **WHEN** the user closes the Drawer (X button or overlay click)
- **THEN** `passiveStore.setPairPassiveState(pairFieldName, draft)` SHALL be called, identical to the former modal dismiss behaviour

## REMOVED Requirements

### Requirement: PassiveGridModal has an OK button
**Reason**: Drawer has no built-in footer action bar. The single `onClose` path replaces both `onOk` and `onCancel`.
**Migration**: Remove `onOk` prop. State commitment moves entirely to `onClose`.
