import { EMoveLevelValues } from "src/types";

export const MOVE_LEVEL_MOVE_BOOST_MAP = {
  "1": 1,
  "2": 1.05,
  "3": 1.1,
  "4": 1.15,
  "5": 1.2,
  "SA 1": 1.2,
  "SA 2": 1.2 + 0.1,
  "SA 3": 1.2 + 0.1,
  "SA 4": 1.2 + 0.1 + 0.3,
  "SA 5": 1.2 + 0.1 + 0.3
} as Record<string, number>;

/**
 * @description Increase in sync damage based on move level, from 1/5 to SA5, includes MAX moves
 */
export const MOVE_LEVEL_SYNC_BOOST_MAP = {
  "1": 1,
  "2": 1.05,
  "3": 1.1,
  "4": 1.15,
  "5": 1.2,
  "SA 1": 1.2,
  "SA 2": 1.2,
  "SA 3": 1.2 + 0.2,
  "SA 4": 1.2 + 0.2,
  "SA 5": 1.2 + 0.2
} as Record<string, number>;

export const MOVE_LEVEL_STAT_BOOST_MAP = {
  "1": 1,
  "2": 1,
  "3": 1,
  "4": 1,
  "5": 1,
  "SA 1": 1.1,
  "SA 2": 1.1,
  "SA 3": 1.1,
  "SA 4": 1.1,
  "SA 5": 1.1
} as Record<string, number>;

export const MOVE_LEVEL_OPTIONS = Object.values(EMoveLevelValues).map(val => ({
  label: val,
  value: val
}));

export const MC_BASE_ID = "10700000";
export const SCRAPPED_MON_ID_PREFIX = "29999";
