import { EStatBoost, EStatDrops } from "src/types/base-stats";
import { ENEMY_DEF, STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/lib/helpers";

interface ICalcBaseStatArg {
  stat: number;
  grid: number;
  statBoost: EStatBoost;
  defDrops: EStatDrops;
}

export const calcBaseStat = ({
  stat,
  grid,
  statBoost,
  defDrops
}: ICalcBaseStatArg) => {
  if (!isValidNumber(stat) || !isValidNumber(grid)) return -11037;

  const realStat = Math.floor((stat + grid) * STAT_BOOSTS_MAP[statBoost]);

  return Number(
    (
      (realStat * 0.5) /
      Math.floor(ENEMY_DEF * STAT_BOOSTS_MAP[defDrops])
    ).toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })
  );
};
