import { action, computed, makeObservable, observable } from "mobx";
import {
  MC_BASE_ID,
  SCRAPPED_MON_ID_PREFIX
} from "src/components/action-topbar/constants";
import {
  fetchTrainer,
  fetchTrainerBase,
  fetchTrainerNamesEn,
  fetchVerboseTrainerNamesEn
} from "src/service/trainer";
import {
  ETrainerFields,
  ETrainerKind,
  ITrainer,
  ITrainerBasePicked
} from "src/types/trainer";

export class TrainerStore {
  trainers: ITrainer[] = [];
  trainerBase: ITrainerBasePicked[] = [];
  trainerNamesEn: Record<string, string> = {};
  verboseTrainerNamesEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      trainers: observable,
      trainerBase: observable,
      trainerNamesEn: observable,
      verboseTrainerNamesEn: observable,
      setTrainers: action,
      setTrainerBase: action,
      setTrainerNamesEn: action,
      setVerboseTrainerNamesEn: action,
      trainerInfoList: computed
    });
  }

  setTrainers(trainers: ITrainer[]) {
    this.trainers = trainers;
  }

  setTrainerBase(trainerBase: ITrainerBasePicked[]) {
    this.trainerBase = trainerBase;
  }

  setTrainerNamesEn(names: Record<string, string>) {
    this.trainerNamesEn = names;
  }

  setVerboseTrainerNamesEn(names: Record<string, string>) {
    this.verboseTrainerNamesEn = names;
  }

  getTrainers() {
    return fetchTrainer().then(data => {
      this.setTrainers(data.entries);
    });
  }

  getTrainerBase() {
    return fetchTrainerBase().then(data => {
      this.setTrainerBase(
        data.entries.map(e => ({
          trainerBaseId: e.id,
          trainerNameId: e.trainerNameId
        }))
      );
    });
  }

  getTrainerNamesEn() {
    return fetchTrainerNamesEn().then(data => {
      this.setTrainerNamesEn(data);
    });
  }

  getVerboseTrainerNamesEn() {
    return fetchVerboseTrainerNamesEn().then(data => {
      this.setVerboseTrainerNamesEn(data);
    });
  }

  get trainerInfoList(): { trainerName: string; monsterId: string }[] {
    return this.trainers
      .filter(
        t =>
          t[ETrainerFields.TRAINER_KIND] === ETrainerKind.GACHA &&
          t[ETrainerFields.RARITY] >= 4 &&
          !t[ETrainerFields.MONSTER_ID].startsWith(SCRAPPED_MON_ID_PREFIX)
      )
      .map(t => {
        const trainerBase = this.trainerBase.find(
          b => b.trainerBaseId === String(t[ETrainerFields.TRAINER_BASE_ID])
        );
        // Prioritize verbose name over base name; fall back to "MC" for eggmon
        const trainerName =
          trainerBase?.trainerBaseId === MC_BASE_ID
            ? "MC"
            : this.verboseTrainerNamesEn[t[ETrainerFields.TRAINER_ID]] ||
              this.trainerNamesEn[trainerBase?.trainerNameId as string];
        return { trainerName, monsterId: t.monsterId };
      });
  }

  initApiCalls() {
    this.getTrainers();
    this.getTrainerBase();
    this.getTrainerNamesEn();
    this.getVerboseTrainerNamesEn();
  }

  reset() {
    this.trainers = [];
    this.trainerBase = [];
    this.trainerNamesEn = {};
    this.verboseTrainerNamesEn = {};
  }
}

export const trainerStore = new TrainerStore();
