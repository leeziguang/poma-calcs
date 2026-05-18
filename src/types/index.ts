import { IBaseStatFormValues } from "./base-stats";
import { IFieldEffectFormValues } from "./field-effect";
import { IMovePowerFormValues } from "./move-power";

export enum EPairListFormFields {
  PAIR = "PAIR",
  DATA_COL = "DATA_COL",
  MOVE_LVL = "MOVE_LVL",
  LVL = "LVL"
}

export interface IPairListFormValues {
  [EPairListFormFields.PAIR]: {
    [EPairListFormFields.DATA_COL]: (IBaseStatFormValues &
      IMovePowerFormValues &
      IFieldEffectFormValues)[];
  };
}

export enum EMoveLevelValues {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  "SA 1" = "SA 1",
  "SA 2" = "SA 2",
  "SA 3" = "SA 3",
  "SA 4" = "SA 4",
  "SA 5" = "SA 5"
}
