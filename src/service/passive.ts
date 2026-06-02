import {
  IPassiveSkillChildApiResponse,
  IMoveAndPassiveSkillDigitApiResponse
} from "src/types/passive";

export const fetchPassiveSkillNamesEn = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_en.json"
  ).then(rsp => rsp.json());

export const fetchPassiveSkillNamePartsEn = (): Promise<Record<
  string,
  string
>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_parts_en.json"
  ).then(rsp => rsp.json());

export const fetchPassiveSkillDescriptionEn = (): Promise<Record<
  string,
  string
>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_description_en.json"
  ).then(rsp => rsp.json());

export const fetchPassiveSkillChild = (): Promise<IPassiveSkillChildApiResponse> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/proto/PassiveSkillChild.json"
  ).then(rsp => rsp.json());

export const fetchMoveAndPassiveSkillDigit = (): Promise<IMoveAndPassiveSkillDigitApiResponse> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/proto/MoveAndPassiveSkillDigit.json"
  ).then(rsp => rsp.json());
