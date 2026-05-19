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
