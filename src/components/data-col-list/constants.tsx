import { EBaseStatFormFields, EMovePowerFormFields } from "src/types";
import { EStatBoost, EStatDrops } from "src/types/base-stats";

export const DEFAULT_COL = {
  [EBaseStatFormFields.STAT]: 0,
  [EBaseStatFormFields.GRID]: 0,
  [EBaseStatFormFields.STAT_BOOSTS]: EStatBoost.PLUS_6,
  [EBaseStatFormFields.DEF_DROPS]: EStatDrops.ZERO,
  [EMovePowerFormFields.MOVE_LVL]: 1,
  [EMovePowerFormFields.BASE_MOVE]: 0,
  [EMovePowerFormFields.GRID]: 0,
  [EMovePowerFormFields.OPTIONS]: [] as string[],
  [EMovePowerFormFields.SYUN]: 0,
  [EMovePowerFormFields.SM_PMUN]: 0,
  [EMovePowerFormFields.MULTIS]: 0,
  [EMovePowerFormFields.INNATE_MULTIS]: 0
};
