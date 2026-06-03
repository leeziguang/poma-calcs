import { EPassiveSkill, IPassiveMultiParam } from "src/types/passive";

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
export const EXTRA_DESC_TAG_LABELS: Record<string, string> = {
  [EPassiveSkill.EX_MF]: "EX MF Passive",
  [EPassiveSkill.SINNOH_FLAG]: "Sinnoh Flag Bearer"
};

export const PASSIVE_MOVE_MULTI_MAP = ({
  regionMembers = 1
}: IPassiveMultiParam): Record<string, number> => ({
  [EPassiveSkill.EX_MF]: 0.2 + 0.15 * regionMembers,
  [EPassiveSkill.SINNOH_FLAG]: 0.1 + 0.1 * regionMembers
});

export const PASSIVE_SYNC_MULTI_MAP = ({
  regionMembers = 1
}: IPassiveMultiParam): Record<string, number> => ({
  [EPassiveSkill.EX_MF]: 0.2 + 0.15 * regionMembers
});
