import { IBaseStatFormValues } from "./base-stats";
import { IMovePowerFormValues } from "./move-power";

export enum EPairListFormFields {
  PAIR = "PAIR",
  DATA_COL = "DATA_COL"
}

export interface IPairListFormValues {
  [EPairListFormFields.PAIR]: {
    [EPairListFormFields.DATA_COL]: (IBaseStatFormValues &
      IMovePowerFormValues)[];
  };
}
