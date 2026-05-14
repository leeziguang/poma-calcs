import { EStatBoost, EStatDrops } from "src/types/base-stats";
import { STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/lib/helpers";
import { configStore } from "src/store/config";
import { MOVE_LEVEL_STAT_BOOST_MAP } from "../action-topbar/constants";

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
