export enum EMonsterFields {
  MONSTER_ID = "monsterId",
  MONSTER_BASE_ID = "monsterBaseId",
  SYNC_MOVE_ID = "syncMoveId",
  HP_VALUES = "hpValues",
  ATK_VALUES = "atkValues",
  DEF_VALUES = "defValues",
  SPA_VALUES = "spaValues",
  SPD_VALUES = "spdValues",
  SPE_VALUES = "speValues",
  MOVE1_CHANGE_ID = "move1ChangeId",
  MOVE2_CHANGE_ID = "move2ChangeId",
  MOVE3_CHANGE_ID = "move3ChangeId",
  MOVE4_CHANGE_ID = "move4ChangeId"
}

export interface IMonster {
  [EMonsterFields.MONSTER_ID]: string;
  [EMonsterFields.MONSTER_BASE_ID]: number;
  [EMonsterFields.SYNC_MOVE_ID]: number;
  [EMonsterFields.HP_VALUES]: number[];
  [EMonsterFields.ATK_VALUES]: number[];
  [EMonsterFields.DEF_VALUES]: number[];
  [EMonsterFields.SPA_VALUES]: number[];
  [EMonsterFields.SPD_VALUES]: number[];
  [EMonsterFields.SPE_VALUES]: number[];
  [EMonsterFields.MOVE1_CHANGE_ID]: number;
  [EMonsterFields.MOVE2_CHANGE_ID]: number;
  [EMonsterFields.MOVE3_CHANGE_ID]: number;
  [EMonsterFields.MOVE4_CHANGE_ID]: number;
}

export interface IMonsterApiResponse {
  entries: IMonster[];
}

export enum EMonsterBaseFields {
  MONSTER_BASE_ID = "monsterBaseId",
  ACTOR_ID = "actorId",
  ACTOR_NUMBER = "actorNumber",
  ACTOR_VARIANT = "actorVariant",
  U5 = "u5",
  JP_NAME = "jpName",
  U7 = "u7",
  GENDER = "gender",
  U9 = "u9",
  STRENGTH = "strength",
  U11 = "u11",
  FORM_PASSIVE_ID = "formPassiveId",
  U13 = "u13",
  U14 = "u14",
  FORM_ID = "formId",
  MONSTER_NAME_ID = "monsterNameId",
  IS_SHINY = "isShiny"
}

export interface IMonsterBase {
  [EMonsterBaseFields.MONSTER_BASE_ID]: number;
  [EMonsterBaseFields.ACTOR_ID]: string;
  [EMonsterBaseFields.ACTOR_NUMBER]: number;
  [EMonsterBaseFields.ACTOR_VARIANT]: number;
  [EMonsterBaseFields.U5]: number;
  [EMonsterBaseFields.JP_NAME]: string;
  [EMonsterBaseFields.U7]: number;
  [EMonsterBaseFields.GENDER]: number;
  [EMonsterBaseFields.U9]: number;
  [EMonsterBaseFields.STRENGTH]: number;
  [EMonsterBaseFields.U11]: number;
  [EMonsterBaseFields.FORM_PASSIVE_ID]: number;
  [EMonsterBaseFields.U13]: number;
  [EMonsterBaseFields.U14]: number;
  [EMonsterBaseFields.FORM_ID]: number;
  [EMonsterBaseFields.MONSTER_NAME_ID]: number;
  [EMonsterBaseFields.IS_SHINY]: boolean;
}

export interface IMonsterBaseApiResponse {
  entries: IMonsterBase[];
}

export interface IMonsterMapVal {
  monsterName: string;
  monsterId: string;
  monsterBaseId: number;
  atkValues: number[];
  spaValues: number[];
  syncMoveId: number;
}

export enum EMonsterVariationFields {
  MONSTER_ID = "monsterId",
  FORM = "form",
  ACTOR_ID = "actorId",
  ATK_SCALE = "atkScale",
  DEF_SCALE = "defScale",
  SPA_SCALE = "spaScale",
  SPD_SCALE = "spdScale",
  SPE_SCALE = "speScale",
  MOVE1_ID = "move1Id",
  MOVE2_ID = "move2Id",
  MOVE3_ID = "move3Id",
  MOVE4_ID = "move4Id",
  TYPE = "type",
  WEAKNESS = "weakness",
  PASSIVE1_ID = "passive1Id",
  PASSIVE2_ID = "passive2Id",
  PASSIVE3_ID = "passive3Id",
  PASSIVE4_ID = "passive4Id",
  PASSIVE5_ID = "passive5Id",
  FORM_ID = "formId",
  SYNC_MOVE_ID = "syncMoveId",
  MOVE_DYNAMAX1_ID = "moveDynamax1Id",
  MOVE_DYNAMAX2_ID = "moveDynamax2Id",
  MOVE_DYNAMAX3_ID = "moveDynamax3Id",
  MOVE_DYNAMAX4_ID = "moveDynamax4Id",
  SCHEDULE_ID = "scheduleId",
  TERASTAL_MOVE_ID = "terastalMoveId"
}

export interface IMonsterVariation {
  [EMonsterVariationFields.MONSTER_ID]: string;
  [EMonsterVariationFields.FORM]: number;
  [EMonsterVariationFields.ACTOR_ID]: string;
  [EMonsterVariationFields.ATK_SCALE]: number;
  [EMonsterVariationFields.DEF_SCALE]: number;
  [EMonsterVariationFields.SPA_SCALE]: number;
  [EMonsterVariationFields.SPD_SCALE]: number;
  [EMonsterVariationFields.SPE_SCALE]: number;
  [EMonsterVariationFields.MOVE1_ID]: string;
  [EMonsterVariationFields.MOVE2_ID]: string;
  [EMonsterVariationFields.MOVE3_ID]: string;
  [EMonsterVariationFields.MOVE4_ID]: string;
  [EMonsterVariationFields.TYPE]: string;
  [EMonsterVariationFields.WEAKNESS]: string;
  [EMonsterVariationFields.PASSIVE1_ID]: number;
  [EMonsterVariationFields.PASSIVE2_ID]: number;
  [EMonsterVariationFields.PASSIVE3_ID]: number;
  [EMonsterVariationFields.PASSIVE4_ID]: number;
  [EMonsterVariationFields.PASSIVE5_ID]: number;
  [EMonsterVariationFields.FORM_ID]: number;
  [EMonsterVariationFields.SYNC_MOVE_ID]: number;
  [EMonsterVariationFields.MOVE_DYNAMAX1_ID]: number;
  [EMonsterVariationFields.MOVE_DYNAMAX2_ID]: number;
  [EMonsterVariationFields.MOVE_DYNAMAX3_ID]: number;
  [EMonsterVariationFields.MOVE_DYNAMAX4_ID]: number;
  [EMonsterVariationFields.SCHEDULE_ID]: string;
  [EMonsterVariationFields.TERASTAL_MOVE_ID]: number;
}

export interface IMonsterVariationApiResponse {
  entries: IMonsterVariation[];
}
