import { EStatBoost, EStatDrops } from "src/types/data-col-list/base-stats";
import { STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/lib/helpers";
import { configStore } from "src/store/config";
import { MOVE_LEVEL_STAT_BOOST_MAP } from "../action-topbar/constants";
import { EMonsterFields, EMonsterVariationFields } from "src/types/monster";
import { monsterStore } from "src/store/monster";
import { EMoveCategory } from "src/types/move";

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

interface ICalcBaseStatArg {
  stat: number;
  grid: number;
  statBoost: EStatBoost;
  defDrops: EStatDrops;
  moveLvl: string;
  category: EMoveCategory;
}

export const calcBaseStat = ({
  stat,
  grid,
  statBoost,
  defDrops,
  moveLvl,
  category
}: ICalcBaseStatArg) => {
  if (!isValidNumber(stat) || !isValidNumber(grid)) return -11037;
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

  //
  // TODO: figure out how to get which ex role the pair has then map to stat
  const exrStat = 0;
  const supAwMult = MOVE_LEVEL_STAT_BOOST_MAP[moveLvl];

  const realStat = Math.floor(
    (stat * supAwMult + exrStat + grid) * megaMult * STAT_BOOSTS_MAP[statBoost]
  );

  return (
    (realStat * 0.5) /
    Math.floor(configStore.enemyDef * STAT_BOOSTS_MAP[defDrops])
  );
};
