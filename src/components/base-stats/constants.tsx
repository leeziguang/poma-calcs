import { EStatBoost, EStatDrops } from "../../types/data-col-list/base-stats";
import { ETrainerRole } from "src/types/trainer";

export const STAT_BOOST_LABEL = {
  [EStatBoost.ZERO]: "0",
  [EStatBoost.PLUS_1]: "+1",
  [EStatBoost.PLUS_2]: "+2",
  [EStatBoost.PLUS_3]: "+3",
  [EStatBoost.PLUS_4]: "+4",
  [EStatBoost.PLUS_5]: "+5",
  [EStatBoost.PLUS_6]: "+6"
};

export const STAT_DROP_LABEL = {
  [EStatDrops.ZERO]: "0",
  [EStatDrops.MINUS_1]: "-1",
  [EStatDrops.MINUS_2]: "-2",
  [EStatDrops.MINUS_3]: "-3",
  [EStatDrops.MINUS_4]: "-4",
  [EStatDrops.MINUS_5]: "-5",
  [EStatDrops.MINUS_6]: "-6"
};

export const STAT_BOOSTS_MAP = {
  [EStatBoost.ZERO]: 1,
  [EStatBoost.PLUS_1]: 1.25,
  [EStatBoost.PLUS_2]: 1.4,
  [EStatBoost.PLUS_3]: 1.5,
  [EStatBoost.PLUS_4]: 1.6,
  [EStatBoost.PLUS_5]: 1.7,
  [EStatBoost.PLUS_6]: 1.8,
  [EStatDrops.MINUS_1]: 0.8,
  [EStatDrops.MINUS_2]: 0.71,
  [EStatDrops.MINUS_3]: 0.66,
  [EStatDrops.MINUS_4]: 0.62,
  [EStatDrops.MINUS_5]: 0.58,
  [EStatDrops.MINUS_6]: 0.55
};

export const statBoostOptions = (Object.keys(EStatBoost) as EStatBoost[]).map(
  boost => ({
    label: STAT_BOOST_LABEL[boost],
    value: boost
  })
);

export const statDropOptions = (Object.keys(EStatDrops) as EStatDrops[]).map(
  boost => ({
    label: STAT_DROP_LABEL[boost],
    value: boost
  })
);

export const EX_ROLE_STAT_MAP: Record<number, { atk: number; spa: number }> = {
  [ETrainerRole.STRIKE]: { atk: 40, spa: 40 },
  [ETrainerRole.TECH]: { atk: 20, spa: 20 },
  [ETrainerRole.SPRINT]: { atk: 20, spa: 20 }
};
