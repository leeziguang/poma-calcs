## 1. Types & Store

- [x] 1.1 Add `IPairPassiveState` interface to `src/types/passive.ts` (`regionMembers`, `extraPassives`, `conditionalParams`)
- [x] 1.2 Add `pairPassiveState: ObservableMap<number, IPairPassiveState>` observable to `PassiveStore`
- [x] 1.3 Add `setPairPassiveState` action to `PassiveStore`
- [x] 1.4 Add `clearPairPassiveState` action to `PassiveStore`
- [x] 1.5 Register new observables and actions in `makeObservable`

## 2. PassiveGridModal Component

- [x] 2.1 Create `src/components/passive-grid-modal/index.tsx` with `PassiveGridModal` accepting `pairFieldName: number`
- [x] 2.2 Create `src/components/passive-grid-modal/style.scss` (with `@import url("/src/styles/variable.less")` — use `.less` if project convention requires, else `.scss`)
- [x] 2.3 Create `src/components/passive-grid-modal/constants.ts` with `CONDITIONAL_PASSIVE_INPUTS` map (`RISING_TIDE`: label "Atk stacks" min 1 max 6; `GOOD_FORM`: label "Raised stats" min 1 max 41)
- [x] 2.4 Implement modal open/close state (local `useState` for `visible`)
- [x] 2.5 Initialize local draft state from `passiveStore.pairPassiveState.get(pairFieldName)` on open
- [x] 2.6 Render default passives via `genPassiveList` in a `Collapse` panel labeled "Passives"
- [x] 2.7 Render tooltip (`QuestionCircleOutlined`) beside passives with child descriptions
- [x] 2.8 For each regional passive (via `passiveHasRegionTag`), render inline `Select` (options 1–3, default 1) bound to draft `regionMembers`
- [x] 2.9 For each passive matching `CONDITIONAL_PASSIVE_INPUTS`, render inline `InputNumber` with configured label/min/max bound to draft `conditionalParams[passiveId]`
- [x] 2.10 Render "Extra Passives" section with add button (`PlusCircleOutlined`) and per-row delete (`DeleteOutlined`)
- [x] 2.11 Each extra passive row renders a `Select` populated from all available passives (use existing `passiveStore.passiveSkillNamesEn` options)
- [x] 2.12 `onOk` calls `passiveStore.setPairPassiveState(pairFieldName, draft)` then closes modal
- [x] 2.13 `onCancel` (X / overlay close) also calls `passiveStore.setPairPassiveState(pairFieldName, draft)` then closes modal

## 3. DataColList Integration

- [x] 3.1 Import `PassiveGridModal` in `src/components/data-col-list/index.tsx`
- [x] 3.2 Add local `useState<boolean>` for modal visibility
- [x] 3.3 Render "VIEW PASSIVE/GRID" `Button` between the Moves `Form.Item` and `TotalDamageDisplay`
- [x] 3.4 Render `<PassiveGridModal pairFieldName={pairFieldName} visible={...} onClose={...} />` in the component tree
- [x] 3.5 In existing `useEffect` cleanup (`pairStore.init()`), also call `passiveStore.clearPairPassiveState(pairFieldName)` on unmount

## 4. MovePower Cleanup

- [x] 4.1 Remove `hasRegionPassive` memo and its `passiveHasRegionTag` call from `MovePower`
- [x] 4.2 Remove the `REGION_MEMBERS` `Form.Item` block (lines 266–279 in current `index.tsx`)
- [x] 4.3 Remove `regionMembers` form-watch derivation from `MovePower`
- [x] 4.4 Update `calcDefaultMultis` call in `MovePower` to read `regionMembers` from `passiveStore.pairPassiveState.get(pairFieldName)?.regionMembers ?? 1`
- [x] 4.5 Remove `renderDefaultPassive` function and its `{renderDefaultPassive()}` call from `MovePower` JSX
- [x] 4.6 Remove `Form.List` for `EMovePowerFormFields.PASSIVES` from `MovePower` (extra passives moved to modal)
- [x] 4.7 Remove unused imports from `MovePower` (`PlusCircleOutlined`, `DeleteOutlined`, `QuestionCircleOutlined`, `Tooltip`, `passiveHasRegionTag`, `PASSIVE_REGION_TAGS`, `genPassiveList`)

## 5. Verification

- [x] 5.1 Run `yarn build` (or `npm run build`) — zero TypeScript errors
- [ ] 5.2 Open app, select a trainer with regional passives, open modal — region Select renders with default 1
- [ ] 5.3 Change region Select to 3, close modal, reopen — value persists
- [ ] 5.4 Confirm `Passive & Grid Multis` field in `MovePower` still auto-calculates correctly using store `regionMembers`
- [ ] 5.5 Delete a pair — confirm no stale state errors in console
