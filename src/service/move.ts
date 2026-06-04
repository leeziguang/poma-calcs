import { IMoveApiResponse } from "src/types/move";
import { cachedFetch } from "src/cache/cachedFetch";

export const fetchMove = (): Promise<IMoveApiResponse> =>
  cachedFetch<IMoveApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/Move.json"
  );

export const fetchMoveNamesEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/move_name_en.json"
  );

export const fetchMoveDescriptionEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/move_description_en.json"
  );

export const fetchMoveDescriptionPartsEn = (): Promise<Record<
  string,
  string
>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/move_description_parts_en.json"
  );
