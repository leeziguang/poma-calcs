import { EStatBoost } from "../../types/base-stats";

// arbitrary value
export const ENEMY_DEF = 50;

export const STAT_BOOST_LABEL = {
  [EStatBoost.ZERO]: "0",
  [EStatBoost.PLUS_1]: "+1",
  [EStatBoost.PLUS_2]: "+2",
  [EStatBoost.PLUS_3]: "+3",
  [EStatBoost.PLUS_4]: "+4",
  [EStatBoost.PLUS_5]: "+5",
  [EStatBoost.PLUS_6]: "+6",
  [EStatBoost.MINUS_1]: "-1",
  [EStatBoost.MINUS_2]: "-2",
  [EStatBoost.MINUS_3]: "-3",
  [EStatBoost.MINUS_4]: "-4",
  [EStatBoost.MINUS_5]: "-5",
  [EStatBoost.MINUS_6]: "-6"
};

export const STAT_BOOSTS_MAP = {
  [EStatBoost.ZERO]: 1,
  [EStatBoost.PLUS_1]: 1.25,
  [EStatBoost.PLUS_2]: 1.4,
  [EStatBoost.PLUS_3]: 1.5,
  [EStatBoost.PLUS_4]: 1.6,
  [EStatBoost.PLUS_5]: 1.7,
  [EStatBoost.PLUS_6]: 1.8,
  [EStatBoost.MINUS_1]: 0.8,
  [EStatBoost.MINUS_2]: 0.71,
  [EStatBoost.MINUS_3]: 0.66,
  [EStatBoost.MINUS_4]: 0.62,
  [EStatBoost.MINUS_5]: 0.58,
  [EStatBoost.MINUS_6]: 0.55
};
