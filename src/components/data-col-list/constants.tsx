import { EBaseStatFormFields } from "src/types";
import { EStatBoost, EStatDrops } from "src/types/base-stats";

export const DEFAULT_COL = {
  [EBaseStatFormFields.DATA_COL]: {
    [EBaseStatFormFields.STAT]: 0,
    [EBaseStatFormFields.GRID]: 0,
    [EBaseStatFormFields.STAT_BOOSTS]: EStatBoost.ZERO,
    [EBaseStatFormFields.DEF_DROPS]: EStatDrops.ZERO
  }
};
