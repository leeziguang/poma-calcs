---
name: generate-tracking-points
description: Generate tracking point constants for a page or feature from a user prompt and/or UI screenshot. Use when asked to add tracking, generate track points, add analytics events, or instrument a new page/section.
---

## What this skill does

Given a description (and optionally a UI screenshot) of a page or feature, generate a properly-typed tracking points constant and register it in `helpers.tsx`.

## Key files

- `src/_shared/tracking-points.ts` — where all per-page constants live
- `src/_shared/utils/helpers.tsx:1131` — where constants are registered via `Object.assign`

## TrackerPoint shape

```ts
// From src/_shared/utils/helpers.tsx
export type TrackerPoint = {
  tracker_id?: number;     // omit if not yet assigned by TMS
  operation?: string;      // usually 'click', 'pageview', 'impression'
  pageType?: string;       // e.g. 'ram_project_management'
  pageSection?: string;    // e.g. 'hdfs', 'hdfs_manage_storage'
  targetType?: string;     // the specific element, e.g. 'view_user_guide'
  userEmail?: string;      // injected at runtime — never hardcode
};
```

## Key naming convention

Key format: `{page}_{section}_{element}_{operation}`

Examples from `PROJ_M_HDFS_TRACK_PT`:
- `project_management_hdfs_user_guide_click`
- `project_management_hdfs_manage_storage_delete_file_click`
- `project_management_hdfs_small_file_merge_top_path_list_tab_click`

Rules:
- All lowercase, underscores only
- End with the operation (`_click`, `_view`, `_impression`)
- `pageSection` uses `__` (double underscore) to separate sub-sections, e.g. `hdfs_manage_storage__operation_list`

## Step-by-step

### 1. Derive the constant name

From the page/feature name, pick a constant like:
```
PROJ_M_{FEATURE}_TRACK_PT
```
Examples: `PROJ_M_KAFKA_TRACK_PT`, `PROJ_M_STARROCKS_TRACK_PT`

### 2. Identify all interactive elements

From the prompt or screenshot, list every:
- Button click
- Tab switch
- Filter/dropdown selection
- Table column sort
- Link click
- Modal action (confirm/cancel)

Each element → one entry in the constant.

### 3. Write the constant in `src/_shared/tracking-points.ts`

Append to the bottom of the file. Never edit existing constants.

```ts
import { TrackerPoint } from './utils/helpers';

export const PROJ_M_{FEATURE}_TRACK_PT: Record<string, TrackerPoint> = {
  {page}_{section}_{element}_click: {
    operation: 'click',
    pageType: 'ram_{page_type}',
    pageSection: '{section}',
    targetType: '{element}',
  },
  // ... one entry per interactive element
};
```

### 4. Use the constant directly in component files

Import the specific constant directly — do **not** import `TRACKING_POINTS` from helpers:

```ts
// Good
import { PROJ_M_PROJECT_MEMBER_TRACK_PT } from 'src/_shared/tracking-points';
tracker(PROJ_M_PROJECT_MEMBER_TRACK_PT.project_management_project_member_foo_click);

// Avoid
import { TRACKING_POINTS } from 'src/_shared/utils/helpers';
tracker(TRACKING_POINTS.project_management_project_member_foo_click);
```

`TRACKING_POINTS` is a merged aggregate used internally; components should reference the typed per-feature constant for clarity and type safety.

### 5. Register in `src/_shared/utils/helpers.tsx`

Append **after** the existing `Object.assign` line (line 1131). Never remove or modify existing `Object.assign` calls.

```ts
// Add the import at the top of helpers.tsx alongside the existing PROJ_M_HDFS_TRACK_PT import:
import { PROJ_M_{FEATURE}_TRACK_PT } from '../tracking-points';

// Add at the bottom of the file:
Object.assign(TrackingPoints, PROJ_M_{FEATURE}_TRACK_PT);
```

## Reading a screenshot

When a screenshot is provided:
1. Identify the page name from any title/breadcrumb visible
2. Scan for: buttons, tabs, dropdowns, links, table headers (sortable), action icons
3. For each element, determine: what section it lives in, what the element is, what the user action is
4. If sub-panels or modals are visible, treat each as its own `pageSection`

## Output checklist

- [ ] Constant name follows `PROJ_M_{FEATURE}_TRACK_PT` pattern
- [ ] All keys are lowercase with underscores
- [ ] All keys end with operation suffix (`_click`, `_view`, etc.)
- [ ] `pageSection` uses double-underscore for sub-sections
- [ ] No `tracker_id` unless explicitly provided by user (TMS assigns these later)
- [ ] Import added to `helpers.tsx`
- [ ] `Object.assign` line added after the last existing one
- [ ] Existing constants and assignments untouched
