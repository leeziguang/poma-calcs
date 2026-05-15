import {
  EMovePowerFormFields,
  ICalcMovePowerArgs,
  ICalcSyncPowerArgs,
  IMovePowerFormValues
} from "src/types/move-power";
import { AOE_PENALTY_MAP, SM_PMUN_MULTI, SYUN_MULTI } from "./constants";
import {
  MOVE_LEVEL_MOVE_BOOST_MAP,
  MOVE_LEVEL_SYNC_BOOST_MAP
} from "../action-topbar/constants";

export const formToCalcArgAdaptor = (
  formVal: Partial<IMovePowerFormValues>
): ICalcMovePowerArgs | ICalcSyncPowerArgs => ({
  base: formVal?.[EMovePowerFormFields.BASE_MOVE] as number,
  moveLvl: formVal?.[EMovePowerFormFields.MOVE_LVL] as string,
  grid: formVal?.[EMovePowerFormFields.GRID],
  options: formVal?.[EMovePowerFormFields.OPTIONS],
  smpmun: formVal?.[EMovePowerFormFields.SM_PMUN],
  syun: formVal?.[EMovePowerFormFields.SYUN],
  multis: formVal?.[EMovePowerFormFields.MULTIS],
  innate: formVal?.[EMovePowerFormFields.INNATE_MULTIS]
});

export const calcMovePower = ({
  base,
  moveLvl,
  grid,
  options,
  smpmun,
  multis,
  innate
}: ICalcMovePowerArgs) => {
  //
  // each multiplication for move power is rounded to 0 d.p.
  const realMovePower = Math.floor(
    Math.floor(
      Math.floor(
        base * (options?.includes(EMovePowerFormFields.IS_TERA) ? 1.5 : 1)
      ) * MOVE_LEVEL_MOVE_BOOST_MAP[moveLvl]
    ) + (grid as number)
  );

  const moveMulti = 1 + (multis as number) + (smpmun as number) * SM_PMUN_MULTI;
  const innateMulti = 1 + (innate as number);

  const aoeMulti = options?.includes(EMovePowerFormFields.IS_AOE)
    ? options?.includes(EMovePowerFormFields.IGNORE_AOE_PENALTY)
      ? 3
      : AOE_PENALTY_MAP[3]
    : 1;

  return realMovePower * moveMulti * innateMulti * aoeMulti;
};

export const calcSyncPower = ({
  base,
  moveLvl,
  grid,
  options,
  syun,
  multis,
  innate
}: ICalcSyncPowerArgs) => {
  //
  // each multiplication for move power is rounded to 0 d.p.
  const realMovePower = Math.floor(
    Math.floor(
      Math.floor(
        base * (options?.includes(EMovePowerFormFields.IS_TECH) ? 1.5 : 1)
      ) * MOVE_LEVEL_SYNC_BOOST_MAP[moveLvl]
    ) + (grid as number)
  );

  const moveMulti = 1 + (multis as number) + (syun as number) * SYUN_MULTI;
  const innateMulti = 1 + (innate as number);

  return Math.floor(
    realMovePower *
      moveMulti *
      innateMulti *
      (options?.includes(EMovePowerFormFields.IS_AOE) ? 3 : 1)
  );
};
