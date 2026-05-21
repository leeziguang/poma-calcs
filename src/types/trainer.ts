import { DefaultOptionType } from "antd/lib/select";

export enum ETrainerFields {
  TRAINER_ID = "trainerId",
  TRAINER_KIND = "trainerKind",
  SCOUT_METHOD = "scoutMethod",
  EXCLUSIVITY = "exclusivity",
  TRAINER_BASE_ID = "trainerBaseId",
  TYPE = "type",
  RARITY = "rarity",
  ROLE = "role",
  MONSTER_ID = "monsterId",
  MOVE1_ID = "move1Id",
  MOVE2_ID = "move2Id",
  MOVE3_ID = "move3Id",
  MOVE4_ID = "move4Id",
  WEAKNESS = "weakness",
  STORY_QUEST = "storyQuest",
  U16 = "u16",
  PASSIVE1_ID = "passive1Id",
  PASSIVE2_ID = "passive2Id",
  PASSIVE3_ID = "passive3Id",
  PASSIVE4_ID = "passive4Id",
  PASSIVE5_ID = "passive5Id",
  TEAM_SKILL1_ID = "teamSkill1Id",
  TEAM_SKILL2_ID = "teamSkill2Id",
  TEAM_SKILL3_ID = "teamSkill3Id",
  TEAM_SKILL4_ID = "teamSkill4Id",
  TEAM_SKILL5_ID = "teamSkill5Id",
  U27 = "u27",
  U28 = "u28",
  NUMBER = "number",
  SCHEDULE_ID = "scheduleId",
  EX_SCHEDULE_ID = "exScheduleId",
  U32 = "u32"
}

export interface ITrainer {
  [ETrainerFields.TRAINER_ID]: string;
  [ETrainerFields.TRAINER_KIND]: number;
  [ETrainerFields.SCOUT_METHOD]: number;
  [ETrainerFields.EXCLUSIVITY]: string;
  [ETrainerFields.TRAINER_BASE_ID]: number;
  [ETrainerFields.TYPE]: number;
  [ETrainerFields.RARITY]: number;
  [ETrainerFields.ROLE]: number;
  [ETrainerFields.MONSTER_ID]: string;
  [ETrainerFields.MOVE1_ID]: number;
  [ETrainerFields.MOVE2_ID]: number;
  [ETrainerFields.MOVE3_ID]: number;
  [ETrainerFields.MOVE4_ID]: number;
  [ETrainerFields.WEAKNESS]: number;
  [ETrainerFields.STORY_QUEST]: string;
  [ETrainerFields.U16]: number;
  [ETrainerFields.PASSIVE1_ID]: number;
  [ETrainerFields.PASSIVE2_ID]: number;
  [ETrainerFields.PASSIVE3_ID]: number;
  [ETrainerFields.PASSIVE4_ID]: number;
  [ETrainerFields.PASSIVE5_ID]: number;
  [ETrainerFields.TEAM_SKILL1_ID]: number;
  [ETrainerFields.TEAM_SKILL2_ID]: number;
  [ETrainerFields.TEAM_SKILL3_ID]: number;
  [ETrainerFields.TEAM_SKILL4_ID]: number;
  [ETrainerFields.TEAM_SKILL5_ID]: number;
  [ETrainerFields.U27]: number;
  [ETrainerFields.U28]: number;
  [ETrainerFields.NUMBER]: number;
  [ETrainerFields.SCHEDULE_ID]: string;
  [ETrainerFields.EX_SCHEDULE_ID]: string;
  [ETrainerFields.U32]: number;
}

export interface ITrainerApiResponse {
  entries: ITrainer[];
}

export enum ETrainerBaseFields {
  ID = "id",
  ACTOR_ID = "actorId",
  TRAINER_NAME_ID = "trainerNameId",
  U4 = "u4",
  U5 = "u5",
  U6 = "u6",
  U7 = "u7",
  GENDER = "gender",
  POKEBALL_ID = "pokeballId",
  IS_GENERIC = "isGeneric",
  BATTLE_BGM_ID = "battleBgmId",
  RESULT_BGM_ID = "resultBgmId",
  ALT_TRAINER_NAME_ID = "altTrainerNameId"
}

export interface ITrainerBase {
  [ETrainerBaseFields.ID]: string;
  [ETrainerBaseFields.ACTOR_ID]: string;
  [ETrainerBaseFields.TRAINER_NAME_ID]: string;
  [ETrainerBaseFields.U4]: number;
  [ETrainerBaseFields.U5]: string;
  [ETrainerBaseFields.U6]: number;
  [ETrainerBaseFields.U7]: number;
  [ETrainerBaseFields.GENDER]: number;
  [ETrainerBaseFields.POKEBALL_ID]: string;
  [ETrainerBaseFields.IS_GENERIC]: number;
  [ETrainerBaseFields.BATTLE_BGM_ID]: string;
  [ETrainerBaseFields.RESULT_BGM_ID]: string;
  [ETrainerBaseFields.ALT_TRAINER_NAME_ID]: string;
}

export interface ITrainerBasePicked {
  trainerBaseId: string;
  trainerNameId: string;
}

export interface ITrainerBaseApiResponse {
  entries: ITrainerBase[];
}

export enum ETrainerKind {
  MC = 1,
  GACHA = 2
}

export enum ETrainerRole {
  STRIKE = 1,
  SUPPORT = 2,
  TECH = 2,
  FIELD = 2,
  SPRINT = 2,
  ARC = 2
}

export interface ITrainerOption extends DefaultOptionType {
  monsterId: string;
  monsterBaseId: number;
}

export interface ITrainerInfoListVal {
  trainerName: string;
  trainerId: string;
  move1Id: number;
  move2Id: number;
  move3Id: number;
  move4Id: number;
  monsterId: string;
}
