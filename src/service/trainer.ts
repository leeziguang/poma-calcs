import {
  ITrainerApiResponse,
  ITrainerBaseApiResponse,
  ITrainerExRoleApiResponse
} from "src/types/trainer";
import { cachedFetch } from "src/cache/cachedFetch";

export const fetchTrainer = (): Promise<ITrainerApiResponse> =>
  cachedFetch<ITrainerApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/Trainer.json"
  );

export const fetchTrainerBase = (): Promise<ITrainerBaseApiResponse> =>
  cachedFetch<ITrainerBaseApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/TrainerBase.json"
  );

export const fetchTrainerNamesEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/trainer_name_en.json"
  );

export const fetchVerboseTrainerNamesEn = (): Promise<Record<string, string>> =>
  cachedFetch<Record<string, string>>(
    "https://pokemon.brybry.ch/masters/data/lsd/trainer_verbose_name_en.json"
  );

export const fetchTrainerExRole = (): Promise<ITrainerExRoleApiResponse> =>
  cachedFetch<ITrainerExRoleApiResponse>(
    "https://pokemon.brybry.ch/masters/data/proto/TrainerExRole.json"
  );
