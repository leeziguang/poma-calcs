/**
 * @description Name of passive = pXXXXXX from passiveSkillDescriptionPartsEn
 */
export enum EMovePassive {
  //
  // regionals
  EX_MF = "p997774",
  REGION_SPEC = "p999234",
  REGION_PHYS = "p999235",
  REGION_ALL = "p999295",
  HOENN_SPEC = "p999506",
  HOENN_PHYS = "p999507",
  HOENN_ALL = "p999548",
  SINNOH_ALL = "p999394",
  UNOVA_ALL = "p999556",
  ALOLA_SPEC = "p999427",
  ALOLA_ALL = "p999547",
  GALAR_ALL = "p999563",

  //
  // stat boosts
  FURIOUS_BRAIN = "p999566",
  FURIOUS_BRAWN = "p999579",
  RAMMING_SPEED = "p999585",
  TOUGH_COOKIE = "p999584",
  SMART_COOKIE = "p999581",
  BOB_AND_WEAVE = "p999580",
  BRUTAL_CLARITY = "p999577",
  GOOD_FORM = "p999550"
}

export enum ESyncPassive {
  //
  // regionals
  EX_MF = "p997774",

  //
  // stat boosts
  BRAINPOWER = "p999297",
  HAYMAKER = "p999587",
  INERTIA = "p999583",
  TOWERING_FORCE = "p999448",
  BRUTE_WITS = "p999447",
  BLIND_SPOT = "p999586",
  // doesnt exist
  __ACCURACY__ = "",
  RISING_TIDE = "p999574"
}

import { EMoveCategory } from "./move";

export interface IPassiveMultiParam {
  regionMembers?: number;
  moveCategory?: EMoveCategory;
}

export type IPassiveSkillNames = Record<string, string>;
export type IPassiveSkillNameParts = Record<string, string>;

export interface IPassiveSkillChild {
  passiveSkillId: number;
  passiveSkillChildIds: string[];
}

export interface IPassiveSkillChildApiResponse {
  entries: IPassiveSkillChild[];
}

export interface IMoveAndPassiveSkillDigit {
  id: string;
  param1: string;
  param2: string;
  param3: string;
  param4: string;
  param5: string;
  param6: string;
  param7: string;
  param8: string;
  param9: string;
  param10: string;
  param11: string;
  param12: string;
  param13: string;
  param14: string;
  param15: string;
  param16: string;
  param17: string;
  param18: string;
  param19: string;
  param20: string;
  param21: string;
  param22: string;
  param23: string;
  param24: string;
  param25: string;
  param26: string;
  param27: string;
  param28: string;
  param29: string;
  param30: string;
  param31: string;
  param32: string;
  param33: string;
  param34: string;
  param35: string;
  param36: string;
  param37: string;
  param38: string;
  param39: string;
  param40: string;
  param41: string;
  param42: string;
  param43: string;
  param44: string;
  param45: string;
  param46: string;
  param47: string;
  param48: string;
  param49: string;
  param50: string;
}

export interface IMoveAndPassiveSkillDigitApiResponse {
  entries: IMoveAndPassiveSkillDigit[];
}

export interface IDefaultPassiveOption {
  value: string;
  title: string;
  children: { title: string }[];
}
