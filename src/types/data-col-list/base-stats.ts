export enum EStatBoost {
  ZERO = "ZERO",
  PLUS_1 = "PLUS_1",
  PLUS_2 = "PLUS_2",
  PLUS_3 = "PLUS_3",
  PLUS_4 = "PLUS_4",
  PLUS_5 = "PLUS_5",
  PLUS_6 = "PLUS_6"
}

export enum EStatDrops {
  ZERO = "ZERO",
  MINUS_1 = "MINUS_1",
  MINUS_2 = "MINUS_2",
  MINUS_3 = "MINUS_3",
  MINUS_4 = "MINUS_4",
  MINUS_5 = "MINUS_5",
  MINUS_6 = "MINUS_6"
}

export enum EBaseStatFormFields {
  STAT = "STAT",
  GRID = "STAT_GRID",
  STAT_BOOSTS = "STAT_BOOSTS",
  DEF_DROPS = "DEF_DROPS"
}

export interface IBaseStatFormValues {
  [EBaseStatFormFields.STAT]: number;
  [EBaseStatFormFields.GRID]: number;
  [EBaseStatFormFields.STAT_BOOSTS]: EStatBoost;
  [EBaseStatFormFields.DEF_DROPS]: EStatDrops;
}
