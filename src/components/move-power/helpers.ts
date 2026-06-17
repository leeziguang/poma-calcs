import {
  EMovePowerFormFields,
  ICalcMovePowerArgs,
  ICalcSyncPowerArgs,
  IMovePowerFormValues
} from "src/types/data-col-list/move-power";
import {
  AOE_PENALTY_MAP,
  DUPLICATE_EXCEPTIONS,
  PASSIVE_MOVE_MULTI_MAP,
  PASSIVE_SYNC_MULTI_MAP,
  SM_PMUN_MULTI,
  SYUN_MULTI
} from "./constants";
import {
  MOVE_LEVEL_MOVE_BOOST_MAP,
  MOVE_LEVEL_SYNC_BOOST_MAP
} from "../global-toolbar/constants";
import { trainerStore } from "src/store/trainer";
import {
  EMovePassive,
  IPassiveSkillChild,
  IPassiveMultiParam
} from "src/types/passive";
import { abilityStore } from "src/store/ability";
import { EAbilityType } from "src/types/ability";
import { passiveStore } from "src/store/passive";

const calcHexGridMovePowerBonus = (
  trainerId: string,
  pairFieldName: number
): number => {
  const selectedGridCellIds =
    passiveStore.pairPassiveState.get(pairFieldName)?.selectedGridCellIds ?? [];
  const selectedSet = new Set(selectedGridCellIds);
  return abilityStore.abilityPanels
    .filter(p => String(p.trainerId) === String(trainerId))
    .filter(p => selectedSet.has(p.cellId))
    .reduce((sum, p) => {
      const ability = abilityStore.abilityMap[p.abilityId];
      return ability?.type === EAbilityType.MOVE_POWER
        ? sum + (ability.value ?? 0)
        : sum;
    }, 0);
};

export const formToCalcArgAdaptor = (
  formVal: Partial<IMovePowerFormValues>,
  trainerId: string,
  pairFieldName: number
): ICalcMovePowerArgs | ICalcSyncPowerArgs => ({
  base: formVal?.[EMovePowerFormFields.BASE_MOVE] as number,
  moveLvl: formVal?.[EMovePowerFormFields.MOVE_LVL] as string,
  trainerId,
  pairFieldName,
  options: formVal?.[EMovePowerFormFields.OPTIONS],
  smpmun: formVal?.[EMovePowerFormFields.SM_PMUN],
  syun: formVal?.[EMovePowerFormFields.SYUN],
  multis: formVal?.[EMovePowerFormFields.MULTIS],
  innate: formVal?.[EMovePowerFormFields.INNATE_MULTIS]
});

export const calcMovePower = ({
  base,
  moveLvl,
  trainerId,
  pairFieldName,
  options,
  smpmun,
  multis,
  innate
}: ICalcMovePowerArgs) => {
  const grid = calcHexGridMovePowerBonus(trainerId, pairFieldName);
  //
  // each multiplication for move power is rounded to 0 d.p.
  const realMovePower = Math.floor(
    Math.floor(
      Math.floor(
        base * (options?.includes(EMovePowerFormFields.IS_TERA) ? 1.5 : 1)
      ) * MOVE_LEVEL_MOVE_BOOST_MAP[moveLvl]
    ) + grid
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
  trainerId,
  pairFieldName,
  options,
  syun,
  multis,
  innate
}: ICalcSyncPowerArgs) => {
  const grid = calcHexGridMovePowerBonus(trainerId, pairFieldName);
  //
  // each multiplication for move power is rounded to 0 d.p.
  const realMovePower = Math.floor(
    Math.floor(
      Math.floor(
        base * (options?.includes(EMovePowerFormFields.IS_TECH) ? 1.5 : 1)
      ) * MOVE_LEVEL_SYNC_BOOST_MAP[moveLvl]
    ) + grid
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

const PASSIVE_DESC_PART_TAG_RE = /\[Name:PassiveSkillDescriptionPartsIdTag Idx="(p\d+)" \]/g;

export const calcDefaultMultis = (
  trainerId: string,
  descriptionMap: Record<string, string>,
  passiveSkillChildren: IPassiveSkillChild[],
  isSync: boolean,
  params: IPassiveMultiParam = {}
): number => {
  const trainerInfo = trainerStore.trainerInfoMap[trainerId];
  if (!trainerInfo) return 0;

  const passiveIds = [
    trainerInfo.passive1Id,
    trainerInfo.passive2Id,
    trainerInfo.passive3Id,
    trainerInfo.passive4Id,
    trainerInfo.passive5Id
  ].filter((id): id is number => id !== 0);

  const childMap = passiveSkillChildren.reduce<Record<number, string[]>>(
    (acc, c) => {
      acc[c.passiveSkillId] = c.passiveSkillChildIds;
      return acc;
    },
    {}
  );

  const multiMap = isSync
    ? PASSIVE_SYNC_MULTI_MAP(params)
    : PASSIVE_MOVE_MULTI_MAP(params);

  let total = 0;
  const seen = new Set<string>();

  const addTag = (tag: string) => {
    if (!seen.has(tag) && multiMap[tag] != null) {
      total += multiMap[tag];
      seen.add(tag);
    }
  };

  for (const id of passiveIds) {
    addTag(`p${id}`);

    for (const childId of childMap[id] ?? []) {
      addTag(childId);
    }

    const desc = descriptionMap[String(id)];
    if (!desc) continue;
    const re = new RegExp(PASSIVE_DESC_PART_TAG_RE.source, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(desc)) !== null) {
      addTag(m[1]);
    }
  }

  for (let idx = 0; idx < (params.extraPassives ?? []).length; idx++) {
    const tag = (params.extraPassives ?? [])[idx] as EMovePassive;
    if (!tag) continue;
    if (!DUPLICATE_EXCEPTIONS.has(tag) && seen.has(tag)) continue;

    const count = params.conditionalParams?.[`extra_${idx}`] ?? 1;
    const individualMap = isSync
      ? PASSIVE_SYNC_MULTI_MAP({ regionMembers: count })
      : PASSIVE_MOVE_MULTI_MAP({
          regionMembers: count,
          moveCategory: params.moveCategory
        });
    const multi = individualMap[tag];
    if (multi != null) total += multi;
  }

  return parseFloat(total.toFixed(2));
};
