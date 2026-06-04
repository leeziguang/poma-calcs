import {
  IPassiveSkillChildApiResponse,
  IMoveAndPassiveSkillDigitApiResponse
} from "src/types/passive";
import { cachedFetch } from "src/cache/cachedFetch";

export const fetchPassiveSkillNamesEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_en.json"
  );

export const fetchPassiveSkillNamePartsEn = (): Promise<Record<
  string,
  string
>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_parts_en.json"
  );

export const fetchPassiveSkillDescriptionEn = (): Promise<Record<
  string,
  string
>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_description_en.json"
  );

export const fetchPassiveSkillDescriptionPartsEn = (): Promise<Record<
  string,
  string
>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_description_parts_en.json"
  );

export const fetchPassiveSkillChild = (): Promise<IPassiveSkillChildApiResponse> =>
  cachedFetch<IPassiveSkillChildApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/PassiveSkillChild.json"
  );

export const fetchMoveAndPassiveSkillDigit = (): Promise<IMoveAndPassiveSkillDigitApiResponse> =>
  cachedFetch<IMoveAndPassiveSkillDigitApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/MoveAndPassiveSkillDigit.json"
  );
