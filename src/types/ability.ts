export enum EAbilityType {
  HP = 1,
  ATK = 2,
  DEF = 3,
  SPA = 4,
  SPDEF = 5,
  SPE = 6,
  YELLOW = 7,
  RED = 8,
  MOVE_POWER = 9,
  MOVE_ACC = 10,
  ACAD_TM = 11
}

export interface IAbility {
  abilityId: number;
  type: number;
  passiveId: number;
  moveId: number;
  value: number;
  u6: number;
}

export interface IAbilityApiResponse {
  entries: IAbility[];
}

export interface IAbilityPanel {
  cellId: number;
  version: number;
  trainerId: number;
  energyCost: number;
  orbCost: number;
  x: number;
  y: number;
  z: number;
  abilityId: number;
  conditionIds: string[];
  scheduleId: number;
}

export interface IAbilityPanelApiResponse {
  entries: IAbilityPanel[];
}

export interface IAbilityCellDisplay {
  cellId: number;
  typeLabel: string;
  moveName?: string;
  passiveName?: string;
  value?: number;
  x: number;
  y: number;
  z: number;
  energyCost: number;
  cellColor?: "red" | "yellow";
  description?: string;
  conditionIds: number[];
}
