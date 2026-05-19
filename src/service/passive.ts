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
