---
name: development-conventions
description: React, antd v4, and MobX patterns for this codebase. Reference when implementing or reviewing components.
---

# DIRECTORY
Below is a directory link to skills that describe writing components or files in more detail
Read these files and **prioritize** the information from these skills over this general skill

[Modal](./create-modal/SKILL.mdc)
[Filter](./create-filter/SKILL.mdc)
[Store](./create-store/SKILL.mdc)
[Service](./create-service/SKILL.mdc)
[Styles](./create-styles/SKILL.mdc)
[Type](./create-type/SKILL.mdc)
[Validator](./create-validator/SKILL.mdc)


## React component identity

**Never define a component inside another component's function body.**

```tsx
// BAD — new component type on every render → unmount/remount children
const Parent = () => {
  const Child = ({ id }) => <div>{id}</div>;
  return <Child id={1} />;
};

// GOOD — stable reference, React reconciles in place
const Child = ({ id }) => <div>{id}</div>;
const Parent = () => <Child id={1} />;
```

Symptoms of this bug: child `Form.Item` validation errors disappear, `useRef` values reset, `useEffect` cleanup/re-run on every parent render. Fix by extracting the component to module scope. If it needs parent state, pass it as props or read from a MobX store via `observer`.

## antd Form — side effects

Use `useEffect` with `Form.useWatch` / `Form.useFormInstance` for side effects that depend on form values. Do **not** use `Promise.resolve().then()` inside `shouldUpdate` render props.

```tsx
// BAD — microtask hack in render prop
<Form.Item noStyle shouldUpdate>
  {({ getFieldValue, setFieldValue }) => {
    if (someCondition) {
      Promise.resolve().then(() => setFieldValue(path, value));
    }
    return <>{/* ... */}</>;
  }}
</Form.Item>

// GOOD — useEffect runs after render naturally
const form = Form.useFormInstance();
const watched = Form.useWatch(namePath, form);

useEffect(() => {
  if (someCondition) {
    form.setFieldValue(path, value);
  }
}, [someCondition, watched]);
```

Keep the `shouldUpdate` render prop for form binding (`getValueProps`, `getValueFromEvent`, conditional rendering that needs `getFieldValue`) — just remove the side effects from it.

## antd Form — stable NamePath for useWatch

When a `NamePath` array's contents never change between renders, use `useRef` to keep a stable reference. `Form.useWatch` may compare the path by reference internally.

```tsx
// BAD — new array reference every render
const path = ['alarmTypeVos', alertKey, 'field'] as NamePath;
const value = Form.useWatch(path, form);

// GOOD — stable reference, no dependency tracking overhead
const path = useRef(['alarmTypeVos', alertKey, 'field'] as NamePath).current;
const value = Form.useWatch(path, form);
```

`useMemo` is also acceptable but adds unnecessary dependency tracking when the inputs are truly static (e.g. a prop that never changes).

## MobX observable collection reactivity granularity

`ObservableSet.has(key)` notifies **all** observers when any key changes — not per-key. `ObservableMap.has(key)` / `ObservableMap.get(key)` tracks per-key, so only observers that read a specific key re-render when that key changes.

Prefer `ObservableMap<K, true>` over `ObservableSet<K>` when each item in a list observes its own key (e.g. selected state per row/cell):

```tsx
// BAD — toggling any cell re-renders ALL observer cells
const selected = observable.set<number>();
// in HexCell observer: selected.has(cell.id) → full-set dependency

// GOOD — toggling cell 3 only re-renders the cell that called has(3)
const selected = observable.map<number, true>();
// in HexCell observer: selected.has(cell.id) → per-key dependency
```

## MobX + observer

When extracting a component to module scope and it reads MobX observables, wrap it in `observer()`. Access store properties directly rather than passing them through closures from a parent.

```tsx
// Component reads alertModalStore — must be observer
const CollapseContent = observer(({ alertKey }) => {
  const keys = alertModalStore.activeCollapseKeys;
  // ...
});
```
