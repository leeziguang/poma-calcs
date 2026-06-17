import {
  EMovePassive,
  ESyncPassive,
  IPairPassiveState
} from "src/types/passive";

export const DEFAULT_STATE: IPairPassiveState = {
  regionMembers: 1,
  extraPassives: [],
  conditionalParams: {}
};

export interface IConditionalPassiveInput {
  label: string;
  min: number;
  max: number;
}

export const CONDITIONAL_PASSIVE_INPUTS: Record<
  string,
  IConditionalPassiveInput
> = {
  [ESyncPassive.RISING_TIDE]: { label: "SYNC: Stats", min: 1, max: 18 },
  [EMovePassive.GOOD_FORM]: { label: "MOVE: Stats", min: 1, max: 41 },
  [EMovePassive.EX_MF]: { label: "EX MF", min: 1, max: 3 },
  [EMovePassive.REGION_ALL]: { label: "REGION: All", min: 1, max: 3 },
  [EMovePassive.REGION_PHYS]: { label: "REGION: Phys", min: 1, max: 3 },
  [EMovePassive.REGION_SPEC]: { label: "REGION: Spec", min: 1, max: 3 }
};

export const EXTRA_PASSIVES: Record<string, string> = {
  [EMovePassive.EX_MF]: "EX MF",
  [EMovePassive.REGION_ALL]: "REGION ALL",
  [EMovePassive.REGION_PHYS]: "REGION PHYS",
  [EMovePassive.REGION_SPEC]: "REGION SPEC"
};

export const EXTRA_PASSIVE_OPT = Object.entries(
  EXTRA_PASSIVES
).map(([k, v]) => ({ label: v, value: k }));
