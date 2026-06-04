import {
  IMonsterApiResponse,
  IMonsterBaseApiResponse,
  IMonsterVariationApiResponse
} from "src/types/monster";
import { cachedFetch } from "src/cache/cachedFetch";

export const fetchMonster = (): Promise<IMonsterApiResponse> =>
  cachedFetch<IMonsterApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/Monster.json"
  );

export const fetchMonsterBase = (): Promise<IMonsterBaseApiResponse> =>
  cachedFetch<IMonsterBaseApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/MonsterBase.json"
  );

export const fetchMonsterNamesEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/monster_name_en.json"
  );

export const fetchMonsterVariation = (): Promise<IMonsterVariationApiResponse> =>
  cachedFetch<IMonsterVariationApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/MonsterVariation.json"
  );
