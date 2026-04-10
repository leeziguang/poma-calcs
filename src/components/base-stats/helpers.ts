import { EStatBoost } from "src/types/base-stats";
import { ENEMY_DEF, STAT_BOOSTS_MAP } from "./constants";
import { isValidNumber } from "src/helpers";

export const calcBaseStat = (
  stat: number,
  grid: number,
  statBoost: EStatBoost,
  defDrops: EStatBoost
) => {
  if (!isValidNumber(stat) || !isValidNumber(grid)) return "-";

  const realStat = Math.floor((stat + grid) * STAT_BOOSTS_MAP[statBoost]);

  return (
    (realStat * 0.5) /
    Math.floor(ENEMY_DEF * (1 - (1 - STAT_BOOSTS_MAP[defDrops])))
  );
};
