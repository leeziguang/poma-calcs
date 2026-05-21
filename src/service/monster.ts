import {
  IMonsterApiResponse,
  IMonsterBaseApiResponse,
  IMonsterVariationApiResponse
} from "src/types/monster";

export const fetchMonster = (): Promise<IMonsterApiResponse> =>
  fetch("https://pokemon.brybry.ch/masters/data/proto/Monster.json").then(rsp =>
    rsp.json()
  );

export const fetchMonsterBase = (): Promise<IMonsterBaseApiResponse> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/proto/MonsterBase.json"
  ).then(rsp => rsp.json());

export const fetchMonsterNamesEn = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/monster_name_en.json"
  ).then(rsp => rsp.json());

export const fetchMonsterVariation = (): Promise<IMonsterVariationApiResponse> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/proto/MonsterVariation.json"
  ).then(rsp => rsp.json());
