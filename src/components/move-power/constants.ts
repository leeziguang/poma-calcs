export const MOVE_LEVEL_BOOST_MAP = {
  [1]: 1,
  [2]: 1.05,
  [3]: 1.1,
  [4]: 1.15,
  [5]: 1.2
} as Record<number, number>;

export const SYUN_MULTI = 0.1;
export const SM_PMUN_MULTI = 0.4;

export const MOVE_LEVEL_OPTIONS = Object.entries(MOVE_LEVEL_BOOST_MAP).map(
  ([level, multi]) => ({
    label: level,
    value: multi
  })
);

export const AOE_PENALTY_MAP = {
  [3]: 3 * 0.5,
  [2]: 2 * 0.66,
  [1]: 1
};
