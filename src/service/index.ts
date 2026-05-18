import {
  ITrainerApiResponse,
  ITrainerBaseApiResponse
} from "src/types/trainer";

export const fetchTrainer = (): Promise<ITrainerApiResponse> =>
  fetch("https://pokemon.brybry.ch/masters/data/proto/Trainer.json").then(rsp =>
    rsp.json()
  );

export const fetchTrainerBase = (): Promise<ITrainerBaseApiResponse> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/proto/TrainerBase.json"
  ).then(rsp => rsp.json());

export const fetchTrainerNamesEn = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/trainer_name_en.json"
  ).then(rsp => rsp.json());

export const fetchVerboseTrainerNamesEn = (): Promise<Record<string, string>> =>
  fetch(
    "https://pokemon.brybry.ch/masters/data/lsd/trainer_verbose_name_en.json"
  ).then(rsp => rsp.json());
