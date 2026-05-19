export enum EMovePowerFormFields {
  BASE_MOVE = "BASE_MOVE",
  MOVE_LVL = "MOVE_LVL",
  GRID = "MOVE_GRID",
  SM_PMUN = "SM_PMUN",
  SYUN = "SYUN",
  MULTIS = "MULTIS",
  INNATE_MULTIS = "INNATE_MULTIS",
  EXTRA_NOTES = "MOVE_EXTRA_NOTES",
  OPTIONS = "OPTIONS",
  IS_TECH = "IS_TECH",
  IS_TERA = "IS_TERA",
  IS_SYNC = "IS_SYNC",
  IS_AOE = "IS_AOE",
  IGNORE_AOE_PENALTY = "IGNORE_AOE_PENALTY"
}

export interface ICalcMovePowerArgs {
  base: number;
  moveLvl: string;
  grid?: number;
  options?: IMovePowerFormValues["OPTIONS"];
  smpmun?: number;
  multis?: number;
  innate?: number;
}

export interface ICalcSyncPowerArgs {
  base: number;
  moveLvl: string;
  grid?: number;
  options?: IMovePowerFormValues["OPTIONS"];
  syun?: number;
  multis?: number;
  innate?: number;
}

export interface IMovePowerFormValues {
  [EMovePowerFormFields.BASE_MOVE]: number;
  [EMovePowerFormFields.MOVE_LVL]: string;
  [EMovePowerFormFields.GRID]: number;
  [EMovePowerFormFields.SM_PMUN]?: number;
  [EMovePowerFormFields.SYUN]?: number;
  [EMovePowerFormFields.MULTIS]: number;
  [EMovePowerFormFields.INNATE_MULTIS]: number;
  [EMovePowerFormFields.EXTRA_NOTES]: string;
  [EMovePowerFormFields.OPTIONS]: (
    | EMovePowerFormFields.IS_TECH
    | EMovePowerFormFields.IS_TERA
    | EMovePowerFormFields.IS_SYNC
    | EMovePowerFormFields.IS_AOE
    | EMovePowerFormFields.IGNORE_AOE_PENALTY
  )[];
}
