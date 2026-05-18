export const fetchTrainerName = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/trainer_verbose_name_en.json"
  ).then(rsp => rsp.json());
