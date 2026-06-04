import { EMovePassive, IPassiveMultiParam } from "src/types/passive";
import { EMoveCategory } from "src/types/move";

export const SYUN_MULTI = 0.1;
export const SM_PMUN_MULTI = 0.4;

export const AOE_PENALTY_MAP = {
  [3]: 3 * 0.5,
  [2]: 2 * 0.66,
  [1]: 1
};

/**
 * @description Extra labels appended to a passive's tooltip when these description-part tags appear in the parent's passive_skill_description_en entry but are not represented in passiveSkillChildIds
 */
export const PASSIVE_REGION_TAGS = new Set<string>(Object.values(EMovePassive));

export const EXTRA_DESC_TAG_LABELS: Record<string, string> = {
  [EMovePassive.EX_MF]: "EX MF Passive",
  [EMovePassive.SINNOH_ALL]: "Sinnoh Flag Bearer"
};

export const PASSIVE_MOVE_MULTI_MAP = ({
  regionMembers = 1,
  moveCategory
}: IPassiveMultiParam): Record<string, number> => {
  const phys = moveCategory !== EMoveCategory.SPECIAL;
  const spec = moveCategory !== EMoveCategory.PHYSICAL;

  return {
    [EMovePassive.EX_MF]: 0.2 + 0.15 * (regionMembers - 1),
    ...(phys && {
      [EMovePassive.REGION_PHYS]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EMovePassive.REGION_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(phys && {
      [EMovePassive.HOENN_PHYS]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EMovePassive.HOENN_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EMovePassive.ALOLA_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    [EMovePassive.REGION_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EMovePassive.SINNOH_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EMovePassive.ALOLA_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EMovePassive.HOENN_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EMovePassive.UNOVA_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EMovePassive.GALAR_ALL]: 0.1 + 0.1 * (regionMembers - 1)
  };
};

export const PASSIVE_SYNC_MULTI_MAP = ({
  regionMembers = 1
}: IPassiveMultiParam): Record<string, number> => ({
  [EMovePassive.EX_MF]: 0.2 + 0.15 * (regionMembers - 1)
});
