import { action, computed, makeObservable, observable } from "mobx";
import {
  fetchTrainer,
  fetchTrainerBase,
  fetchTrainerNamesEn,
  fetchVerboseTrainerNamesEn
} from "src/service";
import { ITrainer, ITrainerBasePicked } from "src/types/trainer";

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
      trainerOptList: computed
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

  get trainerOptList() {
    const combined = {
      ...this.trainerNamesEn,
      ...this.verboseTrainerNamesEn
    };
    return Object.entries(combined).map(([key, value]) => ({
      value: key,
      label: value
    }));
  }
}

export const trainerStore = new TrainerStore();
