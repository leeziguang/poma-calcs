export enum EFieldEffectFormFields {
  SYNC_BOOSTS = "SYNC_BOOSTS",
  WTZ = "WTZ",
  CIRCLE = "CIRCLE",
  REBUFF = "REBUFF",
  SEUN = "SEUN",
  EXTRA_NOTES = "FIELD_EXTRA_NOTES",
  CIRCLE_MULTI = "CIRCLE_MULTI",
  MEMBERS = "MEMBERS"
}

interface ICircleData {
  [EFieldEffectFormFields.CIRCLE_MULTI]: number;
  [EFieldEffectFormFields.MEMBERS]: number;
}

export interface IFieldEffectFormValues {
  [EFieldEffectFormFields.SYNC_BOOSTS]: number;
  [EFieldEffectFormFields.WTZ]: number;
  [EFieldEffectFormFields.CIRCLE]: ICircleData[];
  [EFieldEffectFormFields.REBUFF]: number;
  [EFieldEffectFormFields.SEUN]: boolean;
  [EFieldEffectFormFields.EXTRA_NOTES]: string;
}

export enum EWTZ {
  NONE = "None",
  NORMAL = "Normal",
  EX = "EX"
}

export enum ECircle {
  PHYS_SPEC = "Phys/Spec",
  DEF = "Defensive"
}

export interface ICalcFieldEffectArg {
  syncBoosts: number;
  wtz: number;
  circle: ICircleData[];
  rebuff: number;
  seun: boolean;
}
