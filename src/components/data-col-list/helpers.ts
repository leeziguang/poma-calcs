import { INVALID_MOVE } from "src/container/constants";
import { monsterStore } from "src/store/monster";
import { moveStore } from "src/store/move";
import { trainerStore } from "src/store/trainer";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import {
  EMoveCategory,
  EMoveFields,
  EMoveGroup,
  EMoveTarget,
  IMove,
  IMoveOption
} from "src/types/move";
import { ETrainerFields } from "src/types/trainer";

export const genMoveOptions = (trainerId: string): IMoveOption[] => {
  const trainer = trainerStore?.trainerInfoMap?.[trainerId];
  const monster = monsterStore?.monsterMapById?.[trainer?.monsterId];

  const res = [] as IMoveOption[];

  //
  // what abt max move + tera?
  for (let i = 1; i <= 5; i++) {
    let moveId;

    if (i >= 1 && i <= 4) {
      moveId =
        trainer?.[
          `move${i}Id` as
            | ETrainerFields.MOVE1_ID
            | ETrainerFields.MOVE2_ID
            | ETrainerFields.MOVE3_ID
            | ETrainerFields.MOVE4_ID
        ];
    } else {
      //
      // TODO: add logic for tera + max
      moveId = monster?.syncMoveId;
    }

    if (moveId === INVALID_MOVE) {
      continue;
    }

    const move = moveStore.moveMap[String(moveId)];
    res.push({
      label: moveStore.moveNamesEn[String(moveId)] ?? "Name not found",
      value: moveId,
      power: move?.power ?? -11037,
      target: (move?.target as EMoveTarget) ?? "OpponentSingle",
      group: (move?.group as EMoveGroup) ?? "Regular",
      category: (move?.category as EMoveCategory) ?? "Physical",
      uses: move?.uses ?? 0
    });
  }

  return res;
};

export const genAutoFillMovePower = (move: IMove) => {
  return {
    [EMovePowerFormFields.BASE_MOVE]: move.power,
    [EMovePowerFormFields.GRID]: 0,
    [EMovePowerFormFields.SM_PMUN]: 0,
    [EMovePowerFormFields.SYUN]: 0,
    [EMovePowerFormFields.MULTIS]: 0,
    [EMovePowerFormFields.INNATE_MULTIS]: 0,
    [EMovePowerFormFields.OPTIONS]: [
      move[EMoveFields.GROUP] === EMoveGroup.SYNC &&
        EMovePowerFormFields.IS_SYNC,
      move[EMoveFields.TARGET] === EMoveTarget.ALL &&
        EMovePowerFormFields.IS_AOE
    ].filter(Boolean)
  };
};
