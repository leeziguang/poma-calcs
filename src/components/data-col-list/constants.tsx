import {
  EBaseStatFormFields,
  EStatBoost,
  EStatDrops
} from "src/types/data-col-list/base-stats";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import {
  EWTZ,
  EFieldEffectFormFields,
  IFieldEffectFormValues
} from "src/types/data-col-list/field-effect";
import { REBUFF_MULTI_MAP, WTZ_MULTI_MAP } from "../field-effects/constants";
import { MOVE_LEVEL_OPTIONS } from "../global-toolbar/constants";
import { EMoveLevelValues } from "src/types";

export const DEFAULT_COL = {
  [EBaseStatFormFields.STAT]: 0,
  [EBaseStatFormFields.GRID]: 0,
  [EBaseStatFormFields.STAT_BOOSTS]: EStatBoost.PLUS_6,
  [EBaseStatFormFields.DEF_DROPS]: EStatDrops.ZERO,
  [EMovePowerFormFields.MOVE_LVL]: MOVE_LEVEL_OPTIONS[EMoveLevelValues.ONE],
  [EMovePowerFormFields.BASE_MOVE]: 0,
  [EMovePowerFormFields.GRID]: 0,
  [EMovePowerFormFields.OPTIONS]: [] as string[],
  [EMovePowerFormFields.SYUN]: 0,
  [EMovePowerFormFields.SM_PMUN]: 0,
  [EMovePowerFormFields.MULTIS]: 0,
  [EMovePowerFormFields.INNATE_MULTIS]: 0,
  [EFieldEffectFormFields.SYNC_BOOSTS]: 0,
  [EFieldEffectFormFields.WTZ]: WTZ_MULTI_MAP[EWTZ.NONE],
  [EFieldEffectFormFields.REBUFF]: REBUFF_MULTI_MAP[0],
  [EFieldEffectFormFields.CIRCLE]: [] as IFieldEffectFormValues[EFieldEffectFormFields.CIRCLE],
  [EFieldEffectFormFields.SEUN]: false
};
