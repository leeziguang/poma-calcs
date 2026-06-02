import uniqBy from "lodash/uniqBy";
import {
  IGNORE_AOE_PENALTY_MOVE_DESC_ID,
  INVALID_MOVE
} from "src/container/constants";
import { monsterStore } from "src/store/monster";
import { moveStore } from "src/store/move";
import { trainerStore } from "src/store/trainer";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import { trainerHasRole } from "src/lib/helpers";
import { EMonsterVariationFields } from "src/types/monster";
import {
  EMoveCategory,
  EMoveFields,
  EMoveGroup,
  EMoveTarget,
  IMove,
  IMoveOption
} from "src/types/move";
import { ETrainerFields, ETrainerRole } from "src/types/trainer";

const pushMoveOption = (moveId: number | string, res: IMoveOption[]) => {
  const move = moveStore.moveMap[String(moveId)];
  if (move?.[EMoveFields.CATEGORY] === EMoveCategory.STATUS) return;

  res.push({
    label: moveStore.moveNamesEn[String(moveId)] ?? "Name not found",
    value: moveId,
    power: move?.power ?? -11037,
    target: (move?.target as EMoveTarget) ?? "OpponentSingle",
    group: (move?.group as EMoveGroup) ?? "Regular",
    category: (move?.category as EMoveCategory) ?? "Physical",
    uses: move?.uses ?? 0
  });
};

export const genMoveOptions = (trainerId: string): IMoveOption[] => {
  const trainer = trainerStore?.trainerInfoMap?.[trainerId];
  const monster = monsterStore?.monsterMapById?.[trainer?.monsterId];
  const variation = monsterStore.selectedMonsterVariation;

  const res = [] as IMoveOption[];

  for (let i = 1; i <= 4; i++) {
    const moveId =
      trainer?.[
        `move${i}Id` as
          | ETrainerFields.MOVE1_ID
          | ETrainerFields.MOVE2_ID
          | ETrainerFields.MOVE3_ID
          | ETrainerFields.MOVE4_ID
      ];
    if (moveId === INVALID_MOVE) continue;
    pushMoveOption(moveId, res);
  }

  if (
    monster?.syncMoveId !== undefined &&
    monster.syncMoveId !== INVALID_MOVE
  ) {
    pushMoveOption(monster.syncMoveId, res);
  }

  if (variation) {
    for (let i = 1; i <= 4; i++) {
      const moveId =
        variation[
          `moveDynamax${i}Id` as
            | EMonsterVariationFields.MOVE_DYNAMAX1_ID
            | EMonsterVariationFields.MOVE_DYNAMAX2_ID
            | EMonsterVariationFields.MOVE_DYNAMAX3_ID
            | EMonsterVariationFields.MOVE_DYNAMAX4_ID
        ];
      if (moveId === INVALID_MOVE) continue;
      pushMoveOption(moveId, res);
    }

    const teraId = variation[EMonsterVariationFields.TERASTAL_MOVE_ID];
    if (teraId !== 0) {
      pushMoveOption(teraId, res);
    }
  }

  return uniqBy(res, "label");
};

export const genAutoFillMovePower = (move: IMove) => {
  const descParts =
    moveStore.moveDescriptionMap[String(move[EMoveFields.MOVE_ID])];
  const ignoresAoePenalty =
    descParts !== undefined && IGNORE_AOE_PENALTY_MOVE_DESC_ID in descParts;
  const isSync = move[EMoveFields.GROUP] === EMoveGroup.SYNC;
  const isTech = trainerHasRole(ETrainerRole.TECH);
  const isStrike = trainerHasRole(ETrainerRole.STRIKE);
  const teraId =
    monsterStore.selectedMonsterVariation?.[
      EMonsterVariationFields.TERASTAL_MOVE_ID
    ];
  const isTera =
    teraId !== undefined &&
    teraId !== 0 &&
    String(move[EMoveFields.MOVE_ID]) === String(teraId);

  return {
    [EMovePowerFormFields.BASE_MOVE]: move.power,
    [EMovePowerFormFields.GRID]: 0,
    [EMovePowerFormFields.SM_PMUN]: 0,
    [EMovePowerFormFields.SYUN]: 0,
    [EMovePowerFormFields.MULTIS]: 0,
    [EMovePowerFormFields.INNATE_MULTIS]: 0,
    [EMovePowerFormFields.OPTIONS]: [
      isTera && EMovePowerFormFields.IS_TERA,
      isSync && EMovePowerFormFields.IS_SYNC,
      isSync && isTech && EMovePowerFormFields.IS_TECH,
      (move[EMoveFields.TARGET] === EMoveTarget.ALL || isStrike) &&
        EMovePowerFormFields.IS_AOE,
      ignoresAoePenalty && EMovePowerFormFields.IGNORE_AOE_PENALTY
    ].filter(Boolean)
  };
};
