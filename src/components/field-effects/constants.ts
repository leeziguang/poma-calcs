import { ECircle, EWTZ } from "src/types/data-col-list/field-effect";

export const WTZ_MULTI_MAP = {
  [EWTZ.NONE]: 1,
  [EWTZ.NORMAL]: 1.5,
  [EWTZ.EX]: 3
};

export const WTZ_OPTIONS = Object.entries(WTZ_MULTI_MAP).map(
  ([wtz, multi]) => ({
    label: wtz,
    value: multi
  })
);

export const CIRCLE_MULTI_MAP = {
  [ECircle.PHYS_SPEC]: 0.1,
  [ECircle.DEF]: 0.05
};

export const CIRCLE_OPTIONS = Object.entries(CIRCLE_MULTI_MAP).map(
  ([circle, multi]) => ({
    label: circle,
    value: multi
  })
);

export const REBUFF_MULTI_MAP = {
  [0]: 1,
  [1]: 1.3,
  [2]: 1.5,
  [3]: 1.6,
  [4]: 1.9,
  [5]: 2.1,
  [6]: 2.2
} as Record<number, number>;

export const REBUFF_OPTIONS = [0, 1, 2, 3, 4, 5, 6].map(opt => ({
  label: `-${opt}`,
  value: REBUFF_MULTI_MAP[opt]
}));
