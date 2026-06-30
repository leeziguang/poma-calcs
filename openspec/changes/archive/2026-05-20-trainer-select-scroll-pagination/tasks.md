## 1. Create PaginatedSelect Component

- [x] 1.1 Create `src/components/paginated-select/index.tsx` with a `PaginatedSelect` component
- [x] 1.2 Define `IPaginatedSelectProps` interface: `options` (full list, `DefaultOptionType[]`), `value`, `onChange`, `placeholder`, `pageSize` (optional, default 100)
- [x] 1.3 Add `page` state (`useState<number>(1)`) inside `PaginatedSelect`
- [x] 1.4 Add `searchValue` state (`useState<string>("")`) inside `PaginatedSelect`
- [x] 1.5 Add a `useEffect` that resets `page` to 1 whenever the `options` prop reference changes

## 2. Compute Displayed Options in PaginatedSelect

- [x] 2.1 Derive `displayedOptions`: when `searchValue` is non-empty return full `options` prop; otherwise return `options.slice(0, page * pageSize)`

## 3. Scroll Handler in PaginatedSelect

- [x] 3.1 Implement `handlePopupScroll(e: React.UIEvent<HTMLDivElement>)` that checks `scrollTop + clientHeight >= scrollHeight - 20` and increments `page`
- [x] 3.2 Guard the increment so it does not fire when `page * pageSize >= options.length`

## 4. Search Handler in PaginatedSelect

- [x] 4.1 Track `searchValue` via `onSearch` internally, updating state on each keystroke
- [x] 4.2 Clear `searchValue` on selection (inside an internal `handleChange` wrapper that calls the `onChange` prop)

## 5. Render Ant Design Select in PaginatedSelect

- [x] 5.1 Render `<Select>` with `options={displayedOptions}`, `onPopupScroll={handlePopupScroll}`, `onSearch`, `showSearch`
- [x] 5.2 Add `filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}`
- [x] 5.3 Forward `value`, `onChange` (via internal wrapper), and `placeholder` from props

## 6. Update ActionTopbar

- [x] 6.1 Remove `page`, `searchValue` state and all related handlers from `ActionTopbar`
- [x] 6.2 Replace the `<Select>` in `ActionTopbar` with `<PaginatedSelect options={trainerOptionList} value={selectedKey} onChange={handleSelect} placeholder="Select a trainer" />`
