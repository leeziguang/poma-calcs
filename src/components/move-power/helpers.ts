import {
  EMovePowerFormFields,
  ICalcMovePowerArgs,
  ICalcSyncPowerArgs,
  IMovePowerFormValues
} from "src/types/data-col-list/move-power";
import {
  AOE_PENALTY_MAP,
  PASSIVES_WITH_SELECTABLE_CHILDREN,
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
  IMoveAndPassiveSkillDigit
} from "src/types/passive";
import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect";

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
const PASSIVE_DESC_TAG_RE = /\[Name:PassiveSkillDescriptionPartsIdTag Idx="(p\d+)" \]/g;

const extractDescriptionTags = (template: string | undefined): string[] => {
  if (!template) return [];
  const tags: string[] = [];
  const re = new RegExp(PASSIVE_DESC_TAG_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    tags.push(match[1]);
  }
  return tags;
};

const extractDigitValue = (digit: IMoveAndPassiveSkillDigit): string => {
  const count = Number(digit.param1);
  for (let j = 0; j < count; j++) {
    const typeIdx = 3 + j * 2;
    const typeKey = `param${typeIdx}` as keyof IMoveAndPassiveSkillDigit;
    if (digit[typeKey] === "1") {
      const valKey = `param${typeIdx + 1}` as keyof IMoveAndPassiveSkillDigit;
      return digit[valKey];
    }
  }
  return "";
};

const resolvePassiveName = (
  template: string,
  nameParts: Record<string, string>,
  digit: IMoveAndPassiveSkillDigit | undefined
) =>
  template
    .replace(PASSIVE_NAME_PARTS_RE, (_, idx) => nameParts[idx] ?? idx)
    .replace(PASSIVE_NAME_DIGIT_RE, () =>
      digit ? extractDigitValue(digit) : ""
    );

export const genPassiveOptions = (
  trainerId: string,
  passiveSkillNamesEn: Record<string, string>,
  passiveSkillNamePartsEn: Record<string, string>,
  passiveSkillChildren: IPassiveSkillChild[]
) => {
  const trainerInfo = trainerStore.trainerInfoMap[trainerId];
  if (!trainerInfo) return [];

  const digitMap = passiveStore.moveAndPassiveSkillDigitMap;
  const descMap = passiveStore.passiveSkillDescriptionEn;

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

  return passiveIds.reduce<DefaultOptionType[]>((acc, id) => {
    const name = passiveSkillNamesEn[String(id)];
    if (!name) return acc;

    const childrenSelectable = PASSIVES_WITH_SELECTABLE_CHILDREN.has(
      String(id)
    );
    const children = (childMap[id] ?? [])
      .map(childId => {
        const childName = passiveSkillNamesEn[childId];
        if (!childName) return null;
        return {
          value: childId,
          title: resolvePassiveName(
            childName,
            passiveSkillNamePartsEn,
            digitMap[childId]
          ),
          descTags: extractDescriptionTags(descMap[childId]),
          disabled: !childrenSelectable,
          selectable: childrenSelectable,
          checkable: childrenSelectable
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    acc.push({
      value: String(id),
      title: resolvePassiveName(
        name,
        passiveSkillNamePartsEn,
        digitMap[String(id)]
      ),
      descTags: extractDescriptionTags(descMap[String(id)]),
      children
    });
    return acc;
  }, []);
};
