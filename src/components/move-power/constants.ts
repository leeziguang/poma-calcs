export const SYUN_MULTI = 0.1;
export const SM_PMUN_MULTI = 0.4;

export const AOE_PENALTY_MAP = {
  [3]: 3 * 0.5,
  [2]: 2 * 0.66,
  [1]: 1
};

// passive skill ids whose child nodes remain selectable in the tree
export const PASSIVES_WITH_SELECTABLE_CHILDREN = new Set<string>();
