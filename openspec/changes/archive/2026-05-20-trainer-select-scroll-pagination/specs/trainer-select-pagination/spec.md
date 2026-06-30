## ADDED Requirements

### Requirement: PaginatedSelect component is generic
`src/components/paginated-select/index.tsx` SHALL export a generic `PaginatedSelect<T>` component. Props are `items: T[]` (full source array), `mapOption: (item: T) => DefaultOptionType` (maps each item to an Ant Design option), `value`, `onChange`, `placeholder?`, and `pageSize?` (optional, defaults to 25). Displayed options are deduplicated by `value` using `uniqBy`.

#### Scenario: Props accept a generic typed list
- **WHEN** `PaginatedSelect` is mounted with `items` of any type `T`
- **THEN** `mapOption` converts each `T` to a `DefaultOptionType`
- **AND** the component renders without requiring a pre-mapped `DefaultOptionType[]`

### Requirement: Initial options list is paginated
The component SHALL render only the first `pageSize` (default 25) options on initial open. The full `items` array is held in memory but only a slice is mapped and passed to Ant Design `Select`.

#### Scenario: Dropdown opens with large list
- **WHEN** `items` contains more than `pageSize` entries
- **THEN** only the first `pageSize` items are mapped and passed to the Select `options` prop on first open

#### Scenario: Dropdown opens with small list
- **WHEN** `items` contains `pageSize` or fewer entries
- **THEN** all items are mapped and no pagination occurs

### Requirement: Scroll to bottom appends next page
The component SHALL listen to the `onPopupScroll` event and append the next `pageSize` items when the user scrolls within 20px of the bottom.

#### Scenario: User scrolls near the bottom with more pages available
- **WHEN** `scrollTop + clientHeight >= scrollHeight - 20` inside the dropdown
- **AND** `page * pageSize < items.length`
- **THEN** `page` increments by 1 and the next slice is appended to displayed options

#### Scenario: User scrolls near the bottom on the last page
- **WHEN** all items are already displayed (`page * pageSize >= items.length`)
- **THEN** no state update occurs

### Requirement: Search filters internally across all items
When a search query is active, the component SHALL filter all `items` using a case-insensitive label match. Ant Design's built-in `filterOption` is disabled (`filterOption={false}`); filtering is performed in `displayedOptions` by applying `mapOption` to all items and matching on the resulting label string.

#### Scenario: User types a search query
- **WHEN** the user types a non-empty string into the Select search input
- **THEN** all items are mapped and filtered by case-insensitive label inclusion
- **AND** results are deduplicated by `value`

#### Scenario: User clears the search query
- **WHEN** the search input is cleared (value becomes empty string)
- **THEN** options revert to the paginated slice (`items.slice(0, page * pageSize)`)

#### Scenario: Selection clears the search value
- **WHEN** the user selects an option
- **THEN** `searchValue` is reset to `""` and the `onChange` prop is called

### Requirement: Page resets when items reference changes
The `page` counter SHALL reset to 1 via `useEffect` whenever the `items` prop reference changes.

#### Scenario: Items prop reference changes
- **WHEN** the `items` prop reference changes (e.g. store reloads data)
- **THEN** `page` resets to 1 and the dropdown shows only the first `pageSize` items

### Requirement: PaginatedSelect is available but not yet integrated into ActionTopbar
The `PaginatedSelect` component is complete and available at `src/components/paginated-select/index.tsx`. It is NOT currently used in `ActionTopbar`. The trainer dropdown performance optimisation was instead achieved by shifting option computation to app init time — the container pre-builds `trainerStore.trainerOptionsList` once all APIs resolve, so `ActionTopbar` renders all options immediately using a plain Ant Design `Select`. `PaginatedSelect` is retained for future use in other dropdowns that cannot pre-load their full option list.

#### Scenario: Trainer options pre-loaded at app init
- **WHEN** the container finishes loading all store APIs (trainer, trainerBase, trainerNames, monsterBase, monsterNames)
- **THEN** `trainerStore.setTrainerOptionsList(...)` is called with fully-labelled options
- **AND** `ActionTopbar` renders all options immediately without client-side pagination via `PaginatedSelect`
