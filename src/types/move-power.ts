import { IMovePowerFormValues } from ".";

export interface ICalcMovePowerArgs {
  base: number;
  moveLvlMulti: number;
  grid?: number;
  options?: IMovePowerFormValues["OPTIONS"];
  smpmun?: number;
  multis?: number;
  innate?: number;
}

export interface ICalcSyncPowerArgs {
  base: number;
  moveLvlMulti: number;
  grid?: number;
  options?: IMovePowerFormValues["OPTIONS"];
  syun?: number;
  multis?: number;
  innate?: number;
}
