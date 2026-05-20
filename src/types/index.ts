import { IBaseStatFormValues } from "./data-col-list/base-stats";
import { IFieldEffectFormValues } from "./data-col-list/field-effect";
import { IMovePowerFormValues } from "./data-col-list/move-power";

export enum EPairListFormFields {
  PAIR = "PAIR",
  DATA_COL = "DATA_COL",
  MOVE_LVL = "MOVE_LVL",
  LVL = "LVL",
  MONSTER_ID = "MONSTER_ID",
  MOVE_ID = "MOVE_ID",
  TRAINER_ID = "TRAINER_ID"
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
