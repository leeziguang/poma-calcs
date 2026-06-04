import {
  EMovePowerFormFields,
  ICalcMovePowerArgs,
  ICalcSyncPowerArgs,
  IMovePowerFormValues
} from "src/types/data-col-list/move-power";
import {
  AOE_PENALTY_MAP,
  EXTRA_DESC_TAG_LABELS,
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
import { passiveStore } from "src/store/passive";
import {
  IPassiveSkillChild,
  IMoveAndPassiveSkillDigit,
  IDefaultPassiveOption,
  IPassiveMultiParam
} from "src/types/passive";

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

const PASSIVE_NAME_PARTS_RE = /\[Name:PassiveSkillNameParts Idx="(\d+)" \]/g;
const PASSIVE_NAME_DIGIT_RE = /\[Name:PassiveSkillNameDigit \]/g;
const PASSIVE_DESC_PART_TAG_RE = /\[Name:PassiveSkillDescriptionPartsIdTag Idx="(p\d+)" \]/g;
const PART_DIGIT_IDX_RE = /\[Digit:\d+digits? (?:Idx="(\d+)" )?\]/;

const resolveNameDigitIdx = (
  passiveId: string,
  descriptionMap: Record<string, string>,
  descriptionPartsMap: Record<string, string>
): number => {
  const desc = descriptionMap[passiveId];
  if (!desc) return 0;

  const re = new RegExp(PASSIVE_DESC_PART_TAG_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(desc)) !== null) {
    const part = descriptionPartsMap[match[1]];
    if (!part) continue;

    const digitMatch = part.match(PART_DIGIT_IDX_RE);
    if (digitMatch) return digitMatch[1] ? Number(digitMatch[1]) : 0;
  }
  return 0;
};

/**
 * @description Extracts the value of the digit at pair `idx` (0-indexed).
 * Pair N is stored at (param{1+N*2}, param{2+N*2}) where the odd-position
 * param is the type and the even-position param is the value.
 * @param digit
 * @param idx pair index (default 0)
 * @returns string value of digit
 */
const extractDigitValue = (
  digit: IMoveAndPassiveSkillDigit,
  idx = 0
): string => {
  const key = `param${2 + idx * 2}` as keyof IMoveAndPassiveSkillDigit;
  return digit[key] ?? "";
};

const resolvePassiveName = (
  passiveId: string,
  template: string,
  nameParts: Record<string, string>,
  digit: IMoveAndPassiveSkillDigit | undefined,
  descriptionMap: Record<string, string>,
  descriptionPartsMap: Record<string, string>
) =>
  template
    .replace(PASSIVE_NAME_PARTS_RE, (_, idx) => nameParts[idx] ?? idx)
    .replace(PASSIVE_NAME_DIGIT_RE, () => {
      if (!digit) return "";
      const digitIdx = resolveNameDigitIdx(
        passiveId,
        descriptionMap,
        descriptionPartsMap
      );
      return extractDigitValue(digit, digitIdx);
    });

export const passiveHasRegionTag = (
  passiveId: number,
  descriptionMap: Record<string, string>,
  childMap: Record<number, string[]>,
  regionTags: Set<string>
): boolean => {
  if (
    regionTags.has(`p${passiveId}`) ||
    childMap[passiveId]?.some(cid => regionTags.has(cid))
  )
    return true;

  const desc = descriptionMap[String(passiveId)];
  if (!desc) return false;

  const re = new RegExp(PASSIVE_DESC_PART_TAG_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(desc)) !== null) {
    if (regionTags.has(m[1])) return true;
  }
  return false;
};

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

  return parseFloat(total.toFixed(2));
};

export const genPassiveList = (
  trainerId: string,
  passiveSkillNamesEn: Record<string, string>,
  passiveSkillNamePartsEn: Record<string, string>,
  passiveSkillChildren: IPassiveSkillChild[]
) => {
  const trainerInfo = trainerStore.trainerInfoMap[trainerId];
  if (!trainerInfo) return [];

  const digitMap = passiveStore.moveAndPassiveSkillDigitMap;
  const descMap = passiveStore.passiveSkillDescriptionEn;
  const descPartsMap = passiveStore.passiveSkillDescriptionPartsEn;

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

  return passiveIds.reduce<IDefaultPassiveOption[]>((acc, id) => {
    const name = passiveSkillNamesEn[String(id)];
    if (!name) return acc;

    const children = (childMap[id] ?? [])
      .map(childId => {
        const childName = passiveSkillNamesEn[childId];
        if (!childName) return null;
        return {
          title: resolvePassiveName(
            childId,
            childName,
            passiveSkillNamePartsEn,
            digitMap[childId],
            descMap,
            descPartsMap
          )
        };
      })
      .filter((c): c is { title: string } => c !== null);

    const parentDesc = descMap[String(id)] ?? "";
    const tagRe = new RegExp(PASSIVE_DESC_PART_TAG_RE.source, "g");
    let tagMatch: RegExpExecArray | null;
    while ((tagMatch = tagRe.exec(parentDesc)) !== null) {
      const label = EXTRA_DESC_TAG_LABELS[tagMatch[1]];
      if (label) children.push({ title: label });
    }

    acc.push({
      value: String(id),
      title: resolvePassiveName(
        String(id),
        name,
        passiveSkillNamePartsEn,
        digitMap[String(id)],
        descMap,
        descPartsMap
      ),
      children
    });
    return acc;
  }, []);
};
