# Tasks

## passive-grid-modal → Drawer

- [x] In `src/components/passive-grid-modal/index.tsx`, replace `Modal` import from antd with `Drawer`
- [x] Replace `<Modal title="Passives / Grid" open={open} onOk={() => commit(draft)} onCancel={() => commit(draft)} width={480} destroyOnClose={false}>` with `<Drawer title="Passives / Grid" placement="right" open={open} onClose={() => commit(draft)} width={480} destroyOnClose={false}>`
- [x] Remove the `onOk` call site (Drawer has no OK button)
- [x] Verify no other props specific to Modal remain (e.g. `destroyOnClose` is valid on Drawer too — keep it)
- [x] Confirm the component renders and passive state still commits on close
