import { IMoveApiResponse } from "src/types/move";

export const fetchMove = (): Promise<IMoveApiResponse> =>
  fetch("https://pokemon.brybry.ch/masters/data/proto/Move.json").then(rsp =>
    rsp.json()
  );

export const fetchMoveNamesEn = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/move_name_en.json"
  ).then(rsp => rsp.json());
