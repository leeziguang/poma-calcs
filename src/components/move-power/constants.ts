import { EPassiveSkill, IPassiveMultiParam } from "src/types/passive";
import { EMoveCategory } from "src/types/move";

export const SYUN_MULTI = 0.1;
export const SM_PMUN_MULTI = 0.4;

export const AOE_PENALTY_MAP = {
  [3]: 3 * 0.5,
  [2]: 2 * 0.66,
  [1]: 1
};

// extra labels appended to a passive's tooltip when these description-part
// tags appear in the parent's passive_skill_description_en entry but are not
// represented in passiveSkillChildIds
export const PASSIVE_REGION_TAGS = new Set<string>(
  Object.values(EPassiveSkill)
);

export const EXTRA_DESC_TAG_LABELS: Record<string, string> = {
  [EPassiveSkill.EX_MF]: "EX MF Passive",
  [EPassiveSkill.SINNOH_ALL]: "Sinnoh Flag Bearer"
};

export const PASSIVE_MOVE_MULTI_MAP = ({
  regionMembers = 1,
  moveCategory
}: IPassiveMultiParam): Record<string, number> => {
  const phys = moveCategory !== EMoveCategory.SPECIAL;
  const spec = moveCategory !== EMoveCategory.PHYSICAL;
  return {
    [EPassiveSkill.EX_MF]: 0.2 + 0.15 * (regionMembers - 1),
    ...(phys && {
      [EPassiveSkill.REGION_PHYS]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EPassiveSkill.REGION_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(phys && {
      [EPassiveSkill.HOENN_PHYS]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EPassiveSkill.HOENN_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    ...(spec && {
      [EPassiveSkill.ALOLA_SPEC]: 0.2 + 0.15 * (regionMembers - 1)
    }),
    [EPassiveSkill.REGION_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EPassiveSkill.SINNOH_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EPassiveSkill.ALOLA_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EPassiveSkill.HOENN_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EPassiveSkill.UNOVA_ALL]: 0.1 + 0.1 * (regionMembers - 1),
    [EPassiveSkill.GALAR_ALL]: 0.1 + 0.1 * (regionMembers - 1)
  };
};

export const PASSIVE_SYNC_MULTI_MAP = ({
  regionMembers = 1
}: IPassiveMultiParam): Record<string, number> => ({
  [EPassiveSkill.EX_MF]: 0.2 + 0.15 * (regionMembers - 1)
});
