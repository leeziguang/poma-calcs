import { EXTRA_DESC_TAG_LABELS } from "src/components/move-power/constants";
import { trainerStore } from "src/store/trainer";
import { passiveStore } from "src/store/passive";
import { abilityStore } from "src/store/ability";
import { moveStore } from "src/store/move";
import {
  IPassiveSkillChild,
  IMoveAndPassiveSkillDigit,
  IDefaultPassiveOption
} from "src/types/passive";
import { EAbilityType, IAbilityCellDisplay } from "src/types/ability";

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

export const genAllPassiveOptions = (
  passiveSkillNamesEn: Record<string, string>,
  passiveSkillNamePartsEn: Record<string, string>
) => {
  const digitMap = passiveStore.moveAndPassiveSkillDigitMap;
  const descMap = passiveStore.passiveSkillDescriptionEn;
  const descPartsMap = passiveStore.passiveSkillDescriptionPartsEn;

  return Object.entries(passiveSkillNamesEn)
    .filter(([, name]) => !!name)
    .map(([id, name]) => ({
      value: id,
      label: resolvePassiveName(
        id,
        name,
        passiveSkillNamePartsEn,
        digitMap[id],
        descMap,
        descPartsMap
      )
    }));
};

const ABILITY_TYPE_LABELS: Record<number, string> = {
  [EAbilityType.HP]: "HP",
  [EAbilityType.ATK]: "ATK",
  [EAbilityType.SPA]: "SPA",
  [EAbilityType.DEF]: "DEF",
  [EAbilityType.SPDEF]: "SPDEF",
  [EAbilityType.SPE]: "SPE",
  [EAbilityType.PINCH_HEAL]: "PINCH_HEAL",
  [EAbilityType.MOVE_HEAL]: "MOVE_HEAL",
  [EAbilityType.MOVE_POWER]: "MOVE_POWER",
  [EAbilityType.MOVE_ACC]: "MOVE_ACC",
  [EAbilityType.ACAD_TM]: "ACAD_TM"
};

export const genAbilityCellDisplayList = (
  trainerId: string
): IAbilityCellDisplay[] => {
  const cells = abilityStore.abilityPanels.filter(
    p => String(p.trainerId) === trainerId
  );
  const abilityMap = abilityStore.abilityMap;
  const digitMap = passiveStore.moveAndPassiveSkillDigitMap;
  const descMap = passiveStore.passiveSkillDescriptionEn;
  const descPartsMap = passiveStore.passiveSkillDescriptionPartsEn;
  const namesEn = passiveStore.passiveSkillNamesEn;
  const nameParts = passiveStore.passiveSkillNamePartsEn;

  const moveItems: IAbilityCellDisplay[] = [];
  const passiveItems: IAbilityCellDisplay[] = [];
  const valueItems: IAbilityCellDisplay[] = [];

  for (const cell of cells) {
    const ability = abilityMap[cell.abilityId];
    if (!ability) continue;

    const typeLabel = ABILITY_TYPE_LABELS[ability.type] ?? String(ability.type);
    const item: IAbilityCellDisplay = { cellId: cell.cellId, typeLabel };

    if (ability.moveId) {
      item.moveName = moveStore.moveNamesEn[String(ability.moveId)];
    }

    if (ability.passiveId) {
      const passiveIdStr = String(ability.passiveId);
      const template = namesEn[passiveIdStr];
      if (template) {
        item.passiveName = resolvePassiveName(
          passiveIdStr,
          template,
          nameParts,
          digitMap[passiveIdStr],
          descMap,
          descPartsMap
        );
      }
    }

    if (ability.value > 0) {
      item.value = ability.value;
    }

    if (item.moveName !== undefined) moveItems.push(item);
    else if (item.passiveName !== undefined) passiveItems.push(item);
    else valueItems.push(item);
  }

  return [...moveItems, ...passiveItems, ...valueItems];
};

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
