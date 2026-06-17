import { EStatBoost, EStatDrops } from "src/types/data-col-list/base-stats";
import { EX_ROLE_STAT_MAP, STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/lib/helpers";
import { configStore } from "src/store/config";
import { MOVE_LEVEL_STAT_BOOST_MAP } from "../global-toolbar/constants";
import { EMonsterFields, EMonsterVariationFields } from "src/types/monster";
import { monsterStore } from "src/store/monster";
import { trainerStore } from "src/store/trainer";
import { EMoveCategory } from "src/types/move";
import { EX_STAT_BONUS } from "src/container/constants";
import { abilityStore } from "src/store/ability";
import { EAbilityType } from "src/types/ability";
import { passiveStore } from "src/store/passive";

export const RAW_STAT_MAP = (
  statType: EMonsterFields.ATK_VALUES | EMonsterFields.SPA_VALUES
) => {
  const monster = monsterStore.selectedMonster;
  const statIncrease =
    (monster?.[statType]?.[1] - monster?.[statType]?.[0]) / (200 - 140);
  const res = {} as Record<number, number>;

  for (let i = 0; i < 61; i++) {
    res[i + 140] = Math.floor(monster?.[statType]?.[0] + i * statIncrease);
  }

  return res;
};

export const calcHexGridStatBonus = (
  trainerId: string,
  selectedGridCellIds: number[],
  category: EMoveCategory
): number => {
  const targetType =
    category === EMoveCategory.SPECIAL ? EAbilityType.SPA : EAbilityType.ATK;
  const selectedSet = new Set(selectedGridCellIds);
  return abilityStore.abilityPanels
    .filter(p => String(p.trainerId) === String(trainerId))
    .filter(p => selectedSet.has(p.cellId))
    .reduce((sum, p) => {
      const ability = abilityStore.abilityMap[p.abilityId];
      return ability?.type === targetType ? sum + (ability.value ?? 0) : sum;
    }, 0);
};

interface ICalcBaseStatArg {
  stat: number;
  trainerId: string;
  pairFieldName: number;
  statBoost: EStatBoost;
  defDrops: EStatDrops;
  moveLvl: string;
  category: EMoveCategory;
}

export const calcBaseStat = ({
  stat,
  trainerId,
  pairFieldName,
  statBoost,
  defDrops,
  moveLvl,
  category
}: ICalcBaseStatArg) => {
  const selectedGridCellIds =
    passiveStore.selectedGridCellIds.get(pairFieldName) ?? [];
  const grid = calcHexGridStatBonus(trainerId, selectedGridCellIds, category);
  if (!isValidNumber(stat)) return -11037;
  let megaMult = 1;
  const monsterId = monsterStore.selectedMonster?.monsterId;
  const monsterVariant = monsterStore.monsterVariations.find(
    v => v[EMonsterVariationFields.MONSTER_ID] === monsterId
  );

  if (monsterVariant) {
    // Mega SCALE is in range [100 - x00]
    const scaleField =
      category === EMoveCategory.PHYSICAL
        ? EMonsterVariationFields.ATK_SCALE
        : EMonsterVariationFields.SPA_SCALE;
    megaMult = monsterVariant[scaleField] / 100;
  }

  const exRoleStats =
    EX_ROLE_STAT_MAP[trainerStore.selectedTrainer?.exRole?.role ?? -1];
  const exrStat =
    category === EMoveCategory.PHYSICAL
      ? exRoleStats?.atk ?? 0
      : exRoleStats?.spa ?? 0;

  const supAwMult = MOVE_LEVEL_STAT_BOOST_MAP[moveLvl];

  const realStat = Math.floor(
    (stat * supAwMult + exrStat + EX_STAT_BONUS + grid) *
      megaMult *
      STAT_BOOSTS_MAP[statBoost]
  );

  return (
    (realStat * 0.5) /
    Math.floor(configStore.enemyDef * STAT_BOOSTS_MAP[defDrops])
  );
};
