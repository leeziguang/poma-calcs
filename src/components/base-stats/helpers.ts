import { EStatBoost, EStatDrops } from "src/types/data-col-list/base-stats";
import { STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/lib/helpers";
import { configStore } from "src/store/config";
import { MOVE_LEVEL_STAT_BOOST_MAP } from "../action-topbar/constants";
import { EMonsterFields } from "src/types/monster";
import { monsterStore } from "src/store/monster";

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
}

export const calcBaseStat = ({
  stat,
  grid,
  statBoost,
  defDrops,
  moveLvl
}: ICalcBaseStatArg) => {
  if (!isValidNumber(stat) || !isValidNumber(grid)) return -11037;

  const realStat = Math.floor(
    (stat * MOVE_LEVEL_STAT_BOOST_MAP[moveLvl] + grid) *
      STAT_BOOSTS_MAP[statBoost]
  );

  return (
    (realStat * 0.5) /
    Math.floor(configStore.enemyDef * STAT_BOOSTS_MAP[defDrops])
  );
};
